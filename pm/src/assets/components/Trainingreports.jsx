import React, { useState, useEffect } from "react";
import "./Trainingreports.css";
import { IoIosArrowBack } from "react-icons/io";
import Topbar from "./Topbar";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";

import { Button, Table,Modal } from "react-bootstrap";



function Trainingreports() {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState([]);
  
  const [scheduleCode, setScheduleCode] = useState(""); 
  const [trainingName, setSelectedTrainingName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/attendance/attendance-reports")
      .then(response => {
        setReports(response.data);
      })
      .catch(error => {
        console.error("Error fetching attendance reports:", error);
      });
  }, []);

  const handleView = (batches,selectedScheduleCode,trainingName) => {
    setScheduleCode(selectedScheduleCode); 
    setSelectedTrainingName(trainingName)
    setSelectedBatches(batches);
    setShowModal(true);
  };


  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatchData, setSelectedBatchData] = useState(null);

 
 
  const fetchBatchAttendance = async (scheduleCode, batchNumber) => {
    if (!scheduleCode) {
      console.error("Error: scheduleCode is missing.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/api/attendance/attendance/${scheduleCode}/${batchNumber}`);
      
      if (!response.data.batches || response.data.batches.length === 0) {
        console.warn("No batch data found for", batchNumber);
        return;
      }
  
      setSelectedBatchData(response.data.batches[0]);
      setShowBatchModal(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error fetching batch attendance:", error);
    }
  };
  

      const totalRecords = reports.length;
      const [currentPage, setCurrentPage] = useState(1);
      const [rowsPerPage, setRowsPerPage] = useState(10);
      const handleRowsPerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
          setRowsPerPage(value);
          setCurrentPage(1);
        }
      };
    
      const totalPages = Math.ceil(reports.length / rowsPerPage);
    
      const startIdx = (currentPage - 1) * rowsPerPage;
      const displayedData = reports.slice(
        startIdx,
        startIdx + rowsPerPage
      );

      const handleExport = () => {
        if (!selectedBatchData || !scheduleCode || !trainingName) {
          console.error("No data available to export.");
          return;
        }
      
        const wsData = [
          ["Register Number", "Department", ...selectedBatchData.dates.map(dateObj => dateObj.date), "Attendance %"]
        ];
      
        selectedBatchData.dates[0].students.forEach(student => {
          const attendanceRecords = selectedBatchData.dates.map(dateObj => {
            const studentRecord = dateObj.students.find(s => s.registerNumber === student.registerNumber);
            return studentRecord ? studentRecord.status : "-";
          });
      
          const totalDays = attendanceRecords.length;
          const presentDays = attendanceRecords.filter(status => status === "P" || status === "OD").length;
          const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(2);
      
          wsData.push([
            student.registerNumber,
            student.department,
            ...attendanceRecords,
            `${attendancePercentage}%`
          ]);
        });
      
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance");
      
        const fileName = `${scheduleCode}-${trainingName}-${selectedBatchData.batchNumber}.xlsx`;
        XLSX.writeFile(wb, fileName);
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
            Report's
          </h2>
        </Link>
        <h4 className="mb-4" style={{ position: "relative", top: "70px", left: "50px", width: '350px' }}>
                Total Reports: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{totalRecords}</span>
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
            displayedData.map((report, index) => (
              <tr key={index}>
                <td>{report.scheduleCode}</td>
                <td>{report.trainingName}</td>
                <td>{report.trainee}</td>
                <td>{report.batches.length}</td>
                <td>
                <Button variant="primary" onClick={() => handleView(report.batches,report.scheduleCode,report.trainingName)}>View</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No records found</td>
            </tr>
          )}
            </tbody>
          </Table>
          </div>
          </div>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} top >
        <Modal.Header closeButton>
          <Modal.Title>Select Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBatches.length > 0 ? (
            selectedBatches.map((batch, index) => (
              <Button key={index} variant="outline-primary" className="m-2" onClick={() => fetchBatchAttendance( scheduleCode,batch.batchNumber)}>
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
      {showBatchModal && selectedBatchData && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-xl modal-dialog-centered">
      <div className="modal-content" style={{ width: "100%" }}>
        <div className="modal-header">
          <h5 className="modal-title">{`Schedule Code: ${scheduleCode}| Training Name: ${trainingName}`}</h5>
          
        <button className="btn btn-success" style={{width:'120px',position:"relative",left:'360px'}} onClick={handleExport}> <i className="bi bi-file-earmark-excel" style={{ marginRight: "10px" }}></i>
        Excel
        <i className="bi bi-download" style={{ marginLeft: "5PX" }}></i></button>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowBatchModal(false)}
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
                <th>Attendance %</th>
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
                    <td>{attendancePercentage}%</td>
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


      </div>
      





    </>
  );
}

export default Trainingreports;