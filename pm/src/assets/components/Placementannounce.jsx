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
  const [students, setstudents] = useState([])
  useEffect(() => {
    axios.get("http://localhost:3000/getstudents")
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
      existingContentLines[venueLineIndex] = `Venue: ${venue || "Not Specified"
        }`;
    } else if (venue) {
      existingContentLines.push("Venue: ${venue}");
    }


    const generalReqLineIndex = existingContentLines.findIndex((line) =>
      line.startsWith("General Requirements:")
    );
    if (generalReqLineIndex !== -1) {
      existingContentLines[generalReqLineIndex] = `General Requirements: ${generalReq || "Not Specified"
        }`;
    } else if (generalReq) {
      existingContentLines.push("General Requirements: ${generalReq}");
    }

    const skillsetReqLineIndex = existingContentLines.findIndex((line) =>
      line.startsWith("Skillset Requirements:")
    );
    if (skillsetReqLineIndex !== -1) {
      existingContentLines[skillsetReqLineIndex] = `Skillset Requirements: ${skillsetReq || "Not Specified"
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

      </div>

      <div className="trcontainer">
        <Link to="/Maindashboard">
          <div>
            <button
              type="button"
              className="btn btn-secondary"
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
        </div>
    </>
  );
}

export default Placementsannounce;