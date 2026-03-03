import React from "react";
import { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import SignatureCanvas from "react-signature-canvas";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DigitalSignature({ setSignature }) {
  const classes = useStyles();
  const sigCanvas = useRef();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    const sign = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    setSignature(sign);
    handleClose();
  };

  return (
    <div>
      <button
        className="btn btn-outline-new mt-3"
        style={{ marginBottom: "34px" }}
        onClick={handleClickOpen}
      >
        Add Digital Signature
      </button>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Please sign here
            </Typography>
            <Button autoFocus color="inherit" onClick={save}>
              Save
            </Button>
            <Button autoFocus color="inherit" onClick={clear}>
              Clear
            </Button>
          </Toolbar>
        </AppBar>
        <SignatureCanvas
          penColor="black"
          canvasProps={{ className: "sigCanvas" }}
          ref={sigCanvas}
        />
      </Dialog>
    </div>
  );
}
