import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ConfirmModal";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { useDownloadExcel } from 'react-export-table-to-excel';
import './index.css';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    label: "Id",
  },
  {
    id: "title",
    label: "Title",
  },
  {
    id: "completed",
    label: "Completed",
  },
  {
    id: "target_date",
    label: "Target Date",
  },
  {
    id: "created_at",
    label: "Created At",
  },
  {
    id: "updated_at",
    label: "Updated At",
  },
  {
    id: "actions",
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {/* Nutrition */}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  
  const { onDownload } = useDownloadExcel({
    currentTableRef: componentRef.current,
    filename: 'Users table',
    sheet: 'Users'
})

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [verify, setVerify] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setRows(res);
        setAllRows(res);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const newSelected = allRows.filter((n) =>
      n.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setRows(newSelected);
    //   if(newSelected.length<=5){
    //     setRowsPerPage(5)
    //     setPage(0);
    // }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function onEditClick(id) {
    alert("Do you want to edit this" + id);
    navigate("../editTodo/" + id);
  }

  function onDeleteClick(todoId) {
    setVerify(true);
    setDeleteId(todoId);
  }
  function onVerifyClose(result) {
    if (!result) {
      setVerify(false);
      return;
    }

    axios
      .delete("http://localhost:3001/todos/" + deleteId)
      .then((res) => {
        setVerify(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          

            <div className="d-flex flex-row justify-content-end">

            <TextField
            sx={{ width: "80%", marginLeft: "10%" }}
            id="outlined-controlled"
            label="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
           
          <button
            type="button"
            className="btn btn-info button"
            onClick={handlePrint}
            sx={{ color: "red", marginLeft: "13px" }}
          >
            Print
          </button>

          

          <button onClick={onDownload}  className="btn btn-info button">Export to excel</button>

          </div>

      
          
      
          <TableContainer ref={componentRef}>
            
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow>
                        <TableCell align="center">{row.id}</TableCell>
                        <TableCell align="center">{row.title}</TableCell>
                        {/* <TableCell align="center">
                          {row.completed ? "Completed" : "Incompleted"}
                        </TableCell> */}

                        {row.completed ? (
                          <TableCell align="center">Completed</TableCell>
                        ) : (
                          <TableCell align="center" style={{ color: "red" }}>
                            Incomplete
                          </TableCell>
                        )}

                        <TableCell align="center">{row.target}</TableCell>
                        <TableCell align="center">{row.createdAt}</TableCell>
                        <TableCell align="center">{row.updatedAt}</TableCell>
                        
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            onClick={(e) => {
                              e.preventDefault();
                              onEditClick(row.id);
                            }}
                          >
                            <span className="material-icons-outlined">
                              edit
                            </span>
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={(e) => {
                              e.preventDefault();
                              onDeleteClick(row.id);
                            }}
                          >
                            <span className="material-icons-outlined">
                              delete
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      {verify && <ConfirmModal onClose={onVerifyClose} />}
    </>
  );
}
