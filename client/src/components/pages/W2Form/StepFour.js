import React, {
  createRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import W2Stub from "./W2Stub";
import "./wstub.css";
import Modal from "./ModalW2";
import AC from "../../../redux/actions/actionCreater";
import { connect } from "react-redux";
import {
  checkoutAddLineItems,
  checkoutUpdateAttributes,
} from "../../../graphql";
import { checkoutPaymentDone } from "../../../graphql";
import { graphQLClient } from "../../../HelperFunctions/apollo";
import { Button } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import * as htmlToImage from "html-to-image";
import { Fragment } from "react";
import { axios } from "../../../HelperFunctions/axios";

const variantID =
  "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zOTQwMTEwMjIxMzI4OQ==";

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
    height, // source rect with content to crop
    0,
    0,
    width,
    height
  ); // newCanvas, same size as source rect
  return _canvas;
};

function StepFour(props) {
  const [webUrl, setWebUrl] = useState();
  const [checkoutId, setCheckoutId] = useState();
  const [checkoutState, setCheckoutState] = useState();
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

  const checkForOrderCompletion = useMemo(
    () => () => {
      if (!checkoutState?.orderStatusUrl && checkoutId) {
        graphQLClient
          .request(checkoutPaymentDone, {
            id: checkoutId,
          })

          .then((data) => {
            setCheckoutState(data.node);
          });
      }
    },
    [checkoutId, checkoutState]
  );

  useEffect(() => {
    graphQLClient
      .request(checkoutAddLineItems, {
        data: {
          lineItems: [
            {
              variantId: variantID,
              quantity: 1,
            },
          ],
        },
      })
      .then((data) => {
        const { webUrl, id } = data.checkoutCreate.checkout;
        setWebUrl(webUrl);
        setCheckoutId(id);
      });
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", checkForOrderCompletion);

    return () => {
      document.removeEventListener("visibilitychange", checkForOrderCompletion);
    };
  }, [checkForOrderCompletion]);

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

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      axios
        .post("/api/w2/cache", {
          image: screenshot,
          checkoutId,
        })
        .then((res) => {
          console.log(res.data);
          setZipFile(res.data.zipFile);
          !zipFile &&
            graphQLClient
              .request(checkoutUpdateAttributes, {
                checkoutId,
                input: {
                  customAttributes: [
                    {
                      key: "file",
                      value: res.data.zipFile,
                    },
                    {
                      key: "checkoutId",
                      value: checkoutId,
                    },
                  ],
                },
              })
              .then((data) => {
                console.log(data);
              })
              .catch((err) => {
                console.log(err);
              });
        })
        .catch((err) => {
          console.log(err);
        });
      setClicked(false);
    }
  }, [clicked, zipFile]);

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
          {checkoutState?.orderStatusUrl ? (
            <Button
              onClick={(e) => {
                let link =
                  process.env.REACT_APP_MODE === "development"
                    ? `http://localhost:5000/`
                    : "https://www.drpaystub.net/";
                window.open(link + zipFile);
                setDisableButton(true);
              }}
              className="btn btn-secondary"
            >
              Click here to Download
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                window.open(webUrl, "_blank");
                setClicked(true);
              }}
              className="btn btn-secondary"
            >
              Check out
            </Button>
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

const options = {
  orientation: "landscape",
  precision: 20,
};
