
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Placementannounce.css";

import Loading from "./Loading";

const jsonData = [
  { ID: 1, COMPANYIMG: "amazon.png", COMPANYNAME: "Amazon", content: "Join Amazon for exciting career opportunities!" },
  { ID: 2, COMPANYIMG: "bosch.png", COMPANYNAME: "Bosch", content: "Innovate with Bosch and shape the future." },
  { ID: 3, COMPANYIMG: "capgemini.png", COMPANYNAME: "Capgemini", content: "Work with cutting-edge tech at Capgemini." }, { ID: 4, COMPANYIMG: "cognizant.png", COMPANYNAME: "Cognizant", content: "Enhance your career with Cognizant." },
  { ID: 5, COMPANYIMG: "ge.png", COMPANYNAME: "GENERAL ELECTRIC", content: "Build the future of energy with GE." },
  { ID: 6, COMPANYIMG: "hexaware.png", COMPANYNAME: "Hexaware", content: "Join Hexaware for a dynamic career path." },
  { ID: 7, COMPANYIMG: "ibm.png", COMPANYNAME: "IBM", content: "Shape AI and cloud computing at IBM." },
  { ID: 8, COMPANYIMG: "infosys.png", COMPANYNAME: "Infosys", content: "Innovate and grow with Infosys." },
  { ID: 9, COMPANYIMG: "nttdata.png", COMPANYNAME: "NTT DATA", content: "Be part of NTT DATA's global team." },
  { ID: 10, COMPANYIMG: "odessa.png", COMPANYNAME: "Odessa", content: "Drive digital transformation at Odessa." },
  { ID: 11, COMPANYIMG: "samsung.png", COMPANYNAME: "Samsung", content: "Invent the future with Samsung." },
  { ID: 12, COMPANYIMG: "sigma.png", COMPANYNAME: "Mu Sigma", content: "Join Mu Sigma and redefine analytics." },
  { ID: 13, COMPANYIMG: "sutherland.png", COMPANYNAME: "Sutherland", content: "Explore career paths at Sutherland." },
  { ID: 14, COMPANYIMG: "tcs.png", COMPANYNAME: "TCS", content: "Lead digital change with TCS." },
  { ID: 15, COMPANYIMG: "trimble.png", COMPANYNAME: "Trimble", content: "Revolutionize engineering at Trimble." },
  { ID: 16, COMPANYIMG: "virtusa.png", COMPANYNAME: "Virtusa", content: "Build future-ready solutions at Virtusa." },
  { ID: 17, COMPANYIMG: "wipro.png", COMPANYNAME: "Wipro", content: "Join Wipro for endless possibilities." },
  { ID: 18, COMPANYIMG: "zoho.png", COMPANYNAME: "ZOHO", content: "Innovate with Zoho’s cutting-edge solutions." },

];
function Placementsannounce() {
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
        alert("✅ Emails sent successfully!");
        setSelectedStudents([]); 
      } else {
        alert("❌ Failed to send emails: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Error sending emails: " + error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop loading
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



  // Open company details modal
  const openCompanyDetails = (company) => {
    setSelectedCompany(company);
  };

  // Apply filter and fetch students
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
          student.department.includes(filters.otherDepartment))) &&
      (filters.batch.length === 0 ||
        filters.batch.includes(student.batch) ||
        (showOtherBatch && student.batch.includes(filters.otherBatch))) &&
      (filters.cgpa === "" ||
        parseFloat(student.cgpa) >= parseFloat(filters.cgpa)) &&
      (filters.arrears === "" ||
        student.arrears.toString() === filters.arrears) &&
      (filters.historyOfArrears === "" ||
        student.hoa.toString() === filters.historyOfArrears) &&
      (filters.aoi.length === 0 ||
        filters.aoi.includes(student.aoi) ||
        (showOtherAoi && student.aoi.includes(filters.otherAoi))) &&
      (filters.language === "" ||
        student.language.toLowerCase().includes(filters.language.toLowerCase()))
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

  return (
    <>


      <div className='hea'> <Link to="/Studentdashboard" style={{
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

        <div className="companies-grid" style={{ position: 'relative', top: "50px", marginBottom: '200px', marginTop: '40px' }}>
          {jsonData.map((company) => (
            <div key={company.ID} className="company-card" data-bs-toggle="offcanvas" data-bs-target="#companyDetails" onClick={() => openCompanyDetails(company)}>
              <img src={`/images/${company.COMPANYIMG}`} alt={company.COMPANYNAME} className="company-logo" />
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
    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
  </div>
  <div className="col-md-6">
    <label className="form-label">Venue</label>
    <input type="text" className="form-control" placeholder="Enter Venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
  </div>
</div>

              <div className="mb-3">
                <label className="form-label">General Requirements/Info</label>
                <textarea className="form-control" rows="3" placeholder="Enter requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} style={{minHeight:"200px"}}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Skills Required</label>
                <textarea className="form-control" rows="2" placeholder="Enter skills" value={skills} onChange={(e) => setSkills(e.target.value)} style={{minHeight:"100px"}}></textarea>
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
                checked={selectedStudents.length === students.flat().length && students.flat().length > 0}
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




    </>
  );
}

export default Placementsannounce;