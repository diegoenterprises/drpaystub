import React, { useEffect, useState } from "react";
import "./success.css";
import { useLocation, useParams } from "react-router";
import { axios } from "../../../HelperFunctions/axios";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [zip, setZip] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const { id } = useParams();
  let query = useQuery();
  const template = query.get("template");

  const loadApp = async () => {
    const { data } = await axios.post("/api/paystub/getZip", {
      paystubId: id,
      template,
    });
    setZip(data.zipSrc);
    setIsSuccess(true);
  };

  useEffect(() => {
    if (id && template) {
      loadApp();
    }
  }, [id, template]);

  const downloadZip = () => {
    const [_, ziplink] = zip.split("/");
    let link =
      process.env.REACT_APP_MODE === "developement"
        ? process.env.REACT_APP_BACKEND_URL_LOCAL
        : "https://www.drpaystub.net/";
    const zipLinkDown = link + ziplink;
    window.open(zipLinkDown);
    setDownloaded(true);
  };

  return (
    <div className="success-page">
      {/* Animated background particles */}
      <div className="success-particles" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="success-particle" style={{
            "--x": `${Math.random() * 100}%`,
            "--y": `${Math.random() * 100}%`,
            "--size": `${2 + Math.random() * 4}px`,
            "--delay": `${Math.random() * 6}s`,
            "--duration": `${4 + Math.random() * 6}s`,
          }} />
        ))}
      </div>

      {/* Confetti burst (only when success) */}
      {isSuccess && (
        <div className="success-confetti" aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="confetti-piece" style={{
              "--angle": `${-30 + Math.random() * 60}deg`,
              "--spread": `${50 + Math.random() * 250}px`,
              "--fall": `${300 + Math.random() * 400}px`,
              "--hue": `${Math.random() * 360}`,
              "--delay": `${Math.random() * 0.5}s`,
              "--size": `${4 + Math.random() * 6}px`,
              left: `${40 + Math.random() * 20}%`,
            }} />
          ))}
        </div>
      )}

      <div className={`success-card ${isSuccess ? "success-card--ready" : ""}`}>
        {/* Loading State */}
        {!isSuccess && (
          <div className="success-loading">
            <div className="success-spinner">
              <svg viewBox="0 0 50 50" className="success-spinner-svg">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="3" />
              </svg>
            </div>
            <h3 className="success-title success-title--loading">
              Preparing your payroll documents
            </h3>
            <div className="success-shimmer-bar" />
            <p className="success-subtitle">
              Applying security layers &amp; formatting&hellip;
            </p>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="success-content">
            {/* Animated checkmark */}
            <div className="success-check-ring">
              <svg className="success-check-svg" viewBox="0 0 52 52">
                <circle className="success-check-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="success-check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>

            <h3 className="success-title">Payment Complete</h3>

            <div className="success-info">
              <div className="success-info-row">
                <span className="success-info-icon">
                  <i className="fa fa-envelope"></i>
                </span>
                <span className="success-info-text">
                  Pay stubs emailed as PDF attachments
                </span>
              </div>
              <div className="success-info-row">
                <span className="success-info-icon">
                  <i className="fa fa-shield"></i>
                </span>
                <span className="success-info-text">
                  Snappt-compliant security embedded
                </span>
              </div>
            </div>

            <button
              onClick={downloadZip}
              className="success-download-btn"
              type="button"
            >
              <span className="success-download-btn-bg" />
              <span className="success-download-btn-content">
                <i className={`fa ${downloaded ? "fa-check" : "fa-download"}`}></i>
                {downloaded ? "Downloaded" : "Download Pay Stubs"}
              </span>
            </button>

            {downloaded && (
              <p className="success-downloaded-hint">
                Check your downloads folder
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
