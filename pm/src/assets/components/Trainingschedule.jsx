import React from "react";
import Topbar from "./Topbar";
import "./Trainingschedule.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";


import { utils, writeFile } from 'xlsx';
function Trainingschedule() {
  const departments = ["CSE", "MECH", "ECE", "CCE", "AIDS", "AIML"];
  const departmentOptions = [
    "AIDS",
    "ECE",
    "CCE",
    "MECH",
    "CSE",
    "AIML",
    "VLSI",
    "CSBS",
    "BIO-TECH",
    "Others",
  ];
  const batchOptions = ["2023-2027", "2022-2026", "2021-2025", "2020-2024", "2025-2028", "Others"];
  const cgpaOptions = [
    "9.5 and above",
    "9 and above",
    "8.5 and above",
    "8 and above",
    "7.5 and above",
    "7 and above",
    "6.5 and above",
    "6 and above",
    "below 6",
  ];
  const arrearsOptions = ["0", "1", "2", "3", "4", "5", "6"];
  const historyOfArrearsOptions = ["0", "1", "2", "3", "4", "5", "6"];
  const aoiOptions = [
    "Full stack(react)",
    "Symposium",
    "Hackathon",
    "IOT",
    "WEB",
    "Data Analyst",
    "Frontend development",
    "API Developer",
    "Others",
  ];

  const [students, setstudents] = useState([])
  useEffect(() => {
    axios.get("http://localhost:3000/getstudents")
      .then(response => setstudents(response.data))
      .catch(error => console.error("Error fetching students:", error));
  }, []);
  const [filters, setFilters] = useState({
    department: [],
    batch: [],
    cgpa: "",
    arrears: "",
    historyOfArrears: "",
    aoi: [],
    language: "",
    otherDepartment: "",
    otherBatch: "",
    otherAoi: "",
  });
  const [showOtherDepartment, setShowOtherDepartment] = useState(false);
  const [showOtherBatch, setShowOtherBatch] = useState(false);
  const [showOtherAoi, setShowOtherAoi] = useState(false);

  const handleCheckboxChange = (e, key) => {
    const value = e.target.value;
    setFilters((prev) => {
      const updatedValues = prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value];
      return { ...prev, [key]: updatedValues };
    });
    if (value === "Others") {
      if (key === "department") setShowOtherDepartment(true);
      if (key === "batch") setShowOtherBatch(true);
      if (key === "aoi") setShowOtherAoi(true);
    }
  };

  const handleSelectChange = (e, key) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleInputChange = (e, key) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const filteredStudents = students.filter((student) => {
    return (
      (filters.department.length === 0 ||
        filters.department.includes(student.DEPARTMENT) ||
        (showOtherDepartment &&
          student.DEPARTMENT.includes(filters.otherDepartment))) &&
      (filters.batch.length === 0 ||
        filters.batch.includes(student.BATCH) ||
        (showOtherBatch && student.BATCH.includes(filters.otherBatch))) &&
      (filters.cgpa === "" ||
        parseFloat(student.CPGA) >= parseFloat(filters.cgpa)) &&
      (filters.arrears === "" ||
        (parseFloat(filters.arrears) >= parseFloat(student.ARREARS))) &&
      (filters.historyOfArrears === "" ||
        (parseFloat(filters.historyOfArrears) >= parseFloat(student.HOA))) &&
      (filters.aoi.length === 0 ||
        filters.aoi.includes(student.AOI) ||
        (showOtherAoi && student.AOI.includes(filters.otherAoi))) &&
      (filters.language === "" ||
        student.LANGUAGE.toLowerCase().includes(filters.language.toLowerCase()))
    );
  });
  const handleAllCheckboxChange = (e, key) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setFilters((prev) => ({ ...prev, [key]: [] }));
    }
  };
  const [hoverVisible, setHoverVisible] = useState(false);
  const [hoverVisiblee, setHoverVisiblee] = useState(false);
  const [hoverVisibleee, setHoverVisibleee] = useState(false);
  ///
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [batchSize, setBatchSize] = useState(3);
  const [batches, setBatches] = useState([]);

  const handleDepartmentChange = (event) => {
    const value = event.target.value;
    setSelectedDepartments((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const applyFilters = () => {
    const filteredStudentss = filteredStudents.filter((s) =>
      selectedDepartments.includes(s.DEPARTMENT)
    );
    const newBatches = [];
    for (let i = 0; i < filteredStudents.length; i += batchSize) {
      newBatches.push(filteredStudents.slice(i, i + batchSize));
    }
    setBatches(newBatches);
  };

  const downloadExcel = (batch, batchIndex) => {
    const ws = utils.json_to_sheet(batch);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, `Batch_${batchIndex + 1}`);
    writeFile(wb, `batch_${batchIndex + 1}.xlsx`);
};

  //new
  const [trainingData, setTrainingData] = useState([]);
const [showModal, setShowModal] = useState(false);
const [scheduleCode, setScheduleCode] = useState("");
const [trainingName, setTrainingName] = useState("");
const [type, setType] = useState("");
const [trainee, setTrainee] = useState("");
const [fromdate, setFromdate] = useState("");
const [todate, setTodate] = useState("");
const [duration, setDuration] = useState("");
const [batch, setBatch] = useState("");
const [department, setDepartment] = useState("");
 // Ensure batches is initialized
const [error, setError] = useState("");
const [batchees, setBatchees] = useState([{ batchNumber: 1, fromdate: "", todate: "" }]);
const updateBatchDate = (index, field, value) => {
  const updatedBatches = batches.map((batch, i) =>
    i === index ? { ...batch, [field]: value } : batch
  );
  setBatches(updatedBatches); 
};


const handleSave = async () => {
    if (!scheduleCode || !trainingName) {
        setError("Both Schedule Code and Training Name are required.");
        return;
    }

    try {
        // Check if Schedule Code Exists
        const response = await axios.get(`http://localhost:3000/api/training/check-schedule-code/${scheduleCode}`);
        if (response.data.exists) {
            Swal.fire({
                title: "Error!",
                text: "Schedule Code Already Taken. Please use a different one.",
                icon: "error",
            });
            return;
        }

        // Ensure Batches Exist
        if (batches.length === 0) {
            Swal.fire({
                title: "Error!",
                text: "No batches found. Please add batches before saving.",
                icon: "error",
            });
            return;
        }

        // Save Training Data
        const trainingData = {
            scheduleCode,
            trainingName,
            type,
            trainee,
            fromdate,
            todate,
            duration,
            batch,
            department,
            batches,
        };

        const saveResponse = await axios.post("http://localhost:3000/api/training/saveTraining", trainingData);

        if (saveResponse.status === 201) {
            Swal.fire({
                title: "Saved!",
                text: "Training data has been saved successfully.",
                icon: "success",
            });

            // Reset Fields After Saving
            setScheduleCode("");
            setTrainingName("");
            setType("");
            setTrainee("");
            setFromdate("");
            setTodate("");
            setDuration("");
            setBatch("");
            setDepartment("");
            setBatches([]);
            setError("");
            setShowModal(false);
        }
    } catch (error) {
        console.error("Error saving training:", error);
        Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Something went wrong. Please try again.",
            icon: "error",
        });
    }
};

  

  //new



  return (
    <>

      <div>
        <div className="hea">
          {" "}
          <Link
            to="/Maindashboard/Training"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div>
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
              <h2
                style={{
                  position: "relative",
                  top: "45px",
                  left: "30px",
                  fontFamily: "poppins",
                  fontSize: "35px",
                  width: "100px",
                }}
              >
                Schedule's
              </h2>
            </div>
          </Link>
        </div>
      </div>

      <div
        className=""
        style={{
          width: "1250px",
          padding: "20px",
          fontFamily: "Arial",
          position: "relative",
          left: "250px",
          marginBottom: "200px",
          marginTop: "50px",
        }}
      >
        <div
          className="filterboxess"
        >
          <div>
            <div className="lable1">
              <div>
                <label style={{ fontSize: "23px" }}>Department:</label>
                <div>
                  <div
                    onMouseEnter={() => setHoverVisible(true)}
                    onMouseLeave={() => setHoverVisible(false)}
                  >
                    <div className="par">
                      <div
                        style={{
                          border: "gray 1px solid",
                          padding: "9px",
                          width: "200px",
                          color: "grey",
                        }}
                      >
                        {" "}
                        <label style={{ fontSize: "15.5px" }}>
                          Select Department:
                        </label>
                      </div>
                    </div>
                    {hoverVisible && (
                      <div
                        className="absolute top-full mt-2 w-48 p-4 bg-gray-100 shadow-md rounded-lg"
                        style={{
                          border: " 1px solid rgb(184, 180, 180)",
                          width: "180px",
                          position: "relative",
                          bottom: "2px",
                          boxShadow: "0 0 5px rgb(177, 177, 177)",
                        }}
                      >
                        <label>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={filters.department.length === 0}
                            onChange={(e) =>
                              handleAllCheckboxChange(e, "department")
                            }
                          />
                          All
                        </label>
                        {departmentOptions.map((dept) => (
                          <div key={dept}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              value={dept}
                              checked={filters.department.includes(dept)}
                              onChange={(e) =>
                                handleCheckboxChange(e, "department")
                              }
                            />
                            {dept}
                          </div>
                        ))}
                        {showOtherDepartment && (
                          <div>
                            <input
                              style={{
                                marginBottom: "10px",
                                padding: "8px",
                                width: "100%",
                                maxWidth: "300px",
                              }}
                              type="text"
                              className="form-check-input"
                              placeholder="Enter Department"
                              onChange={(e) =>
                                handleInputChange(e, "otherDepartment")
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lable1">
            <div>
              <label style={{ fontSize: "23px" }}>Batch:</label>
              <div>
                <div
                  className="relative w-40 h-40 bg-blue-300 rounded-lg flex items-center justify-center cursor-pointer"
                  onMouseEnter={() => setHoverVisiblee(true)}
                  onMouseLeave={() => setHoverVisiblee(false)}
                >
                  <div
                    style={{
                      border: "gray 1px solid",
                      padding: "9px",
                      width: "200px",
                      color: "grey",
                    }}
                  >
                    {" "}
                    <label style={{ fontSize: "15.5px" }}>Select Batch:</label>
                  </div>
                  <br />
                  {hoverVisiblee && (
                    <div
                      className="absolute top-full mt-2 w-48 p-4 bg-gray-100 shadow-md rounded-lg"
                      style={{
                        border: " rgb(184, 180, 180) 1px solid",
                        width: "180px",
                        position: "relative",
                        bottom: "26px",
                        boxShadow: "0 0 5px rgb(177, 177, 177)",
                      }}
                    >
                      <label>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={filters.batch.length === 0}
                          onChange={(e) => handleAllCheckboxChange(e, "batch")}
                        />
                        All
                      </label>
                      {batchOptions.map((batch) => (
                        <div key={batch}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={batch}
                            checked={filters.batch.includes(batch)}
                            onChange={(e) => handleCheckboxChange(e, "batch")}
                          />{" "}
                          {batch}
                        </div>
                      ))}
                      {showOtherBatch && (
                        <input
                          style={{
                            marginBottom: "10px",
                            padding: "8px",
                            width: "100%",
                            maxWidth: "300px",
                          }}
                          className="form-check-input"
                          type="text"
                          placeholder="Enter Batch"
                          onChange={(e) => handleInputChange(e, "otherBatch")}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="lable1">
            <div>
              <label style={{ fontSize: "23px" }}>CGPA:</label>
              <br />
              <select
                onChange={(e) => handleSelectChange(e, "cgpa")}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <option value="" disabled>
                  select CGPA:
                </option>
                <option value="">ANY</option>
                {cgpaOptions.map((cgpa) => (
                  <option key={cgpa} value={cgpa.split(" ")[0]}>
                    {cgpa}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="lable1">
            <div>
              <label style={{ fontSize: "23px" }}>Arrears:</label>
              <br />
              <select
                onChange={(e) => handleSelectChange(e, "arrears")}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <option value="" disabled>
                  select Arrears:
                </option>
                <option value="">ANY</option>
                {arrearsOptions.map((arr) => (
                  <option key={arr} value={arr}>
                    {arr}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="lable1">
            <div>
              <label style={{ fontSize: "23px" }}>History of Arrears:</label>
              <select
                onChange={(e) => handleSelectChange(e, "historyOfArrears")}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  width: "210px",
                  maxWidth: "300px",
                }}
              >
                {" "}
                <option value="" disabled>
                  select HOA:
                </option>
                <option value="">ANY</option>
                {historyOfArrearsOptions.map((hoa) => (
                  <option key={hoa} value={hoa}>
                    {hoa}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="lable1" style={{ left: "550px", bottom: "575px" }}>
            <div>
              <label style={{ fontSize: "23px" }}>Area Of Intrest:</label>
              <div>
                <div
                  className="relative w-40 h-40 bg-blue-300 rounded-lg flex items-center justify-center cursor-pointer"
                  onMouseEnter={() => setHoverVisibleee(true)}
                  onMouseLeave={() => setHoverVisibleee(false)}
                >
                  <div
                    style={{
                      border: "gray 1px solid",
                      padding: "9px",
                      width: "200px",
                      color: "grey",
                    }}
                  >
                    {" "}
                    <label style={{ fontSize: "15.5px" }}>
                      Select Area of Interest:
                    </label>
                  </div>
                  <br />
                  {hoverVisibleee && (
                    <div
                      className="absolute top-full mt-2 w-48 p-4 bg-gray-100 shadow-md rounded-lg"
                      style={{
                        border: " rgb(184, 180, 180) 1px solid",
                        width: "270px",
                        position: "relative",
                        bottom: "26px",
                        boxShadow: "0 0 5px rgb(177, 177, 177)",
                      }}
                    >
                      <label>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={filters.aoi.length === 0}
                          onChange={(e) => handleAllCheckboxChange(e, "aoi")}
                        />
                        All
                      </label>
                      {aoiOptions.map((aoi) => (
                        <div key={aoi}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={aoi}
                            checked={filters.aoi.includes(aoi)}
                            onChange={(e) => handleCheckboxChange(e, "aoi")}
                          />{" "}
                          {aoi}
                        </div>
                      ))}
                      {showOtherAoi && (
                        <input
                          style={{
                            marginBottom: "10px",
                            padding: "8px",
                            width: "100%",
                            maxWidth: "300px",
                          }}
                          type="text"
                          placeholder="Enter Area of Interest"
                          onChange={(e) => handleInputChange(e, "otherAoi")}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="lable1" style={{ left: "0px", bottom: "575px" }}>
            <div>
              <label style={{ fontSize: "23px" }}>Languages:</label>
              <input
                type="text"
                placeholder="Enter Language:"
                onChange={(e) => handleInputChange(e, "language")}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  width: "100%",
                  maxWidth: "300px",
                }}
              />
            </div>
          </div>
        </div>
        <div className=" " style={{ position: "relative", bottom: "80px" }}>

          <div className="mb-3">
            <h5>Batch Size</h5>
            <input
              type="number"
              className="form-control "
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              min="1"
              style={{ width: "100px" }}
            />
          </div>
          <button style={{ position: "relative", left: "1000px", bottom: "100px" }} className="btn btn-primary mb-3" onClick={applyFilters}>
            Apply Filters
          </button>
          <h4 className="mb-4">
            Total Records: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{batches.flat().length}</span>
          </h4>

          {batches.map((batch, index) => (
            <div key={index} className="mb-4">
              <h5 className="mb-4" style={{ position: "relative", left: "40px", fontSize: "25px" }}>Batch {index + 1} :</h5> <button
                className="btn btn-success me-2 "
                style={{ position: "relative", left: "1000px", bottom: "40px" }}
                onClick={() => downloadExcel(batch, index)}
              >
                <i
                  className="bi bi-file-earmark-excel"
                  style={{ marginRight: "10px" }}
                ></i>
                Excel
                <i className="bi bi-download" style={{ marginLeft: "5PX" }}></i>
              </button>
              <div className="mb-4" style={{ position: "relative", right: "230px" }}>
                <table className="table table-striped  table-hover tabl"  >
                  <thead>
                    <tr>
                      <th>REGISTRATION_NUMBER</th>
                      <th>NAME</th>
                      <th>DEPARTMENT</th>
                      <th>BATCH</th>
                      <th>CGPA</th>
                      <th>ARREARS</th>
                      <th>HOA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.map((student) => (
                      <tr key={student.REGISTRATION_NUMBER}>
                        <td>{student.REGISTRATION_NUMBER}</td>
                        <td>{student.NAME}</td>
                        <td>{student.DEPARTMENT}</td>
                        <td>{student.BATCH}</td>
                        <td>{student.CPGA}</td>
                        <td>{student.ARREARS}</td>
                        <td>{student.HOA}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            </div>
          ))}
        </div>
        <div>
        <div>
      <button className="btn" onClick={() => setShowModal(true)} disabled={batches.length === 0} style={{backgroundColor:"grey",color:'white'}}>
        Save
      </button>

      {/* Bootstrap Modal */}
      <div className={`modal fade ${showModal ? "show d-block" : "d-none"}`} tabIndex="-1" style={{}}>
        <div className="modal-dialog">
          <div className="modal-content" style={{}}>
            <div className="modal-header">
              <h5 className="modal-title">Enter Training Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Schedule Code"
                  value={scheduleCode}
                  onChange={(e) => setScheduleCode(e.target.value)}
                  required
                />
              </div>
             
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Training Name"
                  value={trainingName}
                  onChange={(e) => setTrainingName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Type Name"
                  value={type}
                  required
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Trainee Name"
                  required
                  value={trainee}
                  onChange={(e) => setTrainee(e.target.value)}
                />
              </div>
              {/* Batches Section */}
            <h5>Batches</h5>
            {batches.map((batch, index) => (
              <div key={index} className="border p-3 mb-2 rounded">
                <h6>Batch {batch.batchNumber}</h6>
                <div className="row">
                  <div className="col-md-5">
                    <label className="form-label">From Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={batch.fromdate}
                      onChange={(e) => updateBatchDate(index, "fromdate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label">To Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={batch.todate}
                      onChange={(e) => {
                        if (e.target.value < batch.fromdate) {
                          Swal.fire("Invalid Date!", "End date cannot be before start date.", "warning");
                        } else {
                          updateBatchDate(index, "todate", e.target.value);
                        }
                      }}
                      required
                    />
                  </div>
                  
                </div>
              </div>
            ))}
          
         
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
             
              <div className="mb-3">
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder=" Department "
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
     
    </>
  );
}

export default Trainingschedule;