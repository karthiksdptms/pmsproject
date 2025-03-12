import React, { useState, useEffect } from "react";
import './Trainingattendance.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Table } from "react-bootstrap";

function Trainingattendance() {
  const [Schedule, setSchedule] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedScheduleCode, setSelectedScheduleCode] = useState("");
  const [selectedTrainingName, setSelectedTrainingName] = useState("");


  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/schedule");
      setSchedule(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleTakeAttendance = (scheduleCode, trainingName, batches) => {
    const batchNames = batches.map(batch =>
      typeof batch === "object" && batch.batchNumber ? batch.batchNumber : batch
    );

    setSelectedBatches(batchNames);
    setSelectedScheduleCode(scheduleCode);
    setSelectedTrainingName(trainingName);
    setShowBatchModal(true);
  };

  const handleBatchClick = async (batch, scheduleCode, trainingName) => {
    console.log(`[INFO] Batch Clicked: ${batch}, Schedule Code: ${scheduleCode}, Training Name: ${trainingName}`);
  
    try {
      const response = await axios.get("http://localhost:3000/api/attendancestudent/attendance-students", {
        params: { batch, scheduleCode, trainingName },
      });
  
      console.log(`[SUCCESS] Received ${response.data.length} students:`, response.data);
  
      setStudents(response.data.students); 
      setSelectedBatch(batch);
      setSelectedScheduleCode(scheduleCode); 
      setSelectedTrainingName(trainingName); 
      setShowBatchModal(false);
      setShowStudentModal(true);
    } catch (error) {
      console.error("[ERROR] Fetching students failed:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load students",
        text: error.response?.data?.error || "No students found for this batch",
      });
    }
  };
  

  
    const totalRecords = Schedule.length;
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleRowsPerPageChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (value > 0) {
        setRowsPerPage(value);
        setCurrentPage(1);
      }
    };
  
    const totalPages = Math.ceil(Schedule.length / rowsPerPage);
  
    const startIdx = (currentPage - 1) * rowsPerPage;
    const displayedData = Schedule.slice(
      startIdx,
      startIdx + rowsPerPage
    );
  

  return (
    <>
      <div className="had">
        <Link to="/Maindashboard/Training" style={{ textDecoration: "none", color: "black" }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{
              marginLeft: "20px",
              border: "none",
              position: "relative",
              top: "95px",
              right: "40px",
              fontSize: "35px",
              color: "black",
              backgroundColor: "transparent",
            }}
          >
            <IoIosArrowBack />
          </button>
          <h2 style={{
            position: "relative",
            top: "45px",
            left: "30px",
            fontFamily: "poppins",
            fontSize: "35px",
            width: "100px",
          }}>
            Attendance
          </h2>
        </Link>
        <h4 className="mb-4" style={{ position: "relative", top: "70px", left: "50px", width: '350px' }}>
                Total Question Papers: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{totalRecords}</span>
              </h4>


              <div
                className="flex justify-right items-center gap-4 mt-4 "
                style={{ position: "relative", left: "800px", bottom: "-20px", width: '460px' }}
              >
                <label>
                  {" "}
                  No of records per page:{" "}
                  <input
                    type="number"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    style={{ width: "50px", padding: "5px", marginRight: "20PX" }}
                  />
                </label>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="btn"
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-double-left"></i>
                </button>

                <span className="text-lg">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  className="btn"
                  disabled={currentPage === totalPages}
                >
                  <i className="bi bi-chevron-double-right arr"></i>
                </button>
              </div>
        <div className="container mt-2" style={{ position: "relative", right: "0px", top: "50px" }}>
        <div style={{
                position: "relative",
                top: "20px",
                left: "-20px",
                overflowY: "auto",


                maxHeight: "800px",
              }}>
                <div style={{position:"relative",left:"-230px"}}>
          <Table striped bordered hover className="mt-3" >
            <thead>
              <tr>
                <th>Schedule Code</th>
                <th>Training Name</th>
                <th>Trainee</th>
                <th>No. of Batches</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.length > 0 ? (
                displayedData.map((schedule, index) => (
                  <tr key={index}>
                    <td>{schedule.scheduleCode || "N/A"}</td>
                    <td>{schedule.trainingName || "N/A"}</td>
                    <td>{schedule.trainee || "N/A"}</td>
                    <td>{schedule.batches?.length || 0}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleTakeAttendance(schedule.scheduleCode, schedule.trainingName, schedule.batches)}

                      >
                        Take Attendance
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No schedules available</td>
                </tr>
              )}
            </tbody>
          </Table>
          </div>
          </div>
        </div>
      </div>


      {showBatchModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Batch</h5>
                <button type="button" className="btn-close" onClick={() => setShowBatchModal(false)}></button>
              </div>
              <div className="modal-body">
                {selectedBatches.length > 0 ? (
                  selectedBatches.map((batch, index) => (
                    <Button key={index} variant="outline-primary" className="m-2" onClick={() => handleBatchClick(batch, selectedScheduleCode, selectedTrainingName)}
                    >
                      {batch}
                    </Button>
                  ))
                ) : (
                  <p>No batches available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showStudentModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  Schedule: {selectedScheduleCode || "N/A"} - {selectedTrainingName || "N/A"}<br />
                   {selectedBatch || "N/A"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowStudentModal(false)}></button>
              </div>
              <div className="modal-body">
                <Table striped bordered hover style={{ position: "relative", left: '0px' }}>
                  <thead>
                    <tr>
                      <th>Register No.</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.map((student, index) => (
                        <tr key={index}>
                          <td>{student.registration_number}</td>
                          <td>{student.name}</td>
                          <td>{student.department}</td>
                          <td>
                            <Button variant="success" className="m-1">P</Button>
                            <Button variant="danger" className="m-1">A</Button>
                            <Button variant="warning" className="m-1">OD</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No students in this batch</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Trainingattendance;