import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment/moment";

function Index() {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [date, setDate] = useState();

  // const dateObject = new Date()
  // const d = dateObject.getDate();
  // const m=dateObject.getMonth();
  // const y=dateObject.getFullYear();
  // const t = dateObject.getTime();

  // const hr = dateObject.getHours();
  // const min = dateObject.getMinutes()
  // const sec = dateObject.getSeconds()

  // const finalDate = `${y}:${m}:${d}  ${hr}:${min}:${sec}`

  // const today = Date.now();

  // const curentDate = new Intl.DateTimeFormat("en-US", {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // }).format(today);

  const curentDate = moment().format("DD-MM-YYYY");

  const [count, setCount] =  useState(0);
  

  const defaultValues = {
    title: "",
    createdAt: curentDate,
    updatedAt: curentDate,
    target:"",
    completed: false,
  };

  const [todo, setTodo] = useState(defaultValues);
  console.log(id);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios("http://localhost:3001/todos/" + id).then((res) => {
      console.log(res.data);
      const temp = { ...defaultValues, ...res.data };
      console.log(temp);
      setTodo(temp);
    });
  }, []);

  const formik = useFormik({
    initialValues: todo,
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "should be more than 3 characters")
        .max(100, "Must be 100 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      console.log(JSON.stringify(values, null, 2));
      if (id) {
        //id is avaible so put request
        axios
          .put("http://localhost:3001/todos/" + id, values)
          .then(function (response) {
            console.log(response);
            console.log(values.completed);

            navigate("/mui");
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //id is not availale so post request
        axios
          .post("http://localhost:3001/todos", values)
          .then(function (response) {
            console.log(response);
            console.log(values.target)

            navigate("/mui");
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  });

  return (
    <>
      <Container>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            <Form.Text className="text-danger">
              {formik.touched.title && formik.errors.title ? (
                <div className="text-danger">{formik.errors.title}</div>
              ) : null}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="checkbox">
            {formik.values.completed?<Form.Check type="checkbox" label="Check me out" name="completed" checked  onChange={formik.handleChange}/>:<Form.Check type="checkbox" name="completed" label="Check me out"  onChange={formik.handleChange}/>}

            {/* <Form.Check
              type="checkbox"
              label="Check me out"
              name="completed"
              onChange={formik.handleChange}
            /> */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Target</Form.Label>
            {/* <DatePicker
              selected={date}
              // onChange={(date) => setDate(date)}
              onChange={formik.handleChange}
              
              value={formik.values.target}
              // value={date}
              name="target"
            /> */}
             <Form.Control
              type="dateTime-local"
              placeholder="Enter title"
              name="target"
              value={formik.values.target}
              onChange={formik.handleChange}
            />
            <Form.Text className="text-danger">
              {formik.touched.date && formik.errors.date ? (
                <div className="text-danger">{formik.errors.date}</div>
              ) : null}
            </Form.Text>
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
