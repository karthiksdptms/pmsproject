import React, { useState, useEffect } from "react";
import './Trainingattendance.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Table,Modal } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
function Trainingattendance() {
  const [Schedule, setSchedule] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);

  const [selectedScheduleCode, setSelectedScheduleCode] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState("");

  const [selectedTrainingName, setSelectedTrainingName] = useState("");
  const [selectedActions, setSelectedActions] = useState({});

  const [showModall, setShowModall] = useState(false);
 const [selectedBatchess, setSelectedBatchess] = useState([]);
  
  const [scheduleCodee, setScheduleCodee] = useState(""); 
  const [trainingNamee, setSelectedTrainingNamee] = useState("");
  
    const [showBatchModall, setShowBatchModall] = useState(false);
    const [selectedBatchData, setSelectedBatchData] = useState(null);
  

  const handleView = (batches,selectedScheduleCode,trainingName) => {
    setScheduleCodee(selectedScheduleCode); 
    setSelectedTrainingNamee(trainingName)
    setSelectedBatchess(batches);
    setShowModall(true);
  };
  const fetchBatchAttendance = async (scheduleCodee, batchNumber) => {
    if (!scheduleCodee) {
      console.error("Error: scheduleCode is missing.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/api/attendance/attendance/${scheduleCodee}/${batchNumber}`);
      
      if (!response.data.batches || response.data.batches.length === 0) {
        console.warn("No batch data found for", batchNumber);
        return;
      }
  
      setSelectedBatchData(response.data.batches[0]);
      setShowBatchModall(true);
      setShowModall(false);
    } catch (error) {
      console.error("Error fetching batch attendance:", error);
    }
  };

 
  const handleActionClick = (registerNo, action) => {
    setSelectedActions((prev) => ({
      ...prev,
      [registerNo]: prev[registerNo] === action ? null : action, // Toggle visibility per row
    }));
  };

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

  const handleTakeAttendance = (scheduleCode, trainingName, batches,trainee) => {
    const batchNames = batches.map(batch =>
      typeof batch === "object" && batch.batchNumber ? batch.batchNumber : batch
    );

    setSelectedBatches(batchNames);
    setSelectedScheduleCode(scheduleCode);
    setSelectedTrainee(trainee)
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
  
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
  
    useEffect(() => {
      if (selectedScheduleCode && selectedBatch) {
        fetchAvailableDates();
      }
    }, [selectedScheduleCode, selectedBatch]);
    
    const fetchAvailableDates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/schedule/schedule-dates?scheduleCode=${selectedScheduleCode}&batch=${selectedBatch}`
        );
    
        const { fromDate, toDate } = response.data;
        if (fromDate && toDate) {
          setAvailableDates(generateDateRange(fromDate, toDate));
        }
      } catch (error) {
        console.error("Error fetching schedule dates:", error);
      }
    };
    const handleSaveAttendance = async () => {
      if (!selectedScheduleCode ||!selectedTrainee|| !selectedTrainingName || !selectedBatch || !selectedDate || students.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Missing Data",
          text: "Please select all fields before saving attendance.",
        });
        return;
      }
    
      const attendanceData = {
        scheduleCode: selectedScheduleCode,
        trainingName: selectedTrainingName,
        trainee:selectedTrainee,
        batchNumber: selectedBatch,
        date: selectedDate,
        students: students.map((student) => ({
          registerNumber: student.registration_number,
          department: student.department,
          status: selectedActions[student.registration_number] || "P",
        })),
      };
    
      console.log(attendanceData);
    
      try {
        const response = await axios.post(
          "http://localhost:3000/api/attendance/save",
          attendanceData
        );
    
        Swal.fire({
          icon: "success",
          title: "Attendance Saved",
          text: "Attendance has been successfully recorded.",
        });
    
        setShowStudentModal(false);
      } catch (error) {
        console.error("Error saving attendance:", error);
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: error.response?.data?.error || "An error occurred while saving attendance.",
        });
      }
    };
    
    
   
    const generateDateRange = (fromDate, toDate) => {
      const dates = [];
      let currentDate = new Date(fromDate);
      const endDate = new Date(toDate);
  
      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]); 
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };
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
                Total no of Schedules: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{totalRecords}</span>
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
                        onClick={() => handleTakeAttendance(schedule.scheduleCode, schedule.trainingName, schedule.batches,schedule.trainee )}
                        style={{marginRight:"20px"}}
                      >
                        Take Attendance
                      </Button>
                      <Button style={{marginRight:"20px"}}
                        variant="primary"
                        onClick={() => handleTakeAttendance(schedule.scheduleCode, schedule.trainingName, schedule.batches,schedule.trainee )}

                      >
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleView(schedule.batches,schedule.scheduleCode,schedule.trainingName)}

                      >
                        view
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
        
        <select style={{width:"150px",position:"relative",left:"210px"}}
        className="form-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} required
        >
          <option value="">Select Date</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
                <button type="button" className="btn-close" onClick={() => setShowStudentModal(false)}></button>
              </div>
              <div className="modal-body">
              <table className="table table-striped table-bordered table-hover  " style={{position:"relative",left:"0px"}} >
        <thead>
          <tr>
            <th>Register No.</th>
            <th>Name</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {students.map((student) => {
            const selectedAction = selectedActions[student.registration_number] || "P"; 
            const isDisabled = !selectedActions[student.registration_number];

            return (
              <tr key={student.registration_number}>
                <td>{student.registration_number}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>
                  <button
                    className={`btn ${
                      selectedAction === "P"
                        ? "btn-success"
                        : selectedAction === "A"
                        ? "btn-danger"
                        : "btn-warning"
                    }`}
                    disabled={isDisabled} 
                    onClick={() =>
                      handleActionClick(student.registration_number, selectedAction)
                    }
                  >
                    {selectedAction}
                  </button>
                  {!selectedActions[student.registration_number] && (
                    <>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() =>
                          handleActionClick(student.registration_number, "A")
                        }
                      >
                        A
                      </button>
                      <button
                        className="btn btn-warning ms-2"
                        onClick={() =>
                          handleActionClick(student.registration_number, "OD")
                        }
                      >
                        OD
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
  
              </div>
              <div className="modal-footer">
                <button  className="btn btn-secondary" onClick={handleSaveAttendance}>save</button>
              </div>
            </div>
          </div>
        </div>
      )}
       <Modal show={showModall} onHide={() => setShowModall(false)} top >
        <Modal.Header closeButton>
          <Modal.Title>Select Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBatchess.length > 0 ? (
            selectedBatchess.map((batch, index) => (
              <Button key={index} variant="outline-primary" className="m-2" onClick={() => fetchBatchAttendance( scheduleCodee,batch.batchNumber)}>
                {batch.batchNumber}
              </Button>
            ))
          ) : (
            <p>No batches available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
         
        </Modal.Footer>
      </Modal>
      {showBatchModall && selectedBatchData && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-xl modal-dialog-centered">
      <div className="modal-content" style={{ width: "100%" }}>
        <div className="modal-header">
          <h5 className="modal-title">{`Schedule Code: ${scheduleCodee}| Training Name: ${trainingNamee}`}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowBatchModall(false)}
          ></button>
        </div>

        <div className="modal-body">
          <table className="table table-striped table-bordered table-hover" style={{ width: "100%",position:"relative",left:'0px' }}>
            <thead>
              <tr>
                <th>Register Number</th>
                <th>Department</th>
                {selectedBatchData.dates.map((dateObj) => (
                  <th key={dateObj.date}>{dateObj.date}</th>
                ))}
               
              </tr>
            </thead>
            <tbody>
              {selectedBatchData.dates[0].students.map((student, index) => {
                const attendanceRecords = selectedBatchData.dates.map((dateObj) => {
                  const studentRecord = dateObj.students.find((s) => s.registerNumber === student.registerNumber);
                  return studentRecord ? studentRecord.status : "-";
                });

                const totalDays = attendanceRecords.length;
                const presentDays = attendanceRecords.filter((status) => status === "P"|| status === "OD").length;
                const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(2);

                return (
                  <tr key={index}>
                    <td>{student.registerNumber}</td>
                    <td>{student.department}</td>
                    {attendanceRecords.map((status, i) => (
                      <td key={i}>{status}</td>
                    ))}
                   
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
         
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default Trainingattendance;