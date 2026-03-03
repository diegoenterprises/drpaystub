import React, { useState } from 'react';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import { Col, Row } from 'react-bootstrap';
import { MyVerticallyCenteredModal } from './Modal';

export default function CustomizedRatings({ addReviewCb }) {
    const [modalShow, setModalShow] = React.useState(false);
    const [rating, setRating] = useState(2);
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Row>
                <Col style={{ margin: 20, marginRight: '0', flexWrap: 'nowrap', display: 'flex', overflowX: 'visible' }}>
                    <Typography style={{ fontWeight: 'bolder', fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: 25, width: 230 }}>Give us Feedback:</Typography>
                </Col>
                <Col style={{ margin: 25, marginLeft: 0 }}>
                    <Rating
                        onChange={(e, number) => {
                            setRating(number);
                            setModalShow(true);
                        }}
                        value={rating}
                    />
                </Col>
            </Row>

            <MyVerticallyCenteredModal addReviewCb={addReviewCb} show={modalShow} onHide={() => setModalShow(false)} rating={rating} />
        </div>
    );
}
