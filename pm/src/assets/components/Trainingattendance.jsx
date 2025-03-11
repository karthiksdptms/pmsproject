import React, { useState, useEffect } from "react";
import Topbar from './Topbar';
import './Trainingattendance.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Table, Modal } from "react-bootstrap";

function Trainingattendance() {
  const [Schedule, setSchedule] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedScheduleCode, setSelectedScheduleCode] = useState("");

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

  const handleTakeAttendance = (scheduleCode, batches) => {
    console.log("Batches Received:", batches);
  
    const batchNames = batches.map(batch => {
      if (typeof batch === "object" && batch.batchNumber) {
        return batch.batchNumber;
      } else if (typeof batch === "string") {
        return batch;
      } else {
        return `Unknown Batch`;
      }
    });
  
    console.log("Extracted Batch Names:", batchNames);
  
    setSelectedBatches(batchNames);
    setSelectedScheduleCode(scheduleCode);
    setShowBatchModal(true);
  };

  const handleBatchClick = async (batch) => {
    console.log(`[INFO] Selected Batch: ${batch}`);

    try {
      const response = await axios.get("http://localhost:3000/api/attendancestudent/attendance-students", {
        params: { batch }, 
      });

      console.log(`[SUCCESS] Fetched ${response.data.length} students`, response.data);
      setStudents(response.data);
      setSelectedBatch(batch);
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

  const handleAttendance = async (studentId, status) => {
    try {
      await axios.post("http://localhost:3000/api/attendance/mark-attendance", {
        studentId,
        batch: selectedBatch,
        scheduleCode: selectedScheduleCode,
        status,
      });

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId ? { ...student, status } : student
        )
      );

      Swal.fire({
        icon: "success",
        title: `Marked ${status}`,
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
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

        <div className="container mt-4" style={{position:"relative",top:"50px"}}>
          <Table striped bordered hover style={{position:"relative",top:"30px",left:"50px"}} >
            <thead>
              <tr>
                <th>Schedule Code</th>
                <th>Training Name</th>
                <th>No. of Batches</th>
                <th>Trainee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Schedule.length > 0 ? (
                Schedule.map((schedule, index) => (
                  <tr key={index}>
                    <td>{schedule.scheduleCode || "N/A"}</td>
                    <td>{schedule.trainingName || "N/A"}</td>
                    <td>{schedule.batches?.length || 0}</td>
                    <td>{schedule.trainee || "N/A"}</td>
                    <td>
                      <Button 
                        variant="primary"
                        onClick={() => handleTakeAttendance(schedule.scheduleCode, schedule.batches)}
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

      {/* Batch Selection Modal */}
      <Modal show={showBatchModal} onHide={() => setShowBatchModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBatches.length > 0 ? (
            selectedBatches.map((batch, index) => (
              <Button key={index} variant="outline-primary" className="m-2" onClick={() => handleBatchClick(batch)}>
                {batch}
              </Button>
            ))
          ) : (
            <p>No batches available</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Student List Modal */}
      <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Batch: {selectedBatch || "N/A"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
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
                    <td>{student.REGISTRATION_NUMBER}</td>
                    <td>{student.NAME}</td>
                    <td>{student.DEPARTMENT}</td>
                    <td>
                      <Button variant="success" className="m-1" onClick={() => handleAttendance(student._id, "Present")}>
                        Present
                      </Button>
                      <Button variant="danger" className="m-1" onClick={() => handleAttendance(student._id, "Absent")}>
                        Absent
                      </Button>
                      <Button variant="warning" className="m-1" onClick={() => handleAttendance(student._id, "On Duty")}>
                        On Duty
                      </Button>
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
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Trainingattendance;
