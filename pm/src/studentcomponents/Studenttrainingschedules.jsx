
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../assets/context/authContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Loading from "../assets/components/Loading";
function Studenttrainingschedules() {

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [student, setStudent] = useState({
    registration_number: "",
    name: "",
    department: "",
    batch: "",
    sslc: "",
    hsc: "",
    diploma: "",
    sem1: "",
    sem2: "",
    sem3: "",
    sem4: "",
    sem5: "",
    sem6: "",
    sem7: "",
    sem8: "",
    cgpa: "",
    arrears: "",
    internships: "",
    certifications: "",
    patentspublications: "",
    achievements: "",
    hoa: "",
    language: "",
    aoi: "",
    email: "",
    address: "",
    phoneno: "",

    resume: null,
    image: null,
    offerpdf: null,
    placement: "",
    offers: [],
    expassword: "",
  });
  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/students/getone/${user._id}`, {
        headers: {
          Authorization: `Bearer ${ token }`,
        },
      });
      setStudent(response.data.student);
      console.log(student.registration_number)
    } catch (error) {
      console.error("Error fetching student data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchStudent();
    }
  }, [user]);


  const registration_number = student.registration_number;

  useEffect(() => {
    setLoading(true)
    if (registration_number) {
      console.log("Fetching schedules for:", registration_number);

      axios.get(`${API_BASE_URL}/api/students/schedules?registration_number=${registration_number}`)
        .then((response) => {
          setSchedules((response.data).reverse());
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching schedules:", error);
        });
    }
  }, [registration_number]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(schedules.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = schedules.slice(
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
        <h2 style={{ position: "relative", top: '45px', left: "30px", fontFamily: 'poppins', fontSize: "35px", width: '100px' }}>Schedules</h2>
      </div>
    </Link>
      {loading ? (
        <Loading />
      ) : (
        <div
          style={{
            position: "relative",
            bottom: "60px",
            overflowY: "auto",
            maxHeight: "800px",

            top: '50px'
          }}
        >
          <h4 className="mb-4" style={{ position: "relative", top: "30px" }}>
            Total Records:{" "}
            <span
              style={{
                backgroundColor: "rgb(73, 73, 73)",
                padding: "2px 5px",
                borderRadius: "4px",
                color: "white",
              }}
            >
              {schedules.reduce((total, schedule) => total + schedule.batches.length, 0)}
            </span>
          </h4>

          <div
            className="flex justify-right items-center gap-4 mt-4"
            style={{ position: "relative", left: "750px", bottom: "20px" }}
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

          <table className="table table-striped  table-hover " style={{ position: 'relative', left: '0px' }}>
            <thead className="">
              <tr>
                <th>Schedule Code</th>
                <th>Training Name</th>
                <th>Type</th>
                <th>Trainee</th>
                <th>Batch</th>
                <th>Duration</th>
                <th>Department</th>
                <th>Participated</th>
                <th>Batch Number</th>
                <th>From Date</th>
                <th>To Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.length > 0 ? (
                displayedData.map((schedule, index) => (
                  schedule.batches.map((batch, batchIndex) => (
                    <tr key={`${index}-${batchIndex}`}>
                      <td>{schedule.scheduleCode}</td>
                      <td>{schedule.trainingName}</td>
                      <td>{schedule.type}</td>
                      <td>{schedule.trainee}</td>
                      <td>{schedule.batch}</td>
                      <td>{schedule.duration}</td>
                      <td>{schedule.department}</td>
                      <td>{schedule.participated}</td>
                      <td>{batch.batchNumber}</td>
                      <td>{batch.fromdate}</td>
                      <td>{batch.todate}</td>
                    </tr>
                  ))
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">No schedules found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>



  </>)
}
export default Studenttrainingschedules;