
import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Placementannounce.css";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";

import Loading from "./Loading";
function Placementsannounce() {



  
const [companies, setCompanies] = useState([]);



const fetchCompanies = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/companies/get-companies");
    setCompanies(response.data|| []);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching companies:", error);
    setLoading(false);
  }
};

useEffect(() => {
  fetchCompanies();
}, []);


  const [selectedCompany, setSelectedCompany] = useState(null);
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [requirements, setRequirements] = useState("");
  const [skills, setSkills] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [cgpa, setCgpa] = useState("Any");
  const [students, setStudents] = useState([]);
  const [stdloading, setstdloading] = useState(false)
  const [loading, setLoading] = useState(false);
  const sendEmails = async () => {
    if (selectedStudents.length === 0) {
      alert("⚠ Please select at least one student.");
      return;
    }

    if (!selectedCompany || !date || !venue || !requirements || !skills) {
      alert("⚠ Please fill in all the required fields.");
      return;
    }
    console.log("Sending email request:", {
      studentIds: selectedStudents,
      company: selectedCompany?.COMPANYNAME,
      date,
      venue,
      requirements,
      skills,
    });


    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/send-email", {
        studentIds: selectedStudents,
        company: selectedCompany?.COMPANYNAME,
        date,
        venue,
        requirements,
        skills,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        alert("Emails sent successfully!");
        setSelectedStudents([]); 
      } else {
        alert("Failed to send emails: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      alert("Error sending emails: " + error.response?.data?.message || error.message);
    } finally {
      setLoading(false); 
    }
  };


  const [getstudents, setgetstudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([]);
  const handleSelectStudent = (id) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((studentId) => studentId !== id) 
        : [...prevSelected, id] 
    );
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      
      setSelectedStudents(getstudents.flat().map((student) => student._id));
    } else {
    
      setSelectedStudents([]);
    }
  };
  


 
  const openCompanyDetails = (company) => {
    setSelectedCompany(company);
  };


  const applyFilter = () => {
    if (!department && !batch && cgpa === "Any") {
      alert("Please select at least one filter.");
      return;
    }

    axios
      .get("http://localhost:3000/getstudents")
      .then((response) => {
        setStudents(response.data);
        alert("Filter applied successfully!");
      })
      .catch((error) => console.error("Error fetching students:", error));
  };


  useEffect(() => {
    const fetchstudents = async () => {
      setstdloading(true)
      try {
        const responnse = await axios.get("http://localhost:3000/api/students", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,

          },
        }
        )
        console.log(responnse.data)
        if (responnse.data.success) {

          const data = await responnse.data.students.map((std, index) => ({
            _id: std._id,
            registration_number: std.registration_number,
            name: std.name,
            department: std.department,
            batch: std.batch,
            profileImage: std.userId.profileImage,
            email: std.userId.email,
            sslc: std.sslc,
            hsc: std.hsc,
            achievements: std.achievements,
            index: index + 1,
            diploma: std.diploma,
            sem1: std.sem1,
            sem2: std.sem2,
            sem3: std.sem3,
            sem4: std.sem4,
            sem5: std.sem5,
            sem6: std.sem6,
            sem7: std.sem7,
            sem8: std.sem8,
            cgpa: std.cgpa,
            arrears: std.arrears,
            internships: std.internships,
            certifications: std.certifications,
            password: std.password,
            role: std.role,
            patentspublications: std.patentspublications,
            hoa: std.hoa,
            language: std.language,
            aoi: std.aoi,
            address: std.address,
            phoneno: std.phoneno,
            resume: std.resume,
            offerpdf: std.offerpdf,
            placement: std.placement,
            offers: std.offers


          }))
          setgetstudents(data)

        }

      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setstdloading(false)
      }
    }
    fetchstudents()
  }, [])

  
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

  
  const handleAllCheckboxChange = (e, key) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setFilters((prev) => ({ ...prev, [key]: [] }));
    }
  };
  const [hoverVisible, setHoverVisible] = useState(false);
  const [hoverVisiblee, setHoverVisiblee] = useState(false);
  const [hoverVisibleee, setHoverVisibleee] = useState(false);
  const filteredStudents = getstudents.filter((student) => {
    return (
      (filters.department.length === 0 ||
        filters.department.includes(student.department) ||
        (showOtherDepartment &&
          student.department?.includes(filters.otherDepartment))) &&
      (filters.batch.length === 0 ||
        filters.batch.includes(student.batch) ||
        (showOtherBatch && student.batch?.includes(filters.otherBatch))) &&
      (filters.cgpa === "" ||
        parseFloat(student.cgpa) >= parseFloat(filters.cgpa)) &&
      (filters.arrears === "" ||
        student.arrears?.toString() === filters.arrears) &&
      (filters.historyOfArrears === "" ||
        student.hoa?.toString() === filters.historyOfArrears) &&
      (filters.aoi.length === 0 ||
        filters.aoi.includes(student.aoi) ||
        (showOtherAoi && student.aoi?.includes(filters.otherAoi))) &&
      (filters.language === "" ||
        (student.language &&
          student.language.toLowerCase().includes(filters.language.toLowerCase())))
    );
  });

  
 const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = filteredStudents.slice(
    startIdx,
    startIdx + rowsPerPage
  );
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    COMPANYNAME: "",
    content: "",
  });
  const [companyImg, setCompanyImg] = useState(null); 


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleFileChange = (e) => {
    setCompanyImg(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("COMPANYNAME", formData.COMPANYNAME);
      formDataToSend.append("content", formData.content);
      if (companyImg) {
        formDataToSend.append("COMPANYIMG", companyImg);
      }

 
      const res = await axios.post(
        "http://localhost:3000/api/companies/addcompany",
        formDataToSend
      );

      if (res.status === 201) {
        Swal.fire("Success", "Company added successfully!", "success");
        handleClose();
        setFormData({
          COMPANYNAME: "",
          content: "",
        });
        setCompanyImg(null);
        window.location.reload()
      }
    } catch (error) {
      console.error("Error adding company:", error);
      Swal.fire("Error", "Failed to add company!", "error");
    }
  };

  // Modal handlers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showw, setShoww] = useState(false);
  const [companiess, setCompaniess] = useState([]);

  // Fetch all companies
  const fetchCompaniess = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/companies/get-companies");
      setCompaniess(res.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Handle modal open/close
  const handleShoww = () => {
    fetchCompaniess();
    setShoww(true);
  };
  const handleClosee = () => setShoww(false);

  // Delete company
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this company?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/companies/deletecompany/${id}`);
          fetchCompaniess(); 
          window.location.reload()
          Swal.fire("Deleted!", "Company deleted successfully.", "success");
        } catch (error) {
          console.error("Error deleting company:", error);
          Swal.fire("Error", "Failed to delete company.", "error");
        }
      }
    });
  };

  const [departmentOptions, setDepartmentOptions] = useState([]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/filters/getdepartments");
      const departmentNames = res.data.map((dept) => dept.name);
      setDepartmentOptions(departmentNames);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  
  useEffect(() => {
    fetchDepartments();
  }, []);
  
  const [batchOptions, setBatchOptions] = useState([]);
  
  
  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/filters/getbatch");
      const batchNames = res.data.map((batch) => batch.batchName);
      setBatchOptions([...batchNames, "Others"]); 
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };
  
  useEffect(() => {
    fetchBatches();
  }, []);
  
  const [aoiOptions, setAoiOptions] = useState([]);
  
  const fetchAoiOptions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/filters/getaoi");
      console.log("AOI options received:", res.data);
      const aoiNames = res.data.map((aoi) => aoi.aoiName); 
      console.log("Mapped AOI Names:", aoiNames);
      setAoiOptions(aoiNames);
    } catch (error) {
      console.error("Error fetching AOI options:", error);
    }
  };
  
  
  
  useEffect(() => {
    fetchAoiOptions();
  }, []);
  
  return (
    <>


      <div className='hea'> <Link to="/Maindashboard" style={{
        textDecoration: 'none', color:
          "black"
      }}>
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{
              marginLeft: "20px",
              border: "none",
              position: "relative",
              top: "95px",
              right: '40px',
              fontSize: "35px",
              color: "black",
              backgroundColor: "transparent",
            }}
          >
            <IoIosArrowBack />
          </button>
          <h2 style={{ position: "relative", top: '45px', left: "30px", fontFamily: 'poppins', fontSize: "35px", width: '100px' }}>Companies</h2>
        </div>
      </Link>
      <button className="btn  btn-primary " onClick={handleShoww} style={{ marginRight: "50px", position: "relative", left: "1130px", top: "-20px" }}>Edit</button>
      <Modal show={showw} onHide={handleClosee} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Companies</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
          {companiess.length === 0 ? (
            <p>No companies available to display.</p>
          ) : (
            companiess.map((company) => (
              <div
                className="d-flex align-items-center mb-2"
                key={company._id}
              >
                <span style={{ width: "100px", fontWeight: "bold" }}>
                  {company.COMPANYNAME}:
                </span>
                <Form.Control
                  type="text"
                  value={company.COMPANYNAME}
                  readOnly
                  style={{ width: "150px", marginRight: "10px" }}
                />
                <Button
                  variant="danger"
                  onClick={() => handleDelete(company._id)}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </Modal.Body>

        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
      <button className="btn  " onClick={handleShow} style={{ marginRight: "50px", position: "relative", left: "1080px", top: "-20px" }}><i className="bi bi-plus-circle-fill" style={{ fontSize: "40px", color: "blue" }}></i></button>
        <div className="companies-grid" style={{ position: 'relative', top: "-30px",left:'30px', marginBottom: '200px', marginTop: '40px' }}>
          {companies.map((company) => (
            <div key={company.ID} className="company-card" data-bs-toggle="offcanvas" data-bs-target="#companyDetails" onClick={() => openCompanyDetails(company)}>
              <img src={`http://localhost:3000/${company.COMPANYIMG}`} alt={company.COMPANYNAME} className="company-logo" />
              <h3 className="company-name">{company.COMPANYNAME}</h3>
              <p className="company-description">{company.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="companyDetails" style={{ width: "700px" }} data-bs-backdrop="static">
        <div className="offcanvas-header">
          <h6 className="offcanvas-title text-primary fw-bold">Requirements</h6>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {selectedCompany && (
            <div>
              <h4 className="text-dark fw-semibold">{selectedCompany.COMPANYNAME}</h4>
              <div className="row mb-5">
  <div className="col-md-6">
    <label className="form-label">Date</label>
    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)}   style={{width:"100%"}}/>
  </div>
  <div className="col-md-6">
    <label className="form-label">Venue</label>
    <input type="text" className="form-control" placeholder="Enter Venue" value={venue} onChange={(e) => setVenue(e.target.value)}   style={{width:"100%"}}/>
  </div>
</div>

              <div className="mb-3">
                <label className="form-label">General Requirements/Info</label>
                <textarea className="form-control" rows="3" placeholder="Enter requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} style={{minHeight:"200px",width:"100%"}}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Skills Required</label>
                <textarea className="form-control" rows="2" placeholder="Enter skills" value={skills} onChange={(e) => setSkills(e.target.value)} style={{minHeight:"100px",width:"100%"}}></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#studentFilterOffcanvas">
                  Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="offcanvas offcanvas-start" id="studentFilterOffcanvas" tabIndex="-1" aria-labelledby="filterOffcanvasLabel" data-bs-backdrop="static" style={{ width: "1200px" }}>

        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-bold text-primary" id="filterOffcanvasLabel">Filter's</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
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
                      {batchOptions
  .filter((batch) => batch !== "Others")
  .map((batch) => (
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
        

        <div className="table-responsive mt-4">
  <h4>Total Students:
    <span className="badge bg-dark ms-2">{filteredStudents?.flat()?.length || 0}</span>
  </h4>
  
  {stdloading ? (
    <div>
      <Loading />
    </div>
  ) : (
    <>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <label>
          No of records per page:
          <input
            type="number"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            style={{ width: "50px", marginLeft: "10px" }}
          />
        </label>

        <div style={{ position: 'relative', left: '-150px' }}>
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            className="btn" 
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-double-left"></i>
          </button>

          <span className="mx-3">Page {currentPage} of {totalPages}</span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="btn"
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-chevron-double-right arr"></i>
          </button>
        </div>
      </div>

      <table className="table table-striped table-bordered mt-3" style={{ position: 'relative', left: '0px', minWidth: '1100px' }}>
        <thead className="thead-dark">
          <tr>
          <th>
  <input
    type="checkbox"
    onChange={handleSelectAll}
    checked={selectedStudents.length === getstudents.flat().length && getstudents.flat().length > 0}
  />
</th>

            <th>#</th>
            <th>Profile</th>
            <th>Registration Number</th>
            <th>Name</th>
            <th>Department</th>
            <th>Batch</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((student, index) => (
            <tr key={student._id}>
             <td>
  <input
    type="checkbox"
    checked={selectedStudents.includes(student._id)}
    onChange={() => handleSelectStudent(student._id)}
  />
</td>

              <td>{index + 1}</td>
              <td>
                <img
                  src={student.profileImage ? `http://localhost:3000/${student.profileImage}` : "/default-avatar.png"}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              </td>
              <td>{student.registration_number}</td>
              <td>{student.name}</td>
              <td>{student.department}</td>
              <td>{student.batch}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end mt-3">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Sending Emails... Please wait</p>
          </div>
        </div>
      )}
        <button className="btn btn-primary" onClick={sendEmails} disabled={loading}>
          {loading ? "Sending..." : "Send Emails"}
        </button>
      </div>
    </>
  )}
</div>


          <div className="offcanvas-footer" >

          </div>
        </div>
      </div>


      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Company</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group controlId="formCompanyIMG" className="mt-2">
              <Form.Label>Company Image</Form.Label>
              <Form.Control
                type="file"
                name="COMPANYIMG"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCompanyName" className="mt-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="COMPANYNAME"
                placeholder="Enter Company Name"
                value={formData.COMPANYNAME}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formContent" className="mt-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                placeholder="Enter Content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Add
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

    </>
  );
}

export default Placementsannounce;