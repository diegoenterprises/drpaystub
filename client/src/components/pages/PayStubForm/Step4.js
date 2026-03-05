import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AC from "../../../redux/actions/actionCreater";
import { Carousel } from "react-responsive-carousel";
import { Button } from "react-bootstrap";
import "./PayStubForm.scss";
import { axios } from "../../../HelperFunctions/axios";
import { Checkout } from "./Checkout";
import { confirmAlert } from "react-confirm-alert";

const {
  REACT_APP_MODE,
  REACT_APP_FRONTEND_URL_LOCAL,
  REACT_APP_FRONTEND_URL_LIVE,
  REACT_APP_BACKEND_URL_LOCAL,
} = process.env;

function Step4(props) {
  const intial = {
    loaded: false,
    images: [],
  };
  const [index, setIndex] = useState(0);
  const [paystubCount, setPaystubCount] = useState(0);
  const [template, setTemplate] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [pageStatus, setPageStatus] = useState("pending");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(null);
  const [paystubId, setPaystubId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const TOTAL_TEMPLATES = 21;
  const [templateImages, setTemplateImages] = useState({});
  const [currentImages, setCurrentImages] = useState([]);
  const [userData, setUserData] = useState();

  const componentRef = useRef();

  const handleGetUser = async () => {
    let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
    if (process.env.REACT_APP_MODE === "live") {
      url = process.env.REACT_APP_FRONTEND_URL_LIVE;
    }
    const token = localStorage.getItem("tokens");
    const data = "";
    var config = {
      method: "get",
      url: `${url}api/auth/get-user`,
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: data,
    };
    try {
      const response = await axios(config);
      setUserData(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    handleGetUser();
  }, []);

  const handleTemplateChange = (tem) => {
    setTemplate(tem);
    const entry = templateImages[tem];
    if (entry) {
      setCurrentImages(Array.isArray(entry) ? entry : entry.images || []);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      props.loadingFn(true);

      const _params = {
        ...props.step1,
        ...props.step2,
        ...props.step3,
        company_image: props.company_image,
        paymentStatus: "draft",
        userId: localStorage.getItem("userId"),
      };
      // const _params = {
      //   company_name: "Raftu",
      //   company_address: "#13",
      //   company_address_2: "Babu school",
      //   company_city: "Mohali",
      //   company_state: "",
      //   companyZipCode: "",
      //   company_phone: "123441232",
      //   company_ein: "33-3412312",
      //   emailAddress: "coco@yopmail.com",
      //   employment_status: "Hourly",
      //   employee_name: "Akhil sharma",
      //   employee_address: "#145,",
      //   employee_address_2: "Phase 8 ",
      //   employee_city: "Punjab",
      //   employee_state: "IOWA",
      //   employeeZipCode: "12121",
      //   employee_Id: "123123",
      //   maritial_status: "Single Taxpayers",
      //   noOfDependants: "",
      //   blindExemptions: "",
      //   ssid: "XXX-XX-1234",
      //   hourly_rate: "20",
      //   pay_frequency: "Weekly",
      //   hours_worked_per_payPeriod: "12",
      //   check_number: "321123",
      //   startDate: "16/06/2023",
      //   pay_dates: ["21/02/2023", "14/02/2023"],
      //   actual_pay_dates: ["25/02/2023", "19/02/2023"],
      //   hire_date: "28/02/2023",
      //   EmployeeHiredIn2021: false,
      //   additions: [],
      //   deductions: [],
      //   check_numbers: ["123123", "321123"],
      //   hours_worked: ["12", "31"],
      // };
      setEmail(_params.emailAddress);
      const paydates = _params.pay_dates.length;
      setPaystubCount(paydates);
      setAmount(20 * paydates);
      const { company_image, ...params } = _params;

      const formData = new FormData();
      formData.append("params", JSON.stringify(params));
      formData.append("company_image", company_image || null);

      const { data } = await axios.post("/api/paystub/save-stub", formData);
      if (data.status === false) {
        setPageStatus("error");
        setErrorMessage(data.message);
        return;
      }
      setPaystubId(data.paystub._id);
      getPaystubs(data.paystub._id);
    })();
  }, []);

  const getPaystubs = async (id) => {
    const { data } = await axios.post("/api/paystub/templates", {
      paystubId: id,
      template: 1,
    });
    if (data.status === false) {
      setPageStatus("error");
      setErrorMessage(data.message);
      return;
    }

    const paystubImagesOne = data.templates;
    setTemplateImages((prev) => ({ ...prev, 1: paystubImagesOne }));
    setCurrentImages([...paystubImagesOne]);
    setPageStatus("show");

    const loadTemplate = async (num) => {
      try {
        const { data } = await axios.post("/api/paystub/templates", {
          paystubId: id,
          template: num,
        });
        if (data.success !== false && data.templates) {
          return { num, loaded: true, images: data.templates };
        } else {
          console.warn(`Template ${num} failed:`, data.message);
          return { num, loaded: true, images: paystubImagesOne };
        }
      } catch (err) {
        console.error(`Template ${num} error:`, err);
        return { num, loaded: true, images: paystubImagesOne };
      }
    };

    // Load templates 2-21 in parallel
    const others = [];
    for (let i = 2; i <= TOTAL_TEMPLATES; i++) others.push(loadTemplate(i));
    const results = await Promise.all(others);
    const newMap = { 1: paystubImagesOne };
    results.forEach((r) => { newMap[r.num] = { loaded: true, images: r.images }; });
    setTemplateImages(newMap);
  };

  const downloadZip = () => {
    let url = REACT_APP_FRONTEND_URL_LOCAL;
    if (REACT_APP_MODE === "live") {
      url = REACT_APP_FRONTEND_URL_LIVE;
    }
    const redirectUrl = `${url}paystubs/success/${paystubId}?template=${template}`;
    window.location = redirectUrl;
  };

  return (
    <>
      <div className="PayStubForm formStep mt-3 text-center w-100">
        <div className="d-flex flex-column w-100">
          <form>
            <span className="badge badge-pill badge-soft-primary">Step 4</span>
            <h2>Preview Digital Payroll Checkstub</h2>
            <p className="text-muted">
              Choose your preferred template, revise your information and
              download your stub(s)
              <br />
              Note: All watermarks and background images will be removed from
              your final document(s)
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
              {Array.from({ length: TOTAL_TEMPLATES }, (_, i) => i + 1).map((num) => {
                const entry = templateImages[num];
                const isLoaded = num === 1 ? !!entry : entry?.loaded;
                const isActive = template === num;
                return (
                  <button
                    key={num}
                    type="button"
                    className={`btn ${isActive ? "btn-primary" : "btn-outline-primary"}`}
                    style={{ minWidth: 100, margin: 2 }}
                    disabled={!isLoaded}
                    onClick={() => handleTemplateChange(num)}
                  >
                    {isLoaded ? `Template ${num}` : "Loading"}
                  </button>
                );
              })}
            </div>
            <hr />
            {pageStatus === "show" && (
              <>
                <Carousel
                  renderIndicator={(
                    onClickHandler,
                    isSelected,
                    index,
                    label
                  ) => {
                    const indicatorStyles = {
                      background: "#fff",
                      width: 8,
                      height: 8,
                      display: "inline-block",
                      margin: "10px 8px",
                      border: "1px solid #000",
                    };
                    if (isSelected) {
                      return (
                        <li
                          style={{ ...indicatorStyles, background: "#000" }}
                          aria-label={`Selected: ${label} ${index + 1}`}
                          title={`Selected: ${label} ${index + 1}`}
                        />
                      );
                    }
                    return (
                      <li
                        style={indicatorStyles}
                        onClick={() => {
                          setIndex(index);
                          onClickHandler();
                        }}
                        value={index}
                        key={index}
                        role="button"
                        tabIndex={0}
                        title={`${label} ${index + 1}`}
                        aria-label={`${label} ${index + 1}`}
                      />
                    );
                  }}
                >
                  {currentImages.map((el, idx) => (
                    <div className="row" key={idx}>
                      <div className="col-sm-12">
                        <iframe
                          title={`Paystub preview ${idx + 1}`}
                          src={`${
                            REACT_APP_MODE === "developement"
                              ? REACT_APP_BACKEND_URL_LOCAL
                              : "https://www.drpaystub.net/"
                          }${el}#zoom=page-fit`}
                          style={{ width: "100%", height: "820px", border: "1px solid #ddd", borderRadius: "8px" }}
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>

                <div className="text-center mt-4">
                  {paymentStatus === "pending" ? (
                    <>
                      <Checkout
                        paystubId={paystubId}
                        template={template}
                        amount={amount}
                        paydates={paystubCount}
                        setPaymentStatus={setPaymentStatus}
                      />
                      <p className="text-muted mt-3">
                        <small>
                          Make sure your information is correct and continue to pay
                          and download your stub(s)
                        </small>
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ marginBottom: "0px" }}>
                        Stub(s) will be sent to the following email address
                      </p>
                      <p>
                        <strong>{email}</strong>
                      </p>
                      <Button
                        onClick={downloadZip}
                        className="btn btn-secondary mt-4"
                      >
                        Click here to Download
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
            {pageStatus === "error" && (
              <h3 className="my-3" style={{ color: "red" }}>
                {errorMessage}
              </h3>
            )}
            {pageStatus === "pending" && (
              <div className="gen-loading">
                <div className="gen-doc">
                  <div className="gen-doc-header" />
                  <div className="gen-doc-line gen-doc-line--1" />
                  <div className="gen-doc-line gen-doc-line--2" />
                  <div className="gen-doc-line gen-doc-line--3" />
                  <div className="gen-doc-line gen-doc-line--4" />
                  <div className="gen-doc-line gen-doc-line--5" />
                  <div className="gen-doc-scan" />
                  <div className="gen-doc-shield">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path className="gen-doc-shield-check" d="M9 12l2 2 4-4"/>
                    </svg>
                  </div>
                </div>
                <h3 className="gen-title">Digitizing Payroll Checkstub</h3>
                <div className="gen-progress">
                  <div className="gen-progress-bar" />
                </div>
                <p className="gen-subtitle">Applying security layers &amp; formatting&hellip;</p>
              </div>
            )}
          </form>
        </div>
      </div>
      {/* )} */}
    </>
  );
}

export default connect((state) => state, {
  loadingFn: AC.loading,
  getUserDataSuccess: AC.getUserDataSuccess,
})(Step4);
