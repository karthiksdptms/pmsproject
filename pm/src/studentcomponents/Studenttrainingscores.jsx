import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAuth } from "../assets/context/authContext";
import Loading from "../assets/components/Loading";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
      const response = await axios.get(`${API_BASE_URL}/api/students/training-scores/${user._id}`);
      setScores((response.data.results || []).reverse());
      setLoading(false);
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


  const [selectedAnswerPaper, setSelectedAnswerPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAnswerPaper = async (registration_number, qpcode) => {
    try {

      const response = await axios.get(`${API_BASE_URL}/api/students/view-answer-paper`, {
        params: { registration_number, qpcode },
      });


    if (!response.data || !response.data.answers) {
      console.error("Error: No answers found in the response.");
      alert("No answers available."); n
      return;
    }

    setSelectedAnswerPaper(response.data);
    setIsModalOpen(true);
  } catch (error) {
    console.error("Error fetching answer paper:", error);
    alert(error.response?.data?.message || "Could not fetch answer paper.");
  }
};


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
    {loading ? (
      <Loading />
    ) : (
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
                    <th>View Answer Paper</th>
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
                      <td> <button className="btn btn-primary" onClick={() => fetchAnswerPaper(score.registration_number, score.qpcode)}>
                        View
                      </button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    )}
    {isModalOpen && selectedAnswerPaper && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content" style={{ width: "100%" }}>


            <div className="modal-header">
              <h4 className="modal-title">Answer Sheet - {selectedAnswerPaper.qpcode}</h4>
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
            </div>
            <div className="px-4 pt-2">
              <h6><strong>Student Registration Number:</strong> {selectedAnswerPaper.registration_number || "N/A"}</h6>
              <h6><strong>Question Paper Title:</strong> {selectedAnswerPaper.title || "N/A"}</h6>
            </div>


            <div className="modal-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
              <table className="table table-striped table-hover" style={{ tableLayout: "fixed", width: "100%", position: 'relative', left: "0px" }}>
                <thead className="table" style={{ position: 'relative', left: "0px" }}>
                  <tr>
                    <th style={{ width: "50%" }}>Question</th>
                    <th style={{ width: "25%" }}>Your Answer</th>
                    <th style={{ width: "25%" }}>Correct Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAnswerPaper?.answers?.map((answer, index) => (
                    <tr key={index}>
                      {/* Question Column */}
                      <td style={{
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-line",
                        textAlign: "start"
                      }}>
                        <strong>{index + 1}. {answer.question}</strong>
                        <div className="mt-1 text-start">
                          {answer.options.length > 0 ? (
                            answer.options.map((opt, idx) => (
                              <div key={idx} className="ms-3">
                                <strong>{String.fromCharCode(65 + idx)}</strong> {opt}
                              </div>
                            ))
                          ) : (
                            <div className="text-danger">⚠ Options not available</div>
                          )}
                        </div>
                      </td>


                      <td style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
                        <strong>{answer.studentAnswer}</strong>
                        {answer.isCorrect ? <span className="text-success"> ✅</span> : <span className="text-danger"> ❌</span>}
                      </td>


                      <td style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
                        <strong>{answer.correctAnswer}</strong> ✅
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div className="modal-footer">
              <h6><strong>Score:</strong> {selectedAnswerPaper.score}/{selectedAnswerPaper.totalscore}</h6>
              <h6><strong>Percentage:</strong> {selectedAnswerPaper.totalscore > 0
                ? ((selectedAnswerPaper.score / selectedAnswerPaper.totalscore) * 100).toFixed(2) + "%"
                : "N/A"}</h6>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default Studenttrainingscores;


