import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAuth } from "../assets/context/authContext";
import Loading from "../assets/components/Loading"; 

function Studenttrainingscores() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []); 

  const fetchScores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/student/training-scores/${user._id}`);
      setScores(response.data.results || []);
    } catch (error) {
      console.error("Error fetching training scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRecords = scores.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = scores.slice(startIdx, startIdx + rowsPerPage);

  return (
    <>
      <div className="hea">
        <Link to="/Studentdashboard/Studenttraining" style={{ textDecoration: "none", color: "black" }}>
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
              Scores
            </h2>
          </div>
        </Link>
      </div>

      <div style={{ position: "relative", left: "250px" }}>
        <div className="mt-4">
          <h4
            className="mb-4"
            style={{
              position: "relative",
              top: "50px",
              left: "50px",
              width: "350px",
            }}
          >
            Total Score Records:{" "}
            <span
              style={{
                backgroundColor: "rgb(73, 73, 73)",
                padding: "2px 5px",
                borderRadius: "4px",
                color: "white",
              }}
            >
              {totalRecords}
            </span>
          </h4>

          <div
            className="flex justify-right items-center gap-4 mt-4"
            style={{
              position: "relative",
              left: "800px",
              bottom: "20px",
              width: "460px",
            }}
          >
            <label>
              No of records per page:
              <input
                type="number"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{ width: "50px", padding: "5px", marginLeft: "10px" }}
              />
            </label>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="btn"
              disabled={currentPage === 1}
            >
              ◀
            </button>

            <span className="text-lg">
              Page {totalPages > 0 ? currentPage : 0} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="btn"
              disabled={currentPage >= totalPages}
            >
              ▶
            </button>
          </div>

          <div
            style={{
              position: "relative",
              top: "20px",
              left: "-20px",
              overflowY: "auto",
              maxHeight: "800px",
            }}
          >
            {loading ? (
              <Loading /> 
            ) : totalRecords === 0 ? (
              <h4 style={{ textAlign: "center", color: "gray", marginTop: "20px" }}>Results are not published yet</h4>
            ) : (
              <table
                className="table table-striped table-hover"
                style={{
                  position: "relative",
                  left: "25px",
                  top: "20px",
                  marginBottom: "50px",
                  width: "100%",
                  minWidth: "750px",
                }}
              >
                <thead>
                  <tr>
                    <th>Registration Number</th>
                    <th>Batch</th>
                    <th>Qp code</th>
                    <th>Title</th>
                    <th>Score</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.map((score, index) => (
                    <tr key={index}>
                      <td>{score.registration_number}</td>
                      <td>{score.batch}</td>
                      <td>{score.qpcode}</td>
                      <td>{score.title}</td>
                      <td>
                        {score.score}/{score.totalscore}
                      </td>
                      <td>{score.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Studenttrainingscores;


