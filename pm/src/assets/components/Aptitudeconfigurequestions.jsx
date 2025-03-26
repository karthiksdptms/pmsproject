
import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Aptitudeconfigurequestions.css"
import Topbar from './Topbar'
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from 'axios';

function Aptitudeconfigurequestions() {
  const [showModal, setShowModal] = useState(false);
  const [instructions, setInstructions] = useState("");
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
  
  

  const [selectedPaperIndex, setSelectedPaperIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  const calculateDuration = (start, end) => {
    const startTimeObj = new Date(`2000-01-01T${start}`);
    const endTimeObj = new Date(`2000-01-01T${end}`);
    return (endTimeObj - startTimeObj) / 1000; // Convert to seconds
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
    setQuestions([...questions, { text: "", marks: "", options: ["", "", "", ""], correctOption: "" }]);
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
      title,
      academicYear,
      examDate,
      startTime,
      endTime,
      semesterType,
      negativeMarking,
      instructions,
      questions,
    };
  
    if (editIndex !== null) {
      const paperId = questionPapers[editIndex]?._id; // Ensure _id exists
      if (!paperId) {
        console.error("Error: Paper ID not found!");
        return;
      }
  
      axios.put(`https://pmsproject-api.vercel.app/updateqp/${paperId}`, questionPaperData)
        .then((result) => {
          console.log("Updated successfully", result.data);
  
          // Update the UI
          const updatedPapers = [...questionPapers];
          updatedPapers[editIndex] = result.data; // Ensure API returns updated data
          setQuestionPapers(updatedPapers);
  
          setEditIndex(null); // Reset edit index
          setShowModal(false);
        })
        .catch((err) => console.error("Error updating:", err));
    } else {
      axios.post('https://pmsproject-api.vercel.app/addqp', questionPaperData)
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

    axios.get('https://pmsproject-api.vercel.app/getqp')
      .then(result => setQuestionPapers(result.data))
      .catch(err => console.log(err))
  }, [])
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`https://pmsproject-api.vercel.app/delqp/${id}`)
        .then((response) => {
          alert("Record deleted successfully!");
          setQuestionPapers(questionPapers.filter((paper) => paper._id !== id)); // Remove from UI
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

  return (
    <><Topbar />
      <div
        style={{
          position: "relative",
          top: "00px",
          left: "250px",
          marginTop: "0",
          margin:"0px"
        }}
      >
        <Link
          to="/Aptitude"
          style={{ textDecoration: "none", color: "black" }}
        >
          <div>
            <button
              type="button"
              class="btn btn-secondary"
              style={{
                marginLeft: "20px",
                border: "none",
                position: "relative",
                top: "95px",
                right: "40px",
                fontSize: "35px",
                color: "black",
                backgroundColor: "transparent",
                zIndex:"100"
              }}
            >
              <IoIosArrowBack />
            </button>
            <h2
              style={{
                zIndex:"100",
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
        <div className="container mt-4" style={{ position: "relative", top: "-35px", }}>
          {!showQuestionPaper ? (
            <>
              {/* Create Questions Button */}
              <button className="btn  " onClick={() => setShowModal(true)} style={{ marginRight: "50px", position: "relative", left: "1080px",top:"50px"}}><i class="bi bi-plus-circle-fill" style={{ fontSize: "40px",color:"blue"  }}></i></button>


              {displayedData.length > 0 && (
  <div className="mt-4 " >
  
    <h4 className="mb-4" style={{position:"relative",top:"50px",left:"50px",width:'300px'}}>
  Total Question Papers: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color:"white" }}>{totalRecords}</span>
</h4>

{/* Records per page selection */}
<div
                        className="flex justify-right items-center gap-4 mt-4 "
                        style={{ position: "relative", left: "800px",bottom:"20PX",width:'460px' }}
                      >
                        <label>
                          {" "}
                          No of records per page:{" "}
                          <input
                            type="number"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            style={{ width: "50px", padding: "5px",marginRight:"20PX" }}
                          />
                        </label>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className="btn"
                          disabled={currentPage === 1}
                        >
                          <i class="bi bi-chevron-double-left"></i>
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
                          <i class="bi bi-chevron-double-right arr"></i>
                        </button>
                      </div>
    <div style={{        
                        position: "relative",
                       top:"20px",
                       left:"-30px",
                        overflowY: "auto",
                       
                        Width:"1100px",
                        maxHeight: "800px",
                      }}>
    <table className="table table-striped  table-hover "style={{position:"relative",right:"0px",left:"25px",top:"20px",marginBottom:'50px'}} >
      <thead>
        <tr>
          <th>Title</th>
          <th>Academic year</th>
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
            <td>{paper.title}</td>
            <td>{paper.academicYear}</td>
            <td>{new Date(paper.examDate).toLocaleDateString("en-GB")}</td>
            <td>{paper.startTime}</td>
            <td>{paper.endTime}</td>
            <td>{paper.semesterType}</td>
            <td>
              {/* View */}
              <button 
  className="btn btn-primary me-2" 
  onClick={() => { 
    setShowQuestionPaper(true);
    setSelectedPaperIndex(index);

    // Set the selected question paper details correctly
    const selectedPaper = questionPapers[index];
    setTitle(selectedPaper.title);
    setAcademicYear(selectedPaper.academicYear);
    setExamDate(selectedPaper.examDate);
    setStartTime(selectedPaper.startTime);
    setEndTime(selectedPaper.endTime);
    setSemesterType(selectedPaper.semesterType);
    setNegativeMarking(selectedPaper.negativeMarking);
    setInstructions(selectedPaper.instructions);
    setQuestions([...selectedPaper.questions]); // Clone questions

   
  


                    
  const duration = calculateDuration(paper.startTime, paper.endTime);
  setRemainingTime(duration);
  setProgress(100); // Reset progress

                }}>
                View
              </button>

              {/* Edit */}
              <button className="btn btn-warning me-2" 
  onClick={() => {
    console.log("Editing paper index:", index);  // Debugging line
    setEditIndex(index); // Track the edited paper index
    setTitle(paper.title);
    setAcademicYear(paper.academicYear);
    setExamDate(paper.examDate);
    setStartTime(paper.startTime);
    setEndTime(paper.endTime);
    setSemesterType(paper.semesterType);
    setNegativeMarking(paper.negativeMarking);
    setInstructions(paper.instructions);
    setQuestions([...paper.questions]); // Clone to avoid direct mutation
    setShowModal(true);
  }}>
  Edit
</button>




              {/* Delete */}
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



              {/* Popup Modal */}
              {showModal && (
                <div className="modal d-block" tabIndex="-1">
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Create Questions</h5>
                        <button className="btn-close" onClick={() => setShowModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        {/* Title Input */}
                        <div className="mb-3">
                          <label className="form-label">Title</label>
                          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        {/* Academic Year Input */}
                        <div className="mb-3">
                          <label className="form-label">Academic Year</label>
                          <input type="text" className="form-control" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                        </div>
                        {/* Odd/Even Semester Dropdown */}
                        <div className="mb-3">
                          <label className="form-label">Semester</label>
                          <select className="form-select" value={semesterType} onChange={(e) => setSemesterType(e.target.value)}>
                            <option value="">Select sem </option>
                            <option value="Odd">Odd </option>
                            <option value="Even">Even </option>
                          </select>
                        </div>

                        {/* Exam Date, Start Time, and End Time in the same row */}
                        <div className="row mb-3">
                          {/* Exam Date */}
                          <div className="col">
                            <label className="form-label">Exam Date</label>
                            <input type="date" className="form-control" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                          </div>

                          {/* Start Time */}
                          <div className="col">
                            <label className="form-label">Start Time</label>
                            <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                          </div>

                          {/* End Time */}
                          <div className="col">
                            <label className="form-label">End Time</label>
                            <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                          </div>
                        </div>



                        {/* Questions Input */}
                        <div className="mb-3">
                        
                          <label className="form-label">Instructions</label>
                          <textarea className="form-control" rows="3" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Enter exam instructions here..."></textarea>
                        </div>
                        {/* Negative Marking Dropdown */}
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
        value={question.text}
        onChange={(e) => handleChangeQuestion(index, "text", e.target.value)}
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

      {/* Delete Question Button */}
      <button className="btn" onClick={() => handleDeleteQuestion(index)}>
      <i class="bi bi-x-circle" style={{fontSize:"30px",color:"red"}}></i>
      </button>
    </div>
  ))}
</div>

{/* Add Question Button */}
<button className=" btn"  style={{backgroundColor:"none"}} onClick={handleAddQuestion}><i class="bi bi-plus-circle-fill"style={{fontSize:"40px",color:"grey"}}></i></button>

                        {/* Add Question Button */}
                        
                      </div>

                      {/* Modal Footer */}
                      <div className="modal-footer">
                        <button className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn btn-success" onClick={handleSave}>
  Save
</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              
              
            </>
          ) : (
            <div className="border p-4 mt-3 position-relative" style={{position:"relative",bottom:"-80px"}}>
             
             
              <div className="title"style={{width:"104.5%",height:"55px",backgroundColor:"rgb(216, 216, 216)",position:"relative",right:"25px",bottom:'30px '}}>  <h3 className="text-center">{title}</h3> 
              <button style={{color:"black"}}

                className="btn-close position-absolute top-0 end-0 m-2"
                onClick={() => setShowQuestionPaper(false)}
              ></button>
</div>
              <p className="text-left">
                Academic Year: {academicYear} | Semester: {semesterType} | Exam Date: {examDate}
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
                {/* Instructions Section */}
                <div className="instructions-content">
               
                  <div className="int"><h5>Instructions:</h5></div>
                  
                  
                  <p className="text-left">Start Time: {startTime} | End Time: {endTime}</p>
                  <p>{instructions}</p>
                </div>

                {/* Divider Line */}
                <div className="divider"></div>

                {/* Question Circles Section */}
                <div className="question-circles">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`circle ${answerStatus[index]}`} // Dynamic class for color
                      onClick={() => setCurrentQuestionIndex(index)} // Click navigates to question
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


                    {/* Answerable MCQ Options */}
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

                            // Update Answer Status
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

                  {/* Navigation Buttons */}
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
      </div>

    </>
  )
}

export default Aptitudeconfigurequestions