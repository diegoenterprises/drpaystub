import React, { useEffect, useState } from "react";
import {
  PaymentRequestButtonElement,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { axios } from "../../../HelperFunctions/axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
const {
  REACT_APP_MODE,
  REACT_APP_FRONTEND_URL_LOCAL,
  REACT_APP_FRONTEND_URL_LIVE,
} = process.env;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CheckoutForm = ({ paystubId, template, secret, amount }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe && amount) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Saurellius Pay Stub",
          amount: Math.round(amount * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);

          pr.on("paymentmethod", async (ev) => {
            const { paymentIntent, error: confirmError } =
              await stripe.confirmCardPayment(
                secret,
                { payment_method: ev.paymentMethod.id },
                { handleActions: false }
              );

            if (confirmError) {
              ev.complete("fail");
              setMessage(confirmError.message);
              setOpen(true);
            } else {
              ev.complete("success");
              if (paymentIntent.status === "requires_action") {
                const { error } = await stripe.confirmCardPayment(secret);
                if (error) {
                  setMessage(error.message);
                  setOpen(true);
                }
              }
            }
          });
        }
      });
    }
  }, [stripe, amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    let url = REACT_APP_FRONTEND_URL_LOCAL;
    if (REACT_APP_MODE === "live") {
      url = REACT_APP_FRONTEND_URL_LIVE;
    }
    const redirectUrl = `${url}paystubs/success/${paystubId}?template=${template}`;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: redirectUrl,
      },
    });

    if (result.error) {
      setMessage(result.error.message);
      setOpen(true);
      setTimeout(() => setOpen(false), 4000);
    }
    setLoading(false);
  };

  return (
    <div className="checkout-form-wrapper">
      {/* Apple Pay / Google Pay */}
      {paymentRequest && (
        <div className="checkout-express">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: "default",
                  theme: "dark",
                  height: "48px",
                },
              },
            }}
          />
          <div className="checkout-or">
            <span>or pay with card</span>
          </div>
        </div>
      )}

      {/* Stripe Payment Element */}
      <PaymentElement
        options={{
          layout: "tabs",
          fields: {
            billingDetails: {
              name: "auto",
              email: "auto",
            },
          },
        }}
      />

      {/* Submit Button */}
      <button
        disabled={!stripe || loading}
        type="button"
        className="checkout-submit-btn"
        onClick={handleSubmit}
      >
        {loading ? (
          <span className="checkout-spinner"></span>
        ) : (
          <>
            <i className="fa fa-lock" style={{ marginRight: "8px", fontSize: "13px" }}></i>
            Pay ${amount}
          </>
        )}
      </button>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={() => setOpen(false)}
        key="bottomcenter"
      >
        <Alert severity="error">{message}</Alert>
      </Snackbar>
    </div>
  );
};

export default CheckoutForm;
