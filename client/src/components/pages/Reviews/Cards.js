import { Card, Col } from 'react-bootstrap';
import React from 'react';
import GradeIcon from '@material-ui/icons/Grade';
import moment from 'moment';

export default function Cards({ reviews }) {
    const cardsArray = reviews?.map(robot => {
        return (
            <Col md={6} xs={12} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Card style={{ width: '20rem', backgroundColor: 'aliceblue ', marginBottom: '4%' }}>
                    <Card.Body>
                        <Card.Title>{robot.customer_name}</Card.Title>
                        <Card.Subtitle className="mb-2" style={{ fontSize: 10 }}>
                            {moment(new Date(robot.createdAt)).format('DD-MM-YYYY')}
                        </Card.Subtitle>
                        <Card.Subtitle style={{ display: 'flex', justifyContent: 'flex-start', fontSize: 15 }}>
                            {robot.rating}
                            <GradeIcon style={{ color: '#FFD700', fontSize: 20 }} />
                        </Card.Subtitle>

                        <Card.Text>{robot.description}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        );
    });
    return cardsArray;
}
