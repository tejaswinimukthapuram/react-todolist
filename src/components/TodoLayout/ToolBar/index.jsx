import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import "./index.css";
import { useSelector } from "react-redux";
import { add } from "../../../reducers/todolist";
import { useDispatch } from "react-redux";
import { FormControlLabel, Switch } from "@mui/material";
import { Context } from "../../../App";

function Index() {
  const [todoList, setTodoList] = useState([]);
  const dispatch = useDispatch();

  const [darkMode, setDarkMode] = useContext(Context);
  const todosCount = useSelector((state)=>state.todosCount.value)

  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        // console.log(res)
        setTodoList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  dispatch(add(todoList));

  return (
    <Navbar bg="info" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home" className="brand">
          React-Bootstrap
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="mui">
              Home Mui Table
            </Nav.Link>
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="createTodo"
              className="position-relative"
            >
              Create Todo
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {todosCount}
              </span>
            </Nav.Link>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => {
                    e.preventDefault();
                    setDarkMode(!darkMode);
                  }}
                />
              }
              label="Dark Mode"
            />
            {/* <button onClick={()=>setDarkMode(!darkMode)}>Dark Mode</button> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Index;
