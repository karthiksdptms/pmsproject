import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { SlCalender } from "react-icons/sl";
import { LiaAddressCard } from "react-icons/lia";
import * as XLSX from "xlsx";
import { FaUserCircle } from "react-icons/fa";
import Topbar from "./Topbar";
import { MdOutlinePending } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

import Loading from "./Loading";


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
const placementOptions = ["Placed","Not-placed"];
const offertypeOptions = ["Elite","Dream","Superdream","Fair"];


function Dashboard() {
  const [hoverVisible, setHoverVisible] = useState(false);
  const [hoverVisiblee, setHoverVisiblee] = useState(false);
  const [hoverVisibleee, setHoverVisibleee] = useState(false);


  const [age, setAge] = React.useState("");
  const downloadExcel = () => {
    const table = document.getElementById("my-table");

    const worksheet = XLSX.utils.table_to_sheet(table);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "Student Details rit.xlsx");
  };


  const [filters, setFilters] = useState({
    department: [],
    batch: [],
    cgpa: "",
    arrears: "",
    historyOfArrears: "",
    placement: "",
    offertype: "",
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
  };const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    setLoading(true); 
    axios
      .get("http://localhost:3000/api/students/getstudents")
      .then((response) => {
        console.log("Fetched Students:", response.data);
        setStudents(response.data.students || []);
      })
      .catch((error) => console.error("Error fetching students:", error))
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  const filteredStudents = students.filter((student) => {
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
      (filters.placement === "" ||
        student.placement?.toString() === filters.placement) &&
      (filters.offertype === "" ||
        (Array.isArray(student.offers) &&
          student.offers.some(
            (offer) =>
              offer.offertype?.toString().toLowerCase() ===
              filters.offertype.toLowerCase()
          ))) &&
      (filters.aoi.length === 0 ||
        filters.aoi.includes(student.aoi) ||
        (showOtherAoi && student.aoi?.includes(filters.otherAoi))) &&
      (filters.language === "" ||
        (student.language &&
          student.language.toLowerCase().includes(filters.language.toLowerCase())))
    );
  });
  
  


  const [showDiv, setShowDiv] = useState(false);

  const handleButtonClick = () => {
    setShowDiv((prevState) => !prevState);
    setShowDivi(false);
    setShowDivii(false);
  };

  const closeDiv = () => {
    setShowDiv(false);
  };
  const [showDivi, setShowDivi] = useState(false);

  const handleButtonnClick = () => {
    setShowDivi((prevState) => !prevState);
    setShowDiv(false);
    setShowDivii(false);
  };
  const closeDivi = () => {
    setShowDivi(false);
  };
  const [showDivii, setShowDivii] = useState(false);
  const handleButtonnnClick = () => {
    setShowDivii((prevState) => !prevState);
    setShowDiv(false);
    setShowDivi(false);
  };
  const closeDivii = () => {
    setShowDivii(false);
  };
  function closeDivs() {
    setShowDiv(false);
    setShowDivi(false);
    setShowDivii(false);
  }
  const [selectedData, setSelectedData] = useState([]);

  const handleClick = (data) => {
    setSelectedData(data);
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
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = filteredStudents.slice(
    startIdx,
    startIdx + rowsPerPage
  );
 

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

const profileImageUrl = selectedData.profileImage
  ? `http://localhost:3000/${selectedData.profileImage}`
  : null;


  return (
    <>
      <div className="">
        <div className="clr"></div>
        <div className="  contain" >


          <div className="">
            <div
              className="heading"
              style={{
                position: "relative",
                top: "20px",
                left: "250px",
                width: "100px",
              }}
            >
              <Link to="/Maindashboard">
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    marginLeft: "20px",
                    border: "none",
                    position: "relative",
                    top: "75px",
                    right: "40px",
                    fontSize: "35px",
                    color: "black",
                    backgroundColor: "transparent",
                  }}
                >
                  <IoIosArrowBack />
                </button>
              </Link>
              <h2
                style={{
                  position: "relative",
                  top: "25px",
                  left: "30px",
                  width: "100px",
                  fontFamily: "poppins",
                  fontSize: "35px",
                }}
              >
                Filter's
              </h2>
            </div>
            <div className="man">
              <div className="filterboxes">
                <div>
                  <div className="lable1">
                    <div>
                      <label style={{ fontSize: "23px" }}>Department:</label>
                      <div >
                        <div

                          onMouseEnter={() => setHoverVisible(true)}
                          onMouseLeave={() => setHoverVisible(false)}
                        >
                          <div className="par">
                            <div style={{ border: "gray 1px solid", padding: "9px", width: "200px", color: "grey" }}> <label style={{ fontSize: "15.5px" }}>
                              Select Department:
                            </label></div>
                          </div>
                          {hoverVisible && (
                            <div className="absolute top-full mt-2 w-48 p-4 bg-gray-100 shadow-md rounded-lg" style={{
                              border: " 1px solid rgb(184, 180, 180)", width: "170px", position: "relative"
                              , bottom: "2px", boxShadow: "0 0 5px rgb(177, 177, 177)"
                            }}>
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
      onChange={(e) => handleCheckboxChange(e, "department")}
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
                    <div >

                      <div
                        className="relative w-40 h-40 bg-blue-300 rounded-lg flex items-center justify-center cursor-pointer"
                        onMouseEnter={() => setHoverVisiblee(true)}
                        onMouseLeave={() => setHoverVisiblee(false)}
                      >
                        <div style={{ border: "gray 1px solid", padding: "9px", width: "200px", color: "grey" }}> <label style={{ fontSize: "15.5px" }}>
                          Select Batch:
                        </label></div>
                        <br />
                        {hoverVisiblee && (
                          <div className="absolute top-full mt-2 w-48 p-4 bg-gray-100 shadow-md rounded-lg" style={{
                            border: " rgb(184, 180, 180) 1px solid", width: "180px", position: "relative"
                            , bottom: "26px", boxShadow: "0 0 5px rgb(177, 177, 177)"
                          }}>
                            <label>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={filters.batch.length === 0}
                                onChange={(e) =>
                                  handleAllCheckboxChange(e, "batch")
                                }
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

                           
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lable1">
  <div>
    <label htmlFor="cgpaSelect" style={{ fontSize: "23px" }}>CGPA:</label><br />
    <select
      id="cgpaSelect"
      name="cgpa"
      onChange={(e) => handleSelectChange(e, "cgpa")}
      style={{
        marginBottom: "10px",
        padding: "8px",
        width: "100%",
        maxWidth: "300px",
      }}
    >
      <option value="" disabled selected>
        Select CGPA:
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
    <label htmlFor="arrearsSelect" style={{ fontSize: "23px" }}>
      Arrears:
    </label>
    <br />
    <select
      id="arrearsSelect"
      name="arrears"
      onChange={(e) => handleSelectChange(e, "arrears")}
      style={{
        marginBottom: "10px",
        padding: "8px",
        width: "100%",
        maxWidth: "300px",
      }}
    >
      <option value="" disabled selected>
        Select Arrears:
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
    <label htmlFor="hoaSelect" style={{ fontSize: "23px" }}>
      History of Arrears:
    </label>
    <select
      id="hoaSelect"
      name="historyOfArrears"
      onChange={(e) => handleSelectChange(e, "historyOfArrears")}
      style={{
        marginBottom: "10px",
        padding: "8px",
        width: "210px",
        maxWidth: "300px",
      }}
    >
      <option value="" disabled selected>
        Select HOA:
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

                <div
                  className="lable1"
                  style={{ left: "550px", bottom: "575px" }}
                >
                  <div>
                    <label style={{ fontSize: "23px" }}>Area Of Intrest:</label>
                    <div >
                      <div
                        className="relative w-40 h-40 bg-blue-300 rounded-lg flex items-center justify-center cursor-pointer"
                        onMouseEnter={() => setHoverVisibleee(true)}
                        onMouseLeave={() => setHoverVisibleee(false)}
                      ><div style={{ border: "gray 1px solid", padding: "9px", width: "200px", color: "grey" }}> <label style={{ fontSize: "15.5px" }}>
                        Select Area of Interest:
                      </label></div>
                        <br />
                        {hoverVisibleee && (
                          <div className="absolute top-full mt-2 w-48 p-4 bg-gray-100 shadow-md rounded-lg" style={{
                            border: " rgb(184, 180, 180) 1px solid", width: "270px", position: "relative"
                            , bottom: "26px", boxShadow: "0 0 5px rgb(177, 177, 177)"
                          }}>
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
                <div className="lable1" style={{ position: "relative", left: "0px", bottom: "-0.25px" }}>
  <div>
    <label htmlFor="languageInput" style={{ fontSize: "23px" }}>Languages:</label>
    <input
      id="languageInput"
      type="text"
      name="language"
      placeholder="Enter Language"
      onChange={(e) => handleInputChange(e, "language")}
      style={{
        marginBottom: "10px",
        padding: "8px",
        width: "100%",
        maxWidth: "300px",
        border: "1px solid #ccc",
        borderRadius: "5px"
      }}
    />
  </div>
</div><div className="lable1">
  <div>
    <label htmlFor="placementSelect" style={{ fontSize: "23px" }}>
      Placement_Details:
    </label>
    <select
      id="placementSelect"
      name="placement"
      onChange={(e) => handleSelectChange(e, "placement")}
      style={{
        marginBottom: "10px",
        padding: "8px",
        width: "210px",
        maxWidth: "300px",
      }}
    >
      <option value="" disabled selected>
        Select :
      </option>
      <option value="">ANY</option>
      {placementOptions.map((hoa) => (
        <option key={hoa} value={hoa}>
          {hoa}
        </option>
      ))}
    </select>
  </div>
 

</div>
<div style={{position:'relative',left:'45px'}}>
    <label htmlFor="offertypeSelect" style={{ fontSize: "23px" }}>
    Select offertype:
    </label>
    <br />
    <select
      id="offertypeSelect"
      name="offertype"
      onChange={(e) => handleSelectChange(e, "offertype")}
      style={{
        marginBottom: "10px",
        padding: "8px",
        width: "210px",
        maxWidth: "300px",
      }}
    >
      <option value="" disabled selected>
        Select :
      </option>
      <option value="">ANY</option>
      {offertypeOptions.map((hoa) => (
        <option key={hoa} value={hoa}>
          {hoa}
        </option>
      ))}
    </select>
  </div>

              </div>
              <div
                className="filinner"
                style={{
                  position: "relative",
                  bottom: "110px",
                  right: "5px",
                  width: "1250px",
                }}
              >
                <div className="filandtable">
                  <button
                    onClick={downloadExcel}
                    type="button"
                    className=" "
                   
                    style={{
                      color: "white",
                      border: "none",
                      margin: "20px",
                      width: "120px",
                      height: "40px",

                      position: "relative",
                      left: "1080px",
                      borderRadius: "30px",
                      bottom: "50px",
                      backgroundColor: "green"
                    }}
                  >
                    {" "}
                    <i
                      className="bi bi-file-earmark-excel"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Excel
                    <i className="bi bi-download" style={{ marginLeft: "5PX" }}></i>
                  </button>

                  <div>
                    <h4 className="mb-4">
                      Total Records: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{filteredStudents.flat().length}</span>
                    </h4>
                    {loading ? (
  <div >
    
  <Loading/>
  </div>
) : (
  <div
    style={{
      position: "relative",
      bottom: "60px",
      overflowY: "auto",
      maxHeight: "800px",
    }}
  >
    <div
      className="flex justify-right items-center gap-4 mt-4"
      style={{ position: "relative", left: "800px", bottom: "20px" }}
    >
      <label htmlFor="rowsPerPage">No of records per page:</label>
      <input
        type="number"
        id="rowsPerPage"
        name="rowsPerPage"
        value={rowsPerPage}
        onChange={handleRowsPerPageChange}
        style={{ width: "50px", padding: "5px", marginRight: "20px" }}
      />

      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className="btn"
        disabled={currentPage === 1}
      >
        <i className="bi bi-chevron-double-left"></i>
      </button>

      <span className="text-lg">Page {currentPage} of {totalPages}</span>

      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        className="btn"
        disabled={currentPage === totalPages}
      >
        <i className="bi bi-chevron-double-right arr"></i>
      </button>
    </div>

    <div>
      <table
        border="1"
        className="table table-striped table-hover tabl"
        id="my-table"
        style={{
          position: "relative",
          left: "0px",
          bottom: "0px",
          minWidth: "3500px",
        }}
      >
        <thead>
          <tr>
            <th scope="col">s.no</th>
            <th scope="col">REGISTRATION_NO</th>
            <th scope="col">NAME</th>
            <th scope="col">DEPARTMENT</th>
            <th scope="col">BATCH(YEAR)</th>
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
            <th scope="col">HISTORY_OF_ARREARS</th>
            <th scope="col">ADDITIONAL_LANGUAGES</th>
            <th scope="col">INTERNSHIPS</th>
            <th scope="col">CERTIFICATIONS</th>
            <th scope="col">PATENTS/PUBLICATIONS</th>
            <th scope="col">AWARDS/ACHIEVMENTS</th>
            <th scope="col">AREA_OF_INTEREST</th>
            <th scope="col">PLACEMENT_INFO</th>
            <th scope="col">OFFERS</th>

            <th>INFO</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((item, index) => (
            <tr key={item.registration_number}>
              <td>{index + 1}</td>
              <td>{item.registration_number}</td>
              <td>{item.name}</td>
              <td>{item.department}</td>
              <td>{item.batch}</td>
              <td>{item.sslc}</td>
              <td>{item.hsc}</td>
              <td>{item.diploma}</td>
              <td>{item.sem1}</td>
              <td>{item.sem2}</td>
              <td>{item.sem3}</td>
              <td>{item.sem4}</td>
              <td>{item.sem5}</td>
              <td>{item.sem6}</td>
              <td>{item.sem7}</td>
              <td>{item.sem8}</td>
              <td>{item.cgpa}</td>
              <td>{item.arrears}</td>
              <td>{item.hoa}</td>
              <td>{item.language}</td>
              <td>{item.internships}</td>
              <td>{item.certifications}</td>
              <td>{item.patentspublications}</td>
              <td>{item.achievements}</td>
              <td>{item.aoi}</td>
              <td>{item.placement}</td>
              <td>
      {item.offers?.length > 0 ? (
        item.offers.map((offer, idx) => (
          <span
            
          >
            <i
              className="bi bi-bookmark-check-fill"
              style={{
                color:
                  offer.offertype === "Elite"
                    ? "#00bfff"
                    : offer.offertype === "Superdream"
                    ?  "rgb(255, 215, 0)"
                    : offer.offertype === "Dream"
                    ? "#BCC6CC" 
                    : offer.offertype === "Fair"
                    ? "rgb(205, 127, 50)"
                    : "#d3d3d3", 
                marginRight: "5px",
              }}
            ></i>
            {offer.offertype}
          </span>
        ))
      ) : (
        <span style={{ color: "red" }}>No Offers</span>
      )}
    </td>

              <td>
                <button
                  style={{
                    border: "none",
                    width: "50px",
                    fontSize: "20px",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                  }}
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                  onClick={() => handleClick(item)}
                >
                  <i className="bi bi-info-circle"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="norec">
            <td>
              {filteredStudents.length === 0 && (
                <h5 style={{ color: "red" }}>
                  <img src="/norec.png" alt="" />
                  No records found
                </h5>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
)}


                    {selectedData && (
                      <div
                        className="offcanvas offcanvas-end"


                        tabIndex="-1"

                        id="offcanvasRight"
                        aria-labelledby="offcanvasRightLabel"
                        data-bs-backdrop="static"
                        style={{ width: "700px", marginLeft: "1000px" }}
                      >
                        <div
                          className="offcanvas-header"
                          style={{
                            width: "100%",
                            height: "230px",
                            borderBottom: "0.25px solid rgb(194, 190, 190)",
                            backgroundColor: "rgb(245, 245, 245)",
                          }}
                        >
                          <h5 className="offcanvas-title" id="offcanvasRightLabel">
                          {profileImageUrl ? (
  <img
    src={profileImageUrl}
    alt="Profile"
    style={{
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      objectFit: "cover",
      position: "relative",
      top: "15px",
    }}
  />
) : (
  <FaUserCircle
    style={{
      width: "200px",
      height: "200px",
      color: "rgb(205, 205, 205)",
      position: "relative",
      top: "15px",
    }}
  />
)}

                            <p
                              style={{
                                position: "relative",
                                bottom: "100px",
                                left: "240px",
                                fontSize:'25px'
                              }}
                            >
                              {selectedData.name}
                            </p>
                          </h5>
                          <h5
                            style={{
                              position: "relative",
                              top: "40px",
                              right: "-40px",
                            }}
                          >
                            {selectedData.registration_number}
                          </h5>
                          <div
                            className="ribbon1"
                            style={{
                              width: "400px",
                              position: "relative",
                              bottom: "70px",
                              right: "60px",
                              padding: "0px",
                              color: " rgba(57,102,172,255)",
                            }}
                          >
                            <h3 style={{ width: "250px" }}>STUDENT PROFILE </h3>
                          </div>
                          <div
                            className="btn-group"
                            role="group"
                            style={{
                              position: "relative",
                              top: "70px",
                              left: "-50px",
                            }}
                            aria-label="Basic radio toggle button group"
                          >
                            <input
                              type="radio"
                              className="btn-check"
                              name="btnradio"
                              id="btnradio1"
                              autoComplete="off"
                            />
                            <label
                              style={{
                                backgroundColor: " rgba(57,102,172,255)",
                                color: "white",
                              }}
                              className="btn btn-outline-primary"
                              onClick={closeDivs}
                              htmlFor="btnradio1" 
                            >
                              {" "}
                              1
                            </label>

                            <input
                              type="radio"
                              className="btn-check bnt"
                              name="btnradio"
                              id="btnradio2"
                              autoComplete="off"
                            />
                            <label
                              style={{
                                backgroundColor: " rgba(57,102,172,255)",
                                color: "white",
                              }}
                              className="btn btn-outline-primary"
                              onClick={handleButtonClick}
                              htmlFor="btnradio2" 
                            >
                              {" "}
                              2
                            </label>

                            <input
                              type="radio"
                              className="btn-check bnt"
                              name="btnradio"
                              id="btnradio3"
                              autoComplete="off"
                            />
                            <label
                              style={{
                                backgroundColor: " rgba(57,102,172,255)",
                                color: "white",
                              }}
                              className="btn btn-outline-primary"
                              onClick={handleButtonnClick}
                              htmlFor="btnradio3" 
                            >
                              {" "}
                              3
                            </label>
                            <input
                              type="radio"
                              className="btn-check bnt"
                              name="btnradio"
                              id="btnradio4"
                              autoComplete="off"
                            />
                            <label
                              style={{
                                backgroundColor: " rgba(57,102,172,255)",
                                color: "white",
                              }}
                              className="btn btn-outline-primary"
                              onClick={handleButtonnnClick}
                              htmlFor="btnradio4" 
                            >
                              {" "}
                              4
                            </label>
                          </div>

                          <button
                            type="button"
                            className=""
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            style={{
                              backgroundColor: "transparent",
                              position: "relative",
                              bottom: "85px",
                              right: "720px",
                              border: "none",
                              fontSize: "30px",
                            }}
                          >
                            <IoIosArrowBack />
                          </button>
                        </div>
                        <div className="offcanvas-body offcanvasbody">
                          <div id="canvasbody">
                            <div style={{ position: "relative", left: "40px" }}>
                              <ul
                                className="nav"
                                style={{
                                  gap: "70px",
                                  fontSize: "20px",
                                  margin: "15px",
                                }}
                              >
                                <li
                                  className="nav-item"
                                  style={{
                                    borderBottom: "2px solid rgb(3, 44, 190)",
                                  }}
                                >
                                  <button
                                    style={{
                                      border: "none",
                                      backgroundColor: "#ecf0f9",
                                    }}
                                    onClick={closeDivs}
                                  >
                                    <a
                                     
                                      href="#"
                                      className="acolor"
                                    >
                                      Details
                                    </a>
                                  </button>
                                </li>
                                <li
                                  className="nav-item"
                                  style={{
                                    borderBottom: "2px solid rgb(3, 44, 190)",
                                  }}
                                >
                                  <button
                                    style={{
                                      border: "none",
                                      backgroundColor: "#ecf0f9",
                                    }}
                                    onClick={handleButtonClick}
                                  >
                                    <a
                                     
                                      href="#"
                                      className="acolor"
                                    >
                                      Projects
                                    </a>
                                  </button>
                                </li>
                                <li
                                  className="nav-item"
                                  style={{
                                    borderBottom: "2px solid rgb(3, 44, 190)",
                                  }}
                                >
                                  <button
                                    style={{
                                      border: "none",
                                      backgroundColor: "#ecf0f9",
                                    }}
                                    onClick={handleButtonnClick}
                                  >
                                    <a
                                   
                                      href="#"
                                      className="acolor"
                                    >
                                      Internships
                                    </a>
                                  </button>
                                </li>
                                <li
                                  className="nav-item"
                                  style={{
                                    borderBottom: "2px solid rgb(3, 44, 190)",
                                  }}
                                >
                                  <button
                                    style={{
                                      border: "none",
                                      backgroundColor: "#ecf0f9",
                                    }}
                                    onClick={handleButtonnnClick}
                                  >
                                    <a
                                    
                                      href="#"
                                      className="acolor"
                                    >
                                      Placement
                                    </a>
                                  </button>
                                </li>
                              </ul>
                            </div>

                            <div className="detailbody">
                              <h5
                                style={{
                                  backgroundColor: "#f5f5f5",
                                  margin: "20px",
                                  position: "relative",
                                  top: "10px",
                                }}
                              >
                                Basic Details
                              </h5>
                              <button className="btn resume bnt">
                                <a
                                  href={selectedData.resume}
                                  download="resume.pdf"
                                  style={{
                                    zIndex: "10",
                                    textDecoration: "none",
                                    color: "BLACK",
                                    backgroundColor: "(",
                                    padding: "10px 20px",
                                    borderRadius: "15px",
                                    fontSize: "14px",
                                  }}
                                >
                                  RESUME :{" "}
                                  <i
                                    className="bi bi-download resdow"
                                    style={{
                                      position: "relative",
                                      right: "-5PX",
                                      borderRadius: "35%",
                                    }}
                                  ></i>
                                </a>
                              </button>
                              <div className="basicbody">
                                <div className="bdemail bdbase mar">
                                  <p>
                                    <i
                                      className="bi bi-envelope-at"
                                      style={{ marginRight: "10px" }}
                                    ></i>
                                    Email
                                  </p>
                                  <h5 className="ul"> {selectedData.email}</h5>
                                </div>
                                <div className="bdyear bdbase mar">
                                  <p>
                                    <SlCalender
                                      style={{ marginRight: "10px" }}
                                    />
                                    BATCH
                                  </p>
                                  <h6 className="hsty ul ulll">
                                    {selectedData.batch}
                                  </h6>
                                </div>
                                <div className="bdcgpa bdbase mar">
                                  <p>
                                    <i
                                      className="bi bi-bookmark-check"
                                      style={{ marginRight: "10px" }}
                                    ></i>
                                    CGPA
                                  </p>
                                  <h5 className="hsty ul ">
                                    {selectedData.cgpa}
                                  </h5>
                                </div>
                                <div className="bdph bdbase mar">
                                  <p>
                                    <i
                                      className="bi bi-telephone"
                                      style={{ marginRight: "10px" }}
                                    ></i>
                                    Phone
                                  </p>
                                  <h5 className="ul">
                                    {" "}
                                    {selectedData.phoneno}
                                  </h5>
                                </div>
                                <div className="bddept bdbase mar">
                                  <p>
                                    <i
                                      className="bi bi-building-down"
                                      style={{ marginRight: "10px" }}
                                    ></i>
                                    Department
                                  </p>
                                  <h5 className="hsty ul">
                                    {selectedData.department}
                                  </h5>
                                </div>
                                <div className="bdarrear bdbase mar">
                                  <p>
                                    <i
                                      className="bi bi-bookmark-dash"
                                      style={{ marginRight: "10px" }}
                                    ></i>
                                    Arrear
                                  </p>
                                  <h5 className="hsty ul">
                                    {selectedData.arrears}
                                  </h5>
                                </div>
                                <div className="bdaddress bdbase mar">
                                  <p>
                                    <LiaAddressCard
                                      style={{ marginRight: "10px" }}
                                    />
                                    Address
                                  </p>
                                  <h5 className="ul">
                                    {" "}
                                    {selectedData.address}
                                  </h5>
                                </div>
                              </div>
                            </div>

                            {showDiv && (
                              <div className="projectdata">
                                <div
                                  className="projectitle"
                                  style={{
                                    position: "relative",
                                  }}
                                >
                                  <button
                                    className="btn  btn-sm"
                                    onClick={closeDiv}
                                    style={{
                                      position: "relative",
                                      left: "590px",
                                      bottom: "5px",
                                      fontSize: "20px",
                                    }}
                                  >
                                    X
                                  </button>
                                </div>
                                <div className="mainprojcard">
                                  <div className="leftproj1">
                                    <div className="projhead">
                                      <div className="achi">Achievements</div>
                                      <ul style={{ marginTop: "40px" }}>
                                        <li className="ul">
                                          <h5 style={{ margin: "10px" }}>
                                            {selectedData.achievements}
                                          </h5>{" "}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="rightproj2">
                                    <div className="projhead">
                                      <div className="achi">Projects</div>
                                      <ul style={{ marginTop: "40px" }}>
                                        <li className="ul">
                                          <h5 style={{ margin: "10px" }}>
                                            {selectedData.certifications}
                                          </h5>{" "}
                                        </li>
                                      </ul>
                                    </div>
                                    <div
                                      style={{
                                        position: "relative",
                                        top: "150px",
                                      }}
                                    >
                                      <h6 className="hpatent">Patents:</h6>

                                      <div>
                                        <ul>
                                          <li>
                                            <h5 className="ul">
                                              {selectedData.patentspublications}
                                            </h5>{" "}
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {showDivi && (
                              <div className="projectdata">
                                <div
                                  className="projectitle"
                                  style={{
                                    backgroundColor: "#f5f5f5",
                                    height: "46px",
                                    position: "relative",
                                  }}
                                >
                                  <h5
                                    style={{
                                      position: "relative",
                                      top: "10px",
                                      left: "15px",
                                    }}
                                  >
                                    Internships
                                  </h5>
                                  <button
                                    className="btn  btn-sm"
                                    onClick={closeDivi}
                                    style={{
                                      position: "relative",
                                      left: "590px",
                                      bottom: "37px",
                                      fontSize: "20px",
                                    }}
                                  >
                                    X
                                  </button>
                                </div>
                                <h6 style={{ margin: "20px" }}>
                                  {" "}
                                  <MdOutlinePending
                                    style={{ marginRight: "5px" }}
                                  />
                                  Status:
                                </h6>
                                <ul style={{ marginTop: "40px" }}>
                                  <li className="ul">
                                    <h5 style={{ marginTop: "30px" }}>
                                      {selectedData.internships}
                                    </h5>{" "}
                                  </li>
                                </ul>
                              </div>
                            )}
                            {showDivii && selectedData && (
                              <div
                                className="projectdata p-3"
                                style={{
                                  backgroundColor: "#f9f9f9",
                                  borderRadius: "10px",
                                  overflowY: "auto",
                                  maxHeight: "80vh",
                                  transition: "max-height 0.3s ease-in-out",
                                }}
                              >

                                <div
                                  className="projectitle d-flex justify-content-between align-items-center p-2"
                                  style={{ backgroundColor: "#f5f5f5", borderRadius: "8px", width: "101%", position: "relative", bottom: "20px", right: "10px" }}
                                >
                                  <h5 className="m-0">Placement Details</h5>
                                  <button className="btn btn-sm " onClick={closeDivii}>
                                    X
                                  </button>
                                </div>
                                <br />

                                <div style={{ position: "relative", bottom: "30px" }}>
                                  <h5 className="mx-3">Placement Status: {selectedData.placement}</h5>


                                  {selectedData?.offers?.length > 0 ? (
  <div className="row mx-2 d-flex justify-content-center">
    {selectedData.offers.map((offer, index) => (
      <div key={index} className="col-lg-4 col-md-6 mb-3">
        <div className="offer-details card p-2 border rounded shadow-sm">
          <h5
            className="card-title p-1"
            style={{
              backgroundColor: "rgb(218, 216, 216)",
              width: "112.5%",
              position: "relative",
              bottom: "8px",
              right: "10px",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            Offer {offer.offerno || index + 1}
          </h5>
          <h6>
            <strong>Company:</strong> {offer.company || "N/A"}
          </h6>
          <p>
            <strong>Designation:</strong> {offer.designation || "N/A"}
          </p>
          <p>
            <strong>Package:</strong> {offer.package || "N/A"}
          </p>
          <p>
            <strong>offertype:</strong> {offer.offertype || "N/A"}
          </p>
          
        </div>
        
      </div>
    ))}
  </div>
) : (
  <p className="mx-3">No offers available.</p>
)}
{selectedData.offerpdf ? (
            <a
              href={`http://localhost:3000/${selectedData.offerpdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              📄 Offer Letters
            </a>
          ) : (
            <p className="text-muted">No offer letter available.</p>
          )}

                                </div>
                              </div>
                            )}



                          </div>
                        </div>
                      </div>
                    )}
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

export default Dashboard;
