import React from "react";
import Topbar from "./Topbar";
import { Link } from "react-router-dom";
import "./Placementannounce.css";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";

function Placementsannounce() {
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
  const batchOptions = ["2023-2027", "2022-2026", "2021-2025","2020-2024","2025-2028", "Others"];
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
  //old version
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [generalReq, setGeneralReq] = useState("");
  const [skillsetReq, setSkillsetReq] = useState("");

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailContent, setEmailContent] = useState("");
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);



  const handleSelect = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const jsonData = [
    {
      ID: 1,
      COMPANYIMG: "amazon.png",
      COMPANYNAME: "Amazon",
      content: "Details for Item 1",
    },
    {
      ID: 2,
      COMPANYIMG: "bosch.png",
      COMPANYNAME: "Bosch",
      content: "Details for Item 2",
    },
    {
      ID: 3,
      COMPANYIMG: "capgemini.png",
      COMPANYNAME: "Cap Gemini",
      content: "Details for Item 3",
    },
    {
      ID: 4,
      COMPANYIMG: "cognizant.png",
      COMPANYNAME: "Cognizant",
      content: "Details for Item 4",
    },
    {
      ID: 5,
      COMPANYIMG: "ge.png",
      COMPANYNAME: "GENERAL ELECTRIC",
      content: "Details for Item 5",
    },
    {
      ID: 6,
      COMPANYIMG: "hexaware.png",
      COMPANYNAME: "Hexaware",
      content: "Details for Item 6",
    },
    {
      ID: 7,
      COMPANYIMG: "ibm.png",
      COMPANYNAME: "IBM",
      content: "Details for Item 7",
    },
    {
      ID: 8,
      COMPANYIMG: " infosys.png",
      COMPANYNAME: "Infosys",
      content: "Details for Item 8",
    },
    {
      ID: 9,
      COMPANYIMG: " nttdata.png",
      COMPANYNAME: "NTT DATA",
      content: "Details for Item 8",
    },
    {
      ID: 10,
      COMPANYIMG: "odessa.png",
      COMPANYNAME: "Odessa",
      content: "Details for Item 1",
    },
    {
      ID: 11,
      COMPANYIMG: "samsung.png",
      COMPANYNAME: "SAMSUNG",
      content: "Details for Item 2",
    },
    {
      ID: 12,
      COMPANYIMG: "sigma.png",
      COMPANYNAME: "Mu Sigma",
      content: "Details for Item 3",
    },
    {
      ID: 13,
      COMPANYIMG: "sutherland.png",
      COMPANYNAME: "SUTHERLAND",
      content: "Details for Item 4",
    },
    {
      ID: 14,
      COMPANYIMG: "tcs.png",
      COMPANYNAME: "TCS",
      content: "Details for Item 5",
    },
    {
      ID: 15,
      COMPANYIMG: "trimble.png",
      COMPANYNAME: "Trimble",
      content: "Details for Item 6",
    },
    {
      ID: 16,
      COMPANYIMG: "virtusa.png",
      COMPANYNAME: "Virtusa",
      content: "Details for Item 7",
    },
    {
      ID: 17,
      COMPANYIMG: " wipro.png",
      COMPANYNAME: "Wipro",
      content: "Details for Item 8",
    },
    {
      ID: 18,
      COMPANYIMG: "zoho.png",
      COMPANYNAME: "ZOHO",
      content: "Details for Item 8",
    },
  ];
  const [selectedItem, setSelectedItem] = useState("");

  const handleButtonClick = (item) => {
    setSelectedItem(item);
  };
  //new
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
    const [students,setstudents]=useState([])
  useEffect(() => {
    axios.get("https://pmsproject-api.vercel.app/getstudents")
      .then(response => setstudents(response.data))
      .catch(error => console.error("Error fetching students:", error));
    }, []);
    

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
          student.ARREARS.toString() === filters.arrears) &&
        (filters.historyOfArrears === "" ||
          student.HOA.toString() === filters.historyOfArrears) &&
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
  
  //old
  const handleSelectAll = () => {
    const allEmails = filteredStudents.map((item) => item.EMAIL);
    if (selectedEmails.length === filteredStudents.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(allEmails);
    }
  };

  const sendEmails = () => {
    if (!emailContent.trim()) {
      alert("PLEASE ENTER EMAIL CONTENT.");
      return;
    }
    alert("EMAIL SENT!");
    setEmailContent("");
    setSelectedEmails([]);
    setIsOffcanvasOpen(false);
  };
  useEffect(() => {
    const existingContentLines = emailContent.split("\n");
    let newContent = emailContent;

    
    const dateLineIndex = existingContentLines.findIndex((line) =>
      line.startsWith("Date:")
    );
    if (dateLineIndex !== -1) {
      existingContentLines[dateLineIndex] = `Date: ${date || "Not Specified"}`;
    } else if (date) {
      existingContentLines.push("Date: ${date}");
    }

   
    const venueLineIndex = existingContentLines.findIndex((line) =>
      line.startsWith("Venue:")
    );
    if (venueLineIndex !== -1) {
      existingContentLines[venueLineIndex] = `Venue: ${
        venue || "Not Specified"
      }`;
    } else if (venue) {
      existingContentLines.push("Venue: ${venue}");
    }

   
    const generalReqLineIndex = existingContentLines.findIndex((line) =>
      line.startsWith("General Requirements:")
    );
    if (generalReqLineIndex !== -1) {
      existingContentLines[generalReqLineIndex] = `General Requirements: ${
        generalReq || "Not Specified"
      }`;
    } else if (generalReq) {
      existingContentLines.push("General Requirements: ${generalReq}");
    }

    const skillsetReqLineIndex = existingContentLines.findIndex((line) =>
      line.startsWith("Skillset Requirements:")
    );
    if (skillsetReqLineIndex !== -1) {
      existingContentLines[skillsetReqLineIndex] = `Skillset Requirements: ${
        skillsetReq || "Not Specified"
      }`;
    } else if (skillsetReq) {
      existingContentLines.push("Skillset Requirements: {skillsetReq}");
    }

    newContent = existingContentLines.filter(Boolean).join("\n");
    setEmailContent(newContent);
  }, [date, venue, generalReq, skillsetReq]);
  //new
  const [showForm, setShowForm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/jpeg") {
      setSelectedFile(file);
    } else {
      alert("Please select a valid JPEG image.");
    }
  };

  const handleSubmit = () => {
    if (!companyName.trim()) {
      alert("Enter a company name.");
      return;
    }
    if (!selectedFile) {
      alert("Attach a JPEG image.");
      return;
    }
    console.log("Company Name:", companyName);
    console.log("Selected File:", selectedFile);
  };
  //new
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(students.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = filteredStudents.slice(startIdx, startIdx + rowsPerPage);

  return (
    <>
      <div>
        <Topbar />
      </div>

      <div className="trcontainer">
        <Link to="/Maindashboard">
          <div>
            <button
              type="button"
              class="btn btn-secondary"
              style={{
                marginLeft: "20px",
                border: "none",
                position: "relative",
                top: "55px",
                right: "40px",
                fontSize: "35px",
                color: "black",
                backgroundColor: "transparent",
              }}
            >
              <IoIosArrowBack />
            </button>
          </div>
        </Link>
        <h1 style={{ position: "relative", left: "30px", width: "100px", }}>
          Companies
        </h1>
        <div className="trainingflex" style={{ gap: "-20px 30px" }}>
          {jsonData.map((item) => (
            <div key={item.ID}>
              <button
                style={{ border: "none", backgroundColor: "#eaf1fe" }}
                type="button"
                 data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop"
                onClick={() => handleButtonClick(item)}
              >
                <div className="compdimen">
                  <div className="compdes">
                    <div className="compdesign2">
                      <div className="compdesign3"></div>
                    </div>
                  </div>
                  <div className="compdes1">
                    <div className="compdesign21">
                      <div className="compdesign31"></div>
                    </div>
                  </div>
                  <div className="cname">
                    <img src={item.COMPANYIMG} alt="" />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div
       class="offcanvas offcanvas-start" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel"
        style={{ width: "88%", height: "5000px",marginRight:"300px" }}
      >
        <div class="offcanvas-header" style={{ padding: "0px", width: "100%" }}>
          <div className="wavfil" style={{ width: "100%" }}>
            <h1
              style={{
                color: "white",
                position: "relative",
                left: "590PX",
                top: "20PX",
              }}
            >
              {selectedItem.COMPANYNAME}
            </h1>
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              style={{
                marginLeft: "20px",
                border: "none",
                position: "relative",
                left: "1250px",
                bottom: "53px",
                fontSize: "50px",
                color: "white",
                backgroundColor: "transparent",
              }}
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
        <div
          class="offcanvas-body"
          style={{ padding: "0px", height: "150%" }}
        ></div>
        <div style={{ position: "FIXED", top: "100PX", left: "-100px" }}>
          <h1
            style={{
              textAlign: "center",
              position: "relative",
              right: "300px",
            }}
          >
            Requirements{" "}
            <i class="bi bi-info-circle" style={{ fontSize: "30px" }}></i>
          </h1>

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                marginRight: "10px",
                padding: "10px",
                position: "relative",
                bottom: "50px",
                left: "900px",
              }}
            />
            <input
              type="text"
              placeholder="VENUE"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              style={{
                padding: "10px",
                position: "relative",
                bottom: "50px",
                left: "1000px",
              }}
            />
          </div>
          <form action="">
            <div className="container">
              <textarea
                class=" form-control"
                id="exampleFormControlTextarea1"
                rows={4}
                className="text-area"
                type="text"
                placeholder="GENERAL REQUIREMENTS/INFO"
                value={generalReq}
                onChange={(e) => setGeneralReq(e.target.value)}
                style={{
                  marginRight: "10px",
                  padding: "10px",
                  position: "relative",
                  top: "1px",
                  left: "200px",
                  width: "1100px",
                  height: "150px",
                }}
              />
              <textarea
                type="text"
                className="text-area"
                placeholder="SKILLS REQUIRED"
                value={skillsetReq}
                onChange={(e) => setSkillsetReq(e.target.value)}
                style={{
                  marginRight: "10px",
                  padding: "10px",
                  position: "relative",
                  top: "1px",
                  left: "200px",
                  width: "1100px",
                  height: "150px",
                  maxHeight: "100px",
                }}
              />
            </div>
          </form>
          <button
            type="button"
            class="btn btn-primary  bnt"
            onClick={() => setIsOffcanvasOpen(true)}
            className=" btn btnma bnt"
            style={{
              backgroundColor: "rgba(57,102,172,255)",
              color: "white",
              margin: "20px",
              width: "100px",
              borderRadius: "30px",
              position: "relative",
              left: "1200px",
              boxShadow: "none !important",
              outline: "none !important",
            }}
          >
            {" "}
            <i class="bi bi-funnel-fill" style={{ marginRight: "10px" }}></i>
            filter
          </button>
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div
                class="modal-content"
                style={{
                  width: "900px",
                  position: "relative",
                  right: "200px",
                  height: "440px",
                }}
              >
                <div class="modal-header ">
                  <h3
                    class="modal-title"
                    id="exampleModalLabel"
                    style={{
                      position: "relative",
                      left: "370px",
                      color: " rgba(57,102,172,255)",
                    }}
                  >
                    <div class="ribbon">Search:</div>
                  </h3>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body"> </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn "
                    style={{
                      backgroundColor: " rgba(57,102,172,255)",
                      color: "white",
                      width: "100px",
                      position: "relative",
                      bottom: "700px",
                      right: "24px",
                      borderRadius: "30px",
                    }}
                  >
                    Fetch
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Offcanvas */}
          {isOffcanvasOpen && (
            <div
              style={{
                position: "fixed",
                top: "0",
                right: "0",
                width: "97%",
                
                height: "100%",
                backgroundColor: "#F8F9FA",
                padding: "20px",
                overflowY: "scroll",
              }}
            >
              <h3 style={{ position: "relative", left: "15px" }}>
                SEND EMAIL:
              </h3>
              <button
                onClick={() => setIsOffcanvasOpen(false)}
                style={{
                  position: "relative",
                  right: "10px",
                  bottom: "45px",
                  backgroundColor: " #fefffe",
                  border: "none",
                }}
              >
                <i class="bi bi-chevron-left" style={{ fontSize: "27px",fontWeight:"100rem" }}></i>
              </button>
              <div className="filterboxes1">
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
                          width: "170px",
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
              <div
                style={{
                  position: "relative",
                  top: "-130px",
                  right: "220px",
                  width: "1700px",
                }}
              >
                <div
                  style={{
                    overflowY: "auto",
                    maxHeight: "800px",
                  }}
                >
                   <h4 className="mb-4" style={{position:"relative",left:"300px",top:"30px" }}>
  Total Records: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color:"white",position:"relative",lef:"1500px" }}>{filteredStudents.flat().length}</span>
</h4>
                  <div
                    className="flex justify-right items-center gap-4 mt-4 "
                    style={{ position: "relative", left: "1250px",bottom:"20px",marginRight:"30px",width:"450px"}}
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
                      style={{marginLeft:"20px"}}
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
                    style={{
                      marginBottom: "20px",
                      textAlign: "center",
                      position: "relative",
                    }}
                    class="table table-striped  table-hover tabl"
                  >
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              selectedEmails.length === filteredStudents.length
                            }
                          />
                        </th>
                        <th scope="col">s.no</th>
                        <th scope="col">REGISTRATION NO</th>
                        <th scope="col">NAME</th>
                        <th scope="col">DEPARTMENT</th>
                        <th scope="col">BATCH(YEAR)</th>
                        <th scope="col">EMAIL</th>
                        <th scope="col">SSLC(%)</th>
                        <th scope="col">HSC(%)</th>
                        <th scope="col">Diploma(%)</th>
                        <th scope="col">Sem 1</th>
                        <th scope="col">Sem 2</th>
                        <th scope="col">Sem 3</th>
                        <th scope="col">Sem 4</th>
                        <th scope="col">Sem 5</th>
                        <th scope="col">Sem 6</th>
                        <th scope="col">Sem 7</th>
                        <th scope="col">Sem 8</th>
                        <th scope="col">CGPA</th>
                        <th scope="col">ARREARS</th>
                        <th scope="col">HOA</th>
                        <th scope="col">ADDITIONAL_LANGUAGES</th>
                        <th scope="col">INTERNSHIPS</th>
                        <th scope="col">CERTIFICATIONS</th>
                        <th scope="col">PATENTS/PUBLICATIONS</th>
                        <th scope="col">AWARDS/ACHIEVMENTS</th>
                        <th scope="col">AREA_OF_INTREST</th>
                        <th scope="col">PLACEMENT_INFO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedData.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedEmails.includes(item.EMAIL)}
                              onChange={() => handleSelect(item.EMAIL)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{item["REGISTRATION_NUMBER"]}</td>
                          <td>{item.NAME}</td>
                          <td>{item.DEPARTMENT}</td>
                          <td>{item.BATCH}</td>
                          <td>{item.EMAIL}</td>
                          <td>{item.SSLC}</td>
                          <td>{item.HSC}</td>
                          <td>{item.HSC}</td>
                          <td>{item.SEM1}</td>
                          <td>{item.SEM2}</td>
                          <td>{item.SEM3}</td>
                          <td>{item.SEM4}</td>
                          <td>{item.SEM5}</td>
                          <td>{item.SEM6}</td>
                          <td>{item.SEM7}</td>
                          <td>{item.SEM8}</td>
                          <td>{item.CPGA}</td>
                          <td>{item.ARREARS}</td>
                          <td>{item.HOA}</td>
                          <td>{item.LANGUAGE}</td>
                          <td>{item.INTERNSHIPS}</td>
                          <td>{item.CERTIFICATIONS}</td>
                          <td>{item.PATENTSPUBLICATIONS}</td>
                          <td>{item.ACHEIVEMENTS}</td>
                          <td>{item.AOI}</td>
                          <td>{item.PLACEMENT}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="norec">
                        <td>
                          {filteredStudents.length === 0 && (
                            <h5 style={{ color: "red" }}>
                              <img src="norec.png" alt="" />
                              No_records_found
                            </h5>
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  
                </div>
                <div
                  className="emailbox"
                  style={{ position: "relative", left: "220px", top: "30px" }}
                >
                  <textarea
                    placeholder="ENTER EMAIL CONTENT"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={4}
                    style={{
                      width: "80%",
                      marginBottom: "10px",
                      padding: "10px",
                    }}
                  />
                  <br/>
                  <input
                   
                    type="file"
                    name="attachment"
                    accept=".jpg,.png,.pdf,.docx" // Accept only certain file types
                    onChange={handleFileChange}
                  />
                  {emailContent.trim() && (
                    <button
                      class="btn"
                      onClick={sendEmails}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#DC3545",
                        color: "white",
                        border: "none",
                        position: "relative",
                        top: "5px",
                        marginRight: "10px",
                        borderRadius: "30px",
                      }}
                    >
                      SEND EMAIL
                    </button>
                  )}
                  <button
                    onClick={() => setIsOffcanvasOpen(false)}
                    class="btn"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#6C757D",
                      color: "white",
                      border: "none",
                      borderRadius: "30px",
                      marginTop: "10px",
                    }}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        {/* Plus Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white btn"
            style={{
              position: "fixed",
              bottom: "100px",
              right: "30px",
              borderRadius: "50%",
              backgroundColor: "rgb(8, 134, 207)",
            }}
          >
            +
          </button>
        )}

        {/* Form to enter company name and attach file */}
        {showForm && (
          <div
            className="mt-4 p-4 border rounded"
            style={{ position: "fixed", bottom: "100px", right: "200px" }}
          >
            <label className="block text-sm font-medium">Company Name:</label>
            <input
              type="text"
              className="border rounded p-2 w-full"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            /><br/>

            <label className="block text-sm font-medium mt-2">
              Attach JPEG Image:
            </label>
            <input
           
              type="file"
              accept="image/jpeg"
              className="mt-1"
              onChange={handleFileChange}
            />

            {selectedFile && (
              <p className="text-green-600 mt-1">
                Selected: {selectedFile.name}
              </p>
            )}

            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded mt-3"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Placementsannounce;
