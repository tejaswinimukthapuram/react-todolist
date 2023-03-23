import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ConfirmModal from '../ConfirmModal'
import axios from "axios";
import { add } from "../../../reducers/todolist";
import { useDispatch } from "react-redux";



function Index() {

  const params = useParams();
  const navigate = useNavigate();
  const {id} = params
  const [todoList, setTodoList] = useState([]);
  const [verify, setVerify] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const dispatch = useDispatch();

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

  console.log(todoList);

  function onEditClick(id){
    alert("Do you want to edit this" +id)
    navigate("editTodo/"+id)
  }

  function onDeleteClick(todoId) {
    // const verify = window.confirm("Are you sure you want to delete this product");
    setVerify(true);
    setDeleteId(todoId);
  }

 

  // dispatch(add(todoList))

  function onVerifyClose(result) {
    if (!result) {
      setVerify(false);
      return;
    }
    
    axios
      .delete("http://localhost:3001/todos/" + deleteId,)
      .then((res) => {
        setVerify(false);
       window.location.reload();
       
      })
      .catch((err) => {
        console.log(err);
      });
  }




  const updateDate = localStorage.getItem("updateDate");
  console.log(updateDate);


  function renderTableData(data) {
    let tableRow = data.map((each) => {
      const completeStatus = each.completed



      return (
        <tr>
          <td>{each.id}</td>
          <td>{each.title}</td>
          <td>{completeStatus?"Completed":"Incomplete"}</td>
          <td>{each.target}</td>
          <td>{each.createdAt}</td>
          <td>{each.updatedAt}</td>
          <td>
          <Button variant="info" className="me-3" onClick={()=>onEditClick(each.id)}>
          <span className="material-icons-outlined">edit</span>
          </Button>
          <Button variant="danger" onClick={() => onDeleteClick(each.id)}>
            <span className="material-icons-outlined">delete</span>
            </Button>
            {/* <ConfirmModal onCheck={()=>onChecked(each.id)}/> */}
          </td>
          
        </tr>
      );
    });

    return tableRow;
  }

 

  return (
    <>
      <Container className="m-4">
        <Table striped bordered hover>
          <thead>
            <tr  style={{ textAlign: "center" }}>
              <th>id</th>
              <th>Title</th>
              <th>Completed</th>
              <th>Target date</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableData(todoList)}</tbody>
        </Table>
      </Container>

      {verify ? <ConfirmModal onClose={onVerifyClose} /> : ""}
     
    </>
  );
}

export default Index;
