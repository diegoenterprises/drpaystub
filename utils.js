const multer = require('multer');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stat = require('fs').statSync;
const AdmZip = require('adm-zip');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

function zipFiles({ zipFileName, pathNames }) {
    return new Promise((res, rej) => {
        const zip = new AdmZip();

        pathNames.forEach(path => {
            const p = stat(path);

            if (p.isFile()) {
                zip.addLocalFile(path);
            } else if (p.isDirectory()) {
                zip.addLocalFolder(path, path);
            }
        });

        zip.writeZip(zipFileName, err => {
            if (err) return rej(err);
            return res(zipFileName);
        });
    });
}

const saveW2 = ({ base64, checkoutId }) => {
    return new Promise(async (res, rej) => {
        try {
            const base64Data = base64.replace(/^data:image\/png;base64,/, '');
            const source = path.join('public', `${checkoutId}.png`);
            fs.writeFile(source, base64Data, 'base64', () => {
                let pdfFilename = `${checkoutId}.pdf`;
                let pdfFilePath = `public/${pdfFilename}`;

                const doc = new PDFDocument();
                const stream = doc.pipe(fs.createWriteStream(pdfFilePath));

                doc.image(path.join(source), {
                    fit: [500, 500],
                });
                doc.end();

                stream.on('finish', async () => {
                    const zipName = `${checkoutId}.zip`;
                    await zipFiles({
                        zipFileName: `public/${zipName}`,
                        pathNames: [pdfFilePath],
                    });
                    res(zipName);
                });
            });
        } catch (error) {
            rej(error);
        }
    });
};

module.exports = {
    upload,
    saveW2,
    zipFiles,
};
