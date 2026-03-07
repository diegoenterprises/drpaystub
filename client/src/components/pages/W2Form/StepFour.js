import React, {
  createRef,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import W2Stub from "./W2Stub";
import "./wstub.css";
import Modal from "./ModalW2";
import AC from "../../../redux/actions/actionCreater";
import { connect } from "react-redux";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import * as htmlToImage from "html-to-image";
import { Fragment } from "react";
import { axios } from "../../../HelperFunctions/axios";

const {
  REACT_APP_STRIPE_LIVE_KEY,
  REACT_APP_STRIPE_TEST_KEY,
  REACT_APP_STRIPE_MODE,
  REACT_APP_MODE,
} = process.env;
const stripeKey =
  REACT_APP_STRIPE_MODE === "dev"
    ? REACT_APP_STRIPE_TEST_KEY
    : REACT_APP_STRIPE_LIVE_KEY;
const stripePromise = loadStripe(stripeKey);

const isDark = () =>
  document.documentElement.getAttribute("data-theme") === "dark" ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const stripeAppearance = () => {
  const dark = isDark();
  return {
    theme: dark ? "night" : "stripe",
    variables: {
      colorPrimary: "#7c5cfc",
      colorBackground: dark ? "#1a1a2e" : "#ffffff",
      colorText: dark ? "#e0e0e0" : "#1a1a2e",
      colorDanger: "#ff5252",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderRadius: "10px",
    },
  };
};

// ─── Inline W2 Payment Form ────────────────────────────────────────────────
function W2PaymentForm({ secret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else if (result.paymentIntent?.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <p style={{ color: "#ff5252", marginTop: 10, fontSize: 14 }}>{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-primary mt-3"
        style={{ width: "100%", padding: "12px", fontWeight: 600 }}
      >
        {loading ? "Processing..." : "Pay $20.00"}
      </button>
    </form>
  );
}

const changeCanvasDimensions = (canvasSource, { width }) => {
  const canvas = cropCanvas(canvasSource, 0, 0, 845, 600);
  const ratio = canvas.width / canvas.height;
  let canvas_height = window.innerHeight;
  let canvas_width = canvas_height * ratio;
  if (canvas_width > window.innerWidth) {
    canvas_width = width;
    canvas_height = canvas_width / ratio;
  }

  canvas.style.width = "100%";
  canvas.style.height = "auto";

  return canvas;
};

const cropCanvas = (sourceCanvas, left, top, width, height) => {
  let _canvas = document.createElement("canvas");
  _canvas.width = width;
  _canvas.height = height;
  _canvas.getContext("2d").drawImage(
    sourceCanvas,
    left,
    top,
    width,
    height,
    0,
    0,
    width,
    height
  );
  return _canvas;
};

function StepFour(props) {
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [medicare, setMedicare] = useState();
  const [federal_income_tax, setFederal_income_tax] = useState();
  const [other_compensation, setOther_compensation] = useState();
  const [state_income_tax, setState_income_tax] = useState();
  const [social_security, setSocial_security] = useState();
  const [response, setResponse] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [screenshot, setScreenshot] = useState();
  const [zipFile, setZipFile] = useState();

  const screenshotRef = createRef();
  const printRef = createRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    props.responseFn({
      federal_income_tax: federal_income_tax,
      other_compensation: other_compensation,
      state_income_tax: state_income_tax,
      medicare: medicare,
      social_security: social_security,
    });
  }, [medicare]);

  // Fetch Stripe payment intent on mount
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("tokens");
        const headers = token ? { Authorization: `bearer ${token}` } : {};
        const { data } = await axios.get("/api/w2/payment-intent", { headers });
        if (data.secret) {
          setClientSecret(data.secret);
        }
      } catch (err) {
        console.error("[W2] Payment intent error:", err);
      }
    })();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      props.loadingFn(true);
      const response = await axios.post("/api/w2", {
        ...props.stepOne,
        ...props.stepTwo,
        ...props.stepThree,
      });
      props.loadingFn(false);
      if (response.data.success) {
        setResponse(response.data);
      }

      setSocial_security(response.data.params["Social Security"]);
      setFederal_income_tax(response.data.params.federal_income_tax);
      setOther_compensation(response.data.params.other_compensation);
      setState_income_tax(response.data.params.state_income_tax);
      setMedicare(response.data.params.Medicare);
    })();
  }, []);

  const takeScreenshot = (cb) => {
    htmlToImage
      .toCanvas(screenshotRef.current)
      .then((canvas) => {
        const parent = document.getElementById("image-parent-node");

        const transformedCanvas = changeCanvasDimensions(canvas, {
          width: parent.clientWidth,
        });
        const base64 = transformedCanvas.toDataURL();

        setScreenshot(base64);
        cb && cb(base64);
      })
      .catch((err) => console.log(err));
  };

  useLayoutEffect(() => {
    response && takeScreenshot();
  }, [response]);

  // After payment succeeds, save the W2 image and get the zip file
  const handlePaymentSuccess = async () => {
    setPaymentComplete(true);
    if (screenshot) {
      try {
        const res = await axios.post("/api/w2/cache", {
          image: screenshot,
          checkoutId: "stripe_" + Date.now(),
        });
        if (res.data?.zipFile) {
          setZipFile(res.data.zipFile);
        }
      } catch (err) {
        console.error("[W2] Cache save error:", err);
      }
    }
  };

  return (
    <div className="PayStubForm  mt-5 stepTwo">
      <Fragment>
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: -99,
          }}
        >
          <W2Stub ref={screenshotRef} />
        </div>
      </Fragment>
      <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <span className="badge badge-pill badge-soft-primary">Step 4</span>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>Preview your Ready to file W2 </h2>
        </div>
        <div className="form-group" style={{ width: "100%" }}>
          <Modal
            onClose={() => {
              takeScreenshot();
            }}
            federal_income_tax={federal_income_tax}
            other_compensation={other_compensation}
            state_income_tax={state_income_tax}
            medicare={medicare}
            social_security={social_security}
            disable={disableButton}
          />
        </div>

        <div className="form-group" id="image-parent-node">
          {screenshot && (
            <img
              style={{
                width: "100%",
              }}
              src={screenshot}
              ref={printRef}
            />
          )}
        </div>
        <div className="text-center mt-4">
          {paymentComplete && zipFile ? (
            <Button
              onClick={(e) => {
                let link =
                  REACT_APP_MODE === "development"
                    ? `http://localhost:5000/`
                    : "https://www.drpaystub.net/";
                window.open(link + zipFile);
                setDisableButton(true);
              }}
              className="btn btn-secondary"
            >
              Click here to Download
            </Button>
          ) : paymentComplete && !zipFile ? (
            <div>
              <p>Processing your W2 file...</p>
            </div>
          ) : clientSecret ? (
            <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "left" }}>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: stripeAppearance(),
                }}
              >
                <W2PaymentForm
                  secret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
              <p className="text-muted mt-3 text-center">
                <small>
                  <i className="fa fa-lock" style={{ marginRight: 4 }}></i>
                  Secured by Stripe &middot; $20.00
                </small>
              </p>
            </div>
          ) : (
            <p className="text-muted">Loading payment form...</p>
          )}

          <p className="text-muted mt-3">
            <small>
              Make sure your information is correct and continue to pay and
              download your stub(s)
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}
export default connect((state) => state, {
  loadingFn: AC.loading,
  responseFn: AC.response,
})(StepFour);
