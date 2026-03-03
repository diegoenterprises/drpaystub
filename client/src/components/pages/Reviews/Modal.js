import { Modal, Button } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import Rating from "@material-ui/lab/Rating";

import { useForm } from "react-hook-form";
import { axios } from "../../../HelperFunctions/axios";

export function MyVerticallyCenteredModal(props) {
  const { rating, addReviewCb } = props;
  const [modalRating, setModalRating] = useState(rating);

  const { handleSubmit, register } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/reviews", {
        ...data,
        rating: modalRating,
      });
      addReviewCb(response.data.review);
      props.onHide();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">FEEDBACK</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <h4 style={{ textDecoration: 'underline' }}>Your feedback is important to us</h4> */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-column align-items-center"
          style={{ width: "100%" }}
        >
          <Rating
            name="rating"
            onChange={(e, number) => {
              setModalRating(number);
            }}
            defaultValue={rating}
          />
          <br />
          <label
            style={{ fontWeight: "bold" }}
            htmlFor="selectedState"
            className="label-input"
          >
            Form Type:
          </label>

          <select className="form-control" name="product" ref={register}>
            <option value="PaystubForm">Paystub Form </option>
            <option value="W2Form">W2 form</option>
          </select>

          <label style={{ fontWeight: "bold" }}>Name:</label>

          <input
            placeholder="Ex. Diego Usoro"
            name="customer_name"
            className="form-control"
            ref={register}
          />

          <label style={{ fontWeight: "bold" }}>Email:</label>

          <input
            placeholder="Ex. Email"
            name="customer_email"
            className="form-control"
            ref={register}
          />

          <label style={{ fontWeight: "bold" }}>Your Review:</label>

          <textarea
            placeholder="Your feedback"
            className="form-control"
            name="description"
            ref={register}
          />
          <br />
          <Button variant="outline-success" type="submit">
            Submit
          </Button>
        </form>
      </Modal.Body>
      {/* <Modal.Footer>
                <Button variant="outline-primary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer> */}
    </Modal>
  );
}

function App() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        style={{ height: "50px" }}
        variant="primary"
        onClick={() => setModalShow(true)}
      >
        Feedback
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default App;
