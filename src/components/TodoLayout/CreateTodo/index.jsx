import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from "react-bootstrap";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


function Index() {

  const [date, setDate] = useState(new Date());

  


  return (
    <>
     <Container>

    
<Form onSub>
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Title</Form.Label>
    <Form.Control type="text" placeholder="Enter title" />
    
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Check me out" />
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Target</Form.Label>
    <DatePicker selected={date} onChange={date => setDate(date)} />
  </Form.Group>

  
   
 
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
</Container>
    </>
   
  );
}

export default Index;