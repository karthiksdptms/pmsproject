
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Aptitudeconfigurequestions.css"
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Loading from "./Loading";
function Aptitudeconfigurequestions() {

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [qpcode, setqpcode] = useState("");
  const [department, setdepartment] = useState("");
  const [batch, setbatch] = useState("");
  const [title, setTitle] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questions, setQuestions] = useState([{ text: "", marks: "", options: ["", "", "", ""], correctOption: "" }]);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [semesterType, setSemesterType] = useState("");
  const [negativeMarking, setNegativeMarking] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answerStatus, setAnswerStatus] = useState(
    Array(questions.length).fill("unanswered")
  );
  const [questionPapers, setQuestionPapers] = useState([]);
  const [isQpCodeTaken, setIsQpCodeTaken] = useState(false);



  const [selectedPaperIndex, setSelectedPaperIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  const calculateDuration = (start, end) => {
    const startTimeObj = new Date(`2000-01-01T${start}`);
    const endTimeObj = new Date(`2000-01-01T${end}`);
    return (endTimeObj - startTimeObj) / 1000;
  };

  const handleViewPaper = (paper, index) => {
    if (!paper || !paper.questions) {
      console.error("Invalid paper data:", paper);
      return;
    }
    setShowQuestionPaper(true);
    setSelectedPaperIndex(index);
    const duration = calculateDuration(paper.startTime, paper.endTime);
    setRemainingTime(duration);
  };




  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", marks: "", options: ["", "", "", ""], correctOption: "" }]);
  };

  const handleChangeQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleChangeOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };


  const handleSave = (e) => {
    e.preventDefault();

    const questionPaperData = {
      qpcode,

      title,
      academicYear,
      department,
      batch,
      examDate,
      startTime,
      endTime,
      semesterType,
      negativeMarking,
      instructions,
      questions,
    };

    if (editIndex !== null) {
      const paperId = questionPapers[editIndex]?._id;
      if (!paperId) {
        console.error("Error: Paper ID not found!");
        return;
      }

      axios.put(`${API_BASE_URL}/updateqp/${paperId}`, questionPaperData)
        .then((result) => {
          console.log("Updated successfully", result.data);


          const updatedPapers = [...questionPapers];
          updatedPapers[editIndex] = result.data;
          setQuestionPapers(updatedPapers);

          setEditIndex(null);
          setShowModal(false);
        })
        .catch((err) => console.error("Error updating:", err));
    } else {
      axios.post(`${API_BASE_URL}/addqp`, questionPaperData)
        .then((result) => {
          console.log("Created successfully", result.data);
          setQuestionPapers([...questionPapers, result.data]);
          setShowModal(false);
        })
        .catch((err) => console.error("Error adding:", err));
    }
  };


  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowQuestionPaper(false);
          alert("Time's up! The exam has ended.");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  useEffect(() => {
    setLoading(true)
    axios.get(`${API_BASE_URL}/getqp`)
      .then(result => setQuestionPapers(result.data), setLoading(false))

      .catch(err => console.log(err))
  }, [])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`${ API_BASE_URL } / delqp / ${ id }`)
        .then((response) => {
          alert("Record deleted successfully!");
          setQuestionPapers(questionPapers.filter((paper) => paper._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting record:", error);
        });
    }
  }; const totalRecords = questionPapers.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };

  const totalPages = Math.ceil(questionPapers.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = questionPapers.slice(
    startIdx,
    startIdx + rowsPerPage
  );

  const checkQpCode = async (code) => {
    if (code.trim() !== "") {
      try {
        const response = await fetch(`${API_BASE_URL}/api/answerkey/check-qpcode/${code}`);
      const data = await response.json();
      if (data.exists) {
        setIsQpCodeTaken(true);
        alert("This Question Paper Code is already taken!");
      } else {
        setIsQpCodeTaken(false);
      }
    } catch (error) {
      console.error("Error checking Question Paper Code:", error);
    }
  }
};

return (
  <>
    <div
      style={{
        position: "relative",
        top: "00px",
        left: "250px",
        marginTop: "0",
        margin: "0px"
      }}
    >
      <Link
        to="/Maindashboard/Aptitude"
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
              zIndex: "100"
            }}
          >
            <IoIosArrowBack />
          </button>
          <h2
            style={{
              zIndex: "100",
              position: "relative",
              top: "45px",
              left: "30px",
              fontFamily: "poppins",
              fontSize: "35px",
              width: "450px",
            }}
          >
            Configure Questions{" "}
          </h2>
        </div>
      </Link>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mt-4" style={{ position: "relative", top: "-35px", }}>
          {!showQuestionPaper ? (
            <>




              <button className="btn  " onClick={() => setShowModal(true)} style={{ marginRight: "50px", position: "relative", left: "1080px", top: "50px" }}><i className="bi bi-plus-circle-fill" style={{ fontSize: "40px", color: "blue" }}></i></button>


              {displayedData.length > 0 && (
                <div className="mt-4 " >

                  <h4 className="mb-4" style={{ position: "relative", top: "50px", left: "50px", width: '350px' }}>
                    Total Question Papers: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{totalRecords}</span>
                  </h4>


                  <div
                    className="flex justify-right items-center gap-4 mt-4 "
                    style={{ position: "relative", left: "800px", bottom: "20PX", width: '460px' }}
                  >
                    <label>
                      {" "}
                      No of records per page:{" "}
                      <input
                        type="number"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        style={{ width: "50px", padding: "5px", marginRight: "20PX" }}
                      />
                    </label>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="btn"
                      disabled={currentPage === 1}
                    >
                      <i className="bi bi-chevron-double-left"></i>
                    </button>

                    <span className="text-lg">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      className="btn"
                      disabled={currentPage === totalPages}
                    >
                      <i className="bi bi-chevron-double-right arr"></i>
                    </button>
                  </div>
                  <div style={{
                    position: "relative",
                    top: "20px",
                    left: "-30px",
                    overflowY: "auto",

                    minWidth: '1290px',
                    maxHeight: "800px",
                  }}>
                    <table className="table table-striped  table-hover " style={{ position: "relative", right: "0px", left: "25px", top: "20px", marginBottom: '50px', marginRight: '50px', minWidth: "1500px" }} >
                      <thead>
                        <tr>
                          <th>Question paper code</th>
                          <th>Title</th>
                          <th>Academic year</th>
                          <th>Department</th>
                          <th>Batch</th>
                          <th>Negative Marking</th>
                          <th>Exam Date</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Semester</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedData.map((paper, index) => (
                          <tr key={index}>
                            <td>{paper.qpcode}</td>
                            <td>{paper.title}</td>
                            <td>{paper.academicYear}</td>
                            <td>{paper.department}</td>
                            <td>{paper.batch}</td>
                            <td>{paper.negativeMarking}</td>
                            <td>{new Date(paper.examDate).toLocaleDateString("en-GB")}</td>
                            <td>{paper.startTime}</td>
                            <td>{paper.endTime}</td>
                            <td>{paper.semesterType}</td>
                            <td>

                              <button
                                className="btn btn-primary me-2"
                                onClick={() => {
                                  setShowQuestionPaper(true);
                                  setSelectedPaperIndex(index);


                                  const selectedPaper = questionPapers[index];
                                  setqpcode(selectedPaper.qpcode);
                                  setTitle(selectedPaper.title);
                                  setAcademicYear(selectedPaper.academicYear);
                                  setdepartment(selectedPaper.department);
                                  setbatch(selectedPaper.batch);

                                  setExamDate(selectedPaper.examDate);
                                  setStartTime(selectedPaper.startTime);
                                  setEndTime(selectedPaper.endTime);
                                  setSemesterType(selectedPaper.semesterType);
                                  setNegativeMarking(selectedPaper.negativeMarking);
                                  setInstructions(selectedPaper.instructions);
                                  setQuestions([...selectedPaper.questions]);






                                  const duration = calculateDuration(paper.startTime, paper.endTime);
                                  setRemainingTime(duration);
                                  setProgress(100);

                                }}>
                                View
                              </button>


                              <button className="btn btn-warning me-2"
                                onClick={() => {
                                  console.log("Editing paper index:", index);
                                  setEditIndex(index);
                                  setqpcode(paper.qpcode)
                                  setTitle(paper.title);
                                  setAcademicYear(paper.academicYear);
                                  setdepartment(paper.department);
                                  setbatch(paper.batch)
                                  setExamDate(paper.examDate);
                                  setStartTime(paper.startTime);
                                  setEndTime(paper.endTime);
                                  setSemesterType(paper.semesterType);
                                  setNegativeMarking(paper.negativeMarking);
                                  setInstructions(paper.instructions);
                                  setShowModal(true);
                                  setQuestions([...paper.questions]);
                                }}>
                                Edit
                              </button>





                              <button className="btn btn-danger"
                                onClick={() => {
                                  handleDelete(paper._id)
                                  const updatedPapers = questionPapers.filter((_, i) => i !== index);
                                  setQuestionPapers(updatedPapers);
                                  setShowQuestionPaper(false);
                                }}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}







              {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ minWidth: "100%" }}>
                  <div className="modal-dialog modal-lg" >
                    <div className="modal-content" style={{ minWidth: "100%" }}>
                      <div className="modal-header">
                        <h5 className="modal-title">Create Questions</h5>
                        <button className="btn-close" onClick={() => setShowModal(false)}></button>
                      </div>
                      <div className="modal-body">

                        <div className="mb-3">
                          <label className="form-label">Question Paper Code:(code should be unique)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={qpcode}
                            onChange={(e) => setqpcode(e.target.value)}
                            onBlur={() => checkQpCode(qpcode)}
                            required
                          />
                          {isQpCodeTaken && (
                            <div className="text-danger mt-2">
                              This Question Paper Code is already taken!
                            </div>)}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Title</label>
                          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>


                        <div className="mb-3">
                          <label className="form-label">Academic Year</label>
                          <input type="text" className="form-control" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Department</label>
                          <input type="text" className="form-control" value={department} onChange={(e) => setdepartment(e.target.value)} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Batch</label>
                          <input type="text" className="form-control" value={batch} onChange={(e) => setbatch(e.target.value)} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Semester</label>
                          <select className="form-select" value={semesterType} onChange={(e) => setSemesterType(e.target.value)}>
                            <option value="">Select sem </option>
                            <option value="Odd">Odd </option>
                            <option value="Even">Even </option>
                          </select>
                        </div>


                        <div className="row mb-3">

                          <div className="col">
                            <label className="form-label">Exam Date</label>
                            <input type="date" className="form-control" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                          </div>


                          <div className="col">
                            <label className="form-label">Start Time</label>
                            <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                          </div>


                          <div className="col">
                            <label className="form-label">End Time</label>
                            <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                          </div>
                        </div>




                        <div className="mb-3">

                          <label className="form-label">Instructions</label>
                          <textarea className="form-control" rows="3" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Enter exam instructions here..."></textarea>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Negative Marking</label>
                          <select className="form-select" value={negativeMarking} onChange={(e) => setNegativeMarking(e.target.value)}>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Questions</label>
                          {questions.map((question, index) => (
                            <div key={index} className="mb-3 border p-3">
                              <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Enter question"
                                value={question.question}
                                onChange={(e) => handleChangeQuestion(index, "question", e.target.value)}
                              />
                              <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Marks"
                                value={question.marks}
                                onChange={(e) => handleChangeQuestion(index, "marks", e.target.value)}
                              />

                              <strong>Options:</strong>
                              {["A", "B", "C", "D"].map((label, optIndex) => (
                                <div key={optIndex} className="input-group mb-2">
                                  <span className="input-group-text">{label}</span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Option ${label}`}
                                    value={question.options[optIndex]}
                                    onChange={(e) => handleChangeOption(index, optIndex, e.target.value)}
                                  />
                                </div>
                              ))}


                              <button className="btn" onClick={() => handleDeleteQuestion(index)}>
                                <i className="bi bi-x-circle" style={{ fontSize: "30px", color: "red" }}></i>
                              </button>
                            </div>
                          ))}
                        </div>


                        <button className=" btn" style={{ backgroundColor: "none" }} onClick={handleAddQuestion}><i className="bi bi-plus-circle-fill" style={{ fontSize: "40px", color: "grey" }}></i></button>



                      </div>


                      <div className="modal-footer">
                        <button className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
                        <button
                          className="btn btn-success"
                          onClick={handleSave}
                          disabled={isQpCodeTaken || !qpcode || !title || !examDate || !startTime || !endTime}
                        >
                          Save
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              )}



            </>
          ) : (
            <div className="border p-4 mt-3 position-relative" style={{ position: "relative", bottom: "-80px" }}>


              <div className="title" style={{ width: "104.5%", height: "55px", backgroundColor: "rgb(216, 216, 216)", position: "relative", right: "25px", bottom: '30px ' }}>  <h3 className="text-center">{title}</h3>
                <button style={{ color: "black" }}

                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={() => setShowQuestionPaper(false)}
                ></button>
              </div>
              <p className="text-center">
                Academic Year: {academicYear} |Department:{department}|Batch:{batch}<br /> Semester: {semesterType} | Exam Date: {new Date(examDate).toLocaleDateString("en-GB")}

              </p>


              <div
                className="timer-box"
                style={{ backgroundColor: remainingTime <= 600 ? "red" : "#222" }}
              >
                <h4 className="timer-text">
                  {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
                </h4>
              </div>



              <div className="instructions-container ic">

                <div className="instructions-content">

                  <div className="int"><h5>Instructions:</h5></div>


                  <p className="text-left">Start Time: {startTime} | End Time: {endTime}</p>
                  <p>{instructions}</p>
                </div>


                <div className="divider"></div>


                <div className="question-circles">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`circle ${answerStatus[index]}`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>



              <div className="iic qq" >
                <div style={{ position: "relative", bottom: "50px" }} className="">
                  <div className="mb-3 ">
                    {questions.length > 0 && questions[currentQuestionIndex] && (
                      <h5 className="text-wrap">
                        Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex].text} ({questions[currentQuestionIndex].marks} Marks)
                      </h5>
                    )}
                    <br />



                    {questions[currentQuestionIndex].options.map((opt, i) => (
                      <div key={i} className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          name={`question-${currentQuestionIndex}`}
                          value={opt}
                          checked={selectedAnswers[currentQuestionIndex] === opt}
                          onChange={() => {
                            setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: opt });


                            const newStatus = [...answerStatus];
                            newStatus[currentQuestionIndex] = "answered";
                            setAnswerStatus(newStatus);
                          }}
                        />
                        <label className="form-check-label qq">
                          <strong>{["A", "B", "C", "D"][i]}.</strong> {opt}
                        </label>
                      </div>
                    ))}

                  </div>


                  <button
                    className="btn btn-secondary me-2"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  >
                    Previous
                  </button>

                  <button
                    className="btn btn-primary"
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={() => {
                      if (!selectedAnswers[currentQuestionIndex]) {
                        const newStatus = [...answerStatus];
                        newStatus[currentQuestionIndex] = "skipped";
                        setAnswerStatus(newStatus);
                      }
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    }}
                  >
                    Next
                  </button>

                </div>
              </div>
            </div>

          )}
        </div>
      )}
    </div>

  </>
)
}

export default Aptitudeconfigurequestions