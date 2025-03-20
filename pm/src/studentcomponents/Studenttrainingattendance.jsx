import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../assets/context/authContext";
import Loading from "../assets/components/Loading";

function Studenttrainingattendance() {
    const { user } = useAuth();
    const [student, setStudent] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [dates, setDates] = useState([]);
    const [attendancePercentage, setAttendancePercentage] = useState("0%");
    const [department, setDepartment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/api/students/getone/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudent(response.data.student);
        } catch (error) {
            console.error("Error fetching student data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
      if (!student?.registration_number) return;
      try {
          setLoading(true);
          setError(null);
  
          const response = await axios.get(`http://localhost:3000/api/students/attendance`, {
              params: { registration_number: student.registration_number },
          });
  
          const data = response.data;
          if (!data || !data.attendanceRecords?.length) {
              setAttendanceData([]);
              return;
          }
  
          let extractedDates = new Set();
          let formattedData = {};
  
          data.attendanceRecords.forEach((record) => {
              record.batches.forEach((batch) => {
                  batch.dates.forEach((dateEntry) => {
                      extractedDates.add(dateEntry.date);
                      dateEntry.students.forEach((stu) => {
                          if (stu.registerNumber === student.registration_number) {
                              if (!formattedData[stu.registerNumber]) {
                                  formattedData[stu.registerNumber] = {
                                      registerNumber: stu.registerNumber,
                                      department: stu.department,
                                      scheduleCode: record.scheduleCode, // ✅ Fix: Now properly fetching scheduleCode
                                      trainingName: record.trainingName, // ✅ Fix: Fetching training name
                                      trainer: record.trainer, // ✅ Fix: Fetching trainer
                                      trainee: record.trainee, // ✅ Fix: Fetching trainee
                                      attendance: {},
                                  };
                              }
                              formattedData[stu.registerNumber].attendance[dateEntry.date] = stu.status;
                          }
                      });
                  });
              });
          });
  
          setDates([...extractedDates].sort());
          setAttendanceData(Object.values(formattedData));
          setAttendancePercentage(data?.attendancePercentage || "0%");
          setDepartment(data?.department || "N/A");
          setLoading(false);
      } catch (err) {
          setError("Failed to fetch attendance data");
      } finally {
          setLoading(false);
      }
  };
  

  useEffect(() => {
      if (user?._id) {
          fetchStudent();
      }
  }, [user]);

  useEffect(() => {
      if (student?.registration_number) {
          fetchAttendance();
      }
  }, [student?.registration_number]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleRowsPerPageChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (value > 0) {
        setRowsPerPage(value);
        setCurrentPage(1);
      }
    };
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(attendanceData.length / rowsPerPage);
  
    const startIdx = (currentPage - 1) * rowsPerPage;
    const displayedData = attendanceData.slice(
      startIdx,
      startIdx + rowsPerPage
    );
   

  return (<>

    <div className='hea'> <Link to="/Studentdashboard/Studentactualtraining" style={{
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
        <h2 style={{ position: "relative", top: '45px', left: "30px", fontFamily: 'poppins', fontSize: "35px", width: '100px' }}>Attendance</h2>
      </div>
    </Link>
    {loading ? (
                    <Loading />
                ) : (
    <div
    style={{
      position: "relative",
      bottom: "-50px",
      overflowY: "auto",
      maxHeight: "800px",
    }}
  >
     <h4 className="mb-4" style={{ position: "relative", top: "30px" }}>
                      Total Records: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{displayedData.flat().length}</span>
                    </h4>
    <div
      className="flex justify-right items-center gap-4 mt-4"
      style={{ position: "relative", left: "760px",  }}
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
   
    {loading && <Loading/>}
            {error && <p className="text-danger">{error}</p>}

            {displayedData.length > 0 ? (
                <table className="table table-striped  table-hover mt-3" style={{position:"relative",bottom:'0px',left:'0px'}}>
                    <thead className="">
                        <tr>
                        <th>Schedule Code</th>
            <th>Training Name</th>
            <th>Trainee</th>
            <th>Register Number</th>
            <th>Department</th>
            {dates.map((date, index) => (
                <th key={index}>{date}</th>
            ))}
            <th>Attendance %</th>
                        </tr>
                    </thead>
                    <tbody>
                    {displayedData.map((stu, index) => (
                                    <tr key={index}>
                                         <td>{stu.scheduleCode || "N/A"}</td>
                <td>{stu.trainingName || "N/A"}</td> {/* ✅ Display Training Name */}
                <td>{stu.trainee || "N/A"}</td> {/* ✅ Display Trainee */}
                <td>{stu.registerNumber}</td>
                <td>{stu.department}</td>
                {dates.map((date, idx) => (
                    <td key={idx} className={stu.attendance[date] === "P" ||stu.attendance[date] === "OD" ? "text-success" : "text-danger"}>
                        {stu.attendance[date] || "-"}
                    </td>
                ))}
                <td>{attendancePercentage}</td>
                                    </tr>
                                ))}
                        
                    </tbody>
                </table>
            ) : (
                <p className="text-center">No attendance records found.</p>
            )}
            </div>
                )}
            </div>
    
    
    
  </>)
}
export default Studenttrainingattendance;