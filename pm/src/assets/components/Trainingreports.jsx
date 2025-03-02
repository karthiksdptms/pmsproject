import React, { useState, useEffect } from "react";
import "./Trainingreports.css";
import { IoIosArrowBack } from "react-icons/io";
import Topbar from "./Topbar";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";


function Trainingreports() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {

    axios.get('http://localhost:3000')
      .then(result => setTrainings(result.data))
      .catch(err => console.log(err))
  }, [])


  const filterByDate = (training) => {
    if (!training.fromdate || !training.todate) return false;

    const trainingStart = new Date(training.fromdate);
    const trainingEnd = new Date(training.todate);

    const filterStart = fromDate ? new Date(fromDate) : null;
    const filterEnd = toDate ? new Date(toDate) : null;

    if (filterStart && filterEnd) {
      return trainingStart >= filterStart && trainingEnd <= filterEnd;
    }
    if (filterStart) {
      return trainingStart >= filterStart;
    }
    if (filterEnd) {
      return trainingEnd <= filterEnd;
    }

    return true;
  };



  const filteredTrainings = trainings.filter(filterByDate);



  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(trainings.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = filteredTrainings.slice(
    startIdx,
    startIdx + rowsPerPage
  );
  const handleExcelDownload = () => {
    if (filteredTrainings.length === 0) {
      alert("No records to export.");
      return;
    }


    const filteredData = filteredTrainings.map(({ _id, __v, id, ...rest }) => ({ ...rest }));


    const keys = Object.keys(filteredData.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
    const consistentData = filteredData.map((obj) =>
      keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] || "" }), {})
    );

    const ws = XLSX.utils.json_to_sheet(consistentData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trainings");

    const fromDateFormatted = fromDate ? new Date(fromDate).toLocaleDateString("en-CA") : "all_dates";
    const toDateFormatted = toDate ? new Date(toDate).toLocaleDateString("en-CA") : "all_dates";
    const fileName = `Trainings_from_${fromDateFormatted}_to_${toDateFormatted}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };


  //
  const [trtype, settrtype] = useState("");
  const [trainee, settrainee] = useState("");
  const [fromdate, setfromdate] = useState("");
  const [todate, settodate] = useState();
  const [duration, setduration] = useState();
  const [batch, setbatch] = useState("");
  const [department, setdepartment] = useState("");
  const [participated, setparticipated] = useState();

  const Submit = (e) => {
    e.preventDefault();

    if (trtype != '' && trainee != '' && fromdate != '' && todate != '' && duration != '' && batch != '' && department != '' && participated != 0) {
      axios
        .post("http://localhost:3000/createUser", {
          trtype,
          trainee,
          fromdate: new Date(fromdate).toLocaleDateString("en-CA"),
          todate: new Date(todate).toLocaleDateString("en-CA"),
          duration,
          batch,
          department,
          participated,
        })
        .then((result) => {
          console.log("Success:", result.data),
            window.location.reload()
        })
        .catch((err) => console.error("Error:", err));
    }
    else {
      alert("Please fill all fields");
    }
  };

  const [editData, setEditData] = useState({
    _id: "",
    trtype: "",
    trainee: "",
    fromdate: "",
    todate: "",
    duration: "",
    batch: "",
    department: "",
    participated: "",
  });

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0];
  };

  const handleEditClick = (training) => {
    setEditData({
      _id: training._id,
      trtype: training.trtype,
      trainee: training.trainee,
      fromdate: formatDate(training.fromdate),
      todate: formatDate(training.todate),
      duration: training.duration,
      batch: training.batch,
      department: training.department,
      participated: training.participated,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3000/updateUser/${editData._id}`, editData)
      .then((result) => {
        console.log("Updated Successfully:", result.data);
        window.location.reload();  // Refresh table after update
      })
      .catch((err) => console.error("Update Error:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:3000/deleteUser/${id}`)
        .then((response) => {
          alert("Record deleted successfully!");
          setTrainings(trainings.filter((training) => training._id !== id)); // Remove from UI
        })
        .catch((error) => {
          console.error("Error deleting record:", error);
        });
    }
  };
  return (
    <>
      
      <Link to="/Maindashboard/Training">
        <button
          type="button"
          class="btn btn-secondary"
          style={{
            marginLeft: "20px",
            border: "none",
            position: "relative",

            top: "95px",
            right: "40px",
            left: "210px",
            fontSize: "35px",
            color: "black",
            backgroundColor: "transparent",
            zIndex: "100",
          }}
        >
          <IoIosArrowBack />
        </button>
      </Link>
      <h2
        style={{
          position: "relative",
          left: "285px",
          top: "45px",
          width: "100px",
        }}
      >
        Report's
      </h2>
      <div>

        <div className="row mb-3" style={{ position: "relative", left: "320px", top: "70px", zIndex: "100",width:"600px" }}>
          <div className="col-md-3">
            <label>From Date:</label>
            <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)}  style={{width:"250px"}}/>
          </div>
          <div className="col-md-3" style={{position:"relative",right:"-150px"}}>
            <label>To Date:</label>
            <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{width:"250px"}} />
          </div>
        </div></div>
      <button className="btn btn-success mb-3" style={{
        color: "white",
        backgroundcolor: "green",
        margin: "20px",
        width: "120px",
        position: "relative",
        left: "1280px",
        borderRadius: "30px",
        zIndex: "1000"
      }}
        onClick={handleExcelDownload}>
        <i class="bi bi-file-earmark-excel" style={{ marginRight: "10px" }}></i>
        Excel
        <i class="bi bi-download" style={{ marginLeft: "5PX" }}></i>
      </button>



      <div
        className="table"
        style={{

          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "700px",
          minHeight: "400px",
          maxWidth: "1200px",
          position: "relative",
          bottom: '50px'
        }}
      >
        <button className="btn" style={{ backgroundColor: "white", border: "none", color: " #3c6db9",position:"relative",bottom:"30px",zIndex:"1000" }} data-bs-toggle="modal" data-bs-target="#addtrainModal" ><i class="bi bi-plus-circle-fill" style={{ fontSize: "40px", position: "relative", top: "70px", left: "30px",position:"relative",left:"1000px",zIndex:"1000" }}></i></button> <h4 className="mb-4" style={{ position: "relative", left: "100px", top: "30px" }}>
          Total Records: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white", position: "relative", lef: "1500px" }}>{filteredTrainings.flat().length}</span>
        </h4>
        <div className="modal fade" id="addtrainModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Add New Training</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control mb-2" placeholder="Type" name="type" onChange={(e) => settrtype(e.target.value)} required />
                <input type="text" className="form-control mb-2" placeholder="Trainee" name="trainee" onChange={(e) => settrainee(e.target.value)} required />
                <input type="date" className="form-control mb-2" name="fromDate" onChange={(e) => setfromdate(e.target.value)} required />
                <input type="date" className="form-control mb-2" name="toDate" onChange={(e) => settodate(e.target.value)} required />
                <input type="text" className="form-control mb-2" placeholder="Duration" name="duration" onChange={(e) => setduration(e.target.value)} required />
                <input type="text" className="form-control mb-2" placeholder="Batch" name="batch" onChange={(e) => setbatch(e.target.value)} required />
                <input type="text" className="form-control mb-2" placeholder="Department" name="department" onChange={(e) => setdepartment(e.target.value)} required />
                <input type="number" className="form-control mb-2" placeholder="Participated" name="participated" onChange={(e) => setparticipated(e.target.value)} required />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" data-bs-dismiss="modal" onClick={Submit}>Save</button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex justify-right items-center gap-4 mt-4 "
          style={{ position: "relative", left: "730px", bottom: "20px", marginRight: "30px" }}
        >
          <label>
            {" "}
            No of records per page:{" "}
            <input
              type="number"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              style={{ width: "50px", padding: "5px" }}
            />
          </label>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            className="btn "
            style={{ marginLeft: "20px" }}
            disabled={currentPage === 1}
          >
            <i class="bi bi-chevron-double-left"></i>
          </button>

          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="btn"
            disabled={currentPage === totalPages}
          >
            <i class="bi bi-chevron-double-right arr"></i>
          </button>
        </div>
        <table
          border="1"
          id="my-table"
          style={{
            marginTop: "20px",
            width: "98%",
            position: "relative",
            left: "2%",
            top: "0px",
          }}
          class="table table-striped  table-hover tabl"
        >
          <thead>
            <tr>
              <th>TYPE</th>
              <th>TRAINEE</th>
              <th>FROM </th>
              <th>TO </th>
              <th>DURATION</th>
              <th>BATCH</th>
              <th>DEPARTMENT</th>
              <th>PARTICIPATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>

            {displayedData.length > 0 ? (
              displayedData.map((training) => (
                <tr key={training.id}>
                  <td>{training.trtype}</td>
                  <td>{training.trainee}</td>
                  <td>{new Date(training.fromdate).toLocaleDateString("en-GB")}</td>
                  <td>{new Date(training.todate).toLocaleDateString("en-GB")}</td>
                  <td>{training.duration}</td>
                  <td>{training.batch}</td>
                  <td>{training.department}</td>
                  <td>{training.participated}</td>
                  <td>
                    <button className="btn btn-warning btn-sm mx-3 " data-bs-toggle="modal" data-bs-target="#addEditModal" onClick={() => handleEditClick(training)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(training._id)} >Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="text-center">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="modal fade" id="addEditModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"> Edit Training</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input type="text" className="form-control mb-2" placeholder="Type" name="type" value={editData.trtype} onChange={(e) => setEditData({ ...editData, trtype: e.target.value })} />
              <input type="text" className="form-control mb-2" placeholder="Trainee" name="trainee" value={editData.trainee} onChange={(e) => setEditData({ ...editData, trainee: e.target.value })} />
              <input type="date" className="form-control mb-2" name="fromDate" value={editData.fromdate}
                onChange={(e) => setEditData({ ...editData, fromdate: e.target.value })} />
              <input type="date" className="form-control mb-2" name="toDate" value={editData.todate}
                onChange={(e) => setEditData({ ...editData, todate: e.target.value })} />
              <input type="text" className="form-control mb-2" placeholder="Duration" name="duration" value={editData.duration} onChange={(e) => setEditData({ ...editData, duration: e.target.value })} />
              <input type="text" className="form-control mb-2" placeholder="Batch" name="batch" value={editData.batch} onChange={(e) => setEditData({ ...editData, batch: e.target.value })} />
              <input type="text" className="form-control mb-2" placeholder="Department" name="department" value={editData.department} onChange={(e) => setEditData({ ...editData, department: e.target.value })} />
              <input type="number" className="form-control mb-2" placeholder="Participated" name="participated" value={editData.participated} onChange={(e) => setEditData({ ...editData, participated: e.target.value })} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" data-bs-dismiss="modal" onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      </div>




    </>
  );
}

export default Trainingreports;