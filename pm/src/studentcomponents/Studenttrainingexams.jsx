import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../assets/context/authContext";
import './Studenttrainingexams.css'
import Swal from "sweetalert2";
import Loading from "../assets/components/Loading";

function Studenttrainingexams() {
  const { user } = useAuth();
  const [questionPapers, setQuestionPapers] = useState([]);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [selectedPaperIndex, setSelectedPaperIndex] = useState(null);
  const [qpcode, setqpcode] = useState("");
  const [title, setTitle] = useState("");
  const [stdloading, setstdloading] = useState(false)
  const [academicYear, setAcademicYear] = useState("");
  const [department, setdepartment] = useState("");
  const [batch, setbatch] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [semesterType, setSemesterType] = useState("");
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  
  useEffect(() => {
    if (user?._id) {
      setstdloading(true);
      axios
        .get(`http://localhost:3000/getstudent/${user._id}`)
        .then((result) => {
          console.log("API Response:", result.data);
          setQuestionPapers(result.data.exams || []);
          setstdloading(false);
        })
        .catch((err) => {
          console.log("API Error:", err);
          setstdloading(false);
        });
    }
  }, [user._id]);

  const totalRecords = questionPapers.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(questionPapers.length / rowsPerPage);
  
  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = questionPapers.slice(startIdx, startIdx + rowsPerPage);

 
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.floor((end - start) / 1000); 
  };

  const [examStarted, setExamStarted] = useState(false);


  const handleStartTest = (index) => {
    const selectedPaper = questionPapers[index];
    setShowQuestionPaper(true);
    setSelectedPaperIndex(index);
    setqpcode(selectedPaper.qpcode);
    setTitle(selectedPaper.title);
    setAcademicYear(selectedPaper.academicYear);
    setdepartment(selectedPaper.department);
    setbatch(selectedPaper.batch);
    setExamDate(selectedPaper.examDate);
    setStartTime(selectedPaper.startTime);
    setEndTime(selectedPaper.endTime);
    setSemesterType(selectedPaper.semesterType);
    setInstructions(selectedPaper.instructions);
    setQuestions([...selectedPaper.questions]);
    setAnswerStatus(Array(selectedPaper.questions.length).fill(""));
    setRemainingTime(calculateDuration(selectedPaper.startTime, selectedPaper.endTime));
    setExamStarted(true);
  };
  useEffect(() => {
    if (examStarted && remainingTime > 0 && displayedData.length > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
  
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }
  if (examStarted && remainingTime === 0) {
    if (remainingTime === 0) {
      Swal.fire({
        title: "Time Over ⏰",
        text: "Your Exam is Automatically Submitted",
        icon: "info",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        handleSubmit(); 
        setShowQuestionPaper(false); 
      });
    }}
  }, [remainingTime, displayedData,examStarted]);
  
  useEffect(() => {
    let violationCount = 0; 
  
    if (examStarted) {
    
      window.addEventListener("contextmenu", (e) => e.preventDefault());
  
     
      const handleViolation = () => {
        violationCount++;
        if (violationCount === 1) {
          Swal.fire({
            title: "Unauthorized Action Detected ❌",
            text: "Warning 1/1 - Next Violation will Submit the Exam Automatically",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false,
          });
        } else if (violationCount === 2) {
          Swal.fire({
            title: "Unauthorized Action Detected ❌",
            text: "Your Exam is Automatically Submitted",
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            handleSubmit(); 
            setShowQuestionPaper(false);
          });
        }
      };
  
      
      window.addEventListener("keydown", (e) => {
        if (
          e.ctrlKey && (e.key === "c" || e.key === "u" || e.key === "I") ||
          e.key === "F12" ||
          e.ctrlKey && e.shiftKey && e.key === "I" ||
          e.ctrlKey && e.key === "t"
        ) {
          e.preventDefault();
          handleViolation();
        }
      });
  
      return () => {
        window.removeEventListener("contextmenu", (e) => e.preventDefault());
        window.removeEventListener("keydown", (e) => e.preventDefault());
      };
    }
  }, [examStarted]);
  


  const handleSubmit = async () => {
    const resultArray = [];
    questions.forEach((q, index) => {
      if (selectedAnswers[index]) {
       
        const selectedOptionIndex = q.options.indexOf(selectedAnswers[index]);
        if (selectedOptionIndex !== -1) {
          
          const optionAlphabet = String.fromCharCode(65 + selectedOptionIndex);
          resultArray.push({
            question: index + 1, 
            answer: optionAlphabet, 
            marks: q.marks, 
          });
        }
      }
    });
  
    console.log("Submitted Answers:", resultArray);
    
  
    try {
      const response = await axios.post('http://localhost:3000/api/answerkey/submitans', 
      
      { userId: user._id,
        qpcode: qpcode,
        answers: JSON.parse(JSON.stringify(resultArray)),});
  
      setShowQuestionPaper(false);
  
      Swal.fire({
        icon: "success",
        title: `Answers Submitted Successfully 🎯`,
      
        showConfirmButton: true,
        timer: 3000,
      }).then(() => {
        window.location.reload(); 
      });

setSelectedAnswers({}); 
setShowQuestionPaper(false); 

    } catch (err) {
      console.error("Submit Error", err);
  
      Swal.fire({
        icon: "error",
        title: "Submission Failed ❌",
        text: "Please try again later",
      });
    }
  };

  return (
    <>
      <div className="hea">
        <Link to="/Studentdashboard/Studenttraining" style={{ textDecoration: 'none', color: "black" }}>
          <div>
            <button type="button" className="btn btn-secondary"
              style={{ marginLeft: "20px", border: "none", position: "relative", top: "95px", right: '40px', fontSize: "35px", color: "black", backgroundColor: "transparent" }}>
              <IoIosArrowBack />
            </button>
            <h2 style={{ position: "relative", top: '45px', left: "30px", fontFamily: 'poppins', fontSize: "35px", width: '100px' }}>Exams</h2>
          </div>
        </Link>
      </div>

      {stdloading ? (
          <Loading/>
          ) : (
        <div className="mt-4" style={{ position: "relative", left: "270px" }}>
          <h4 className="mb-4" style={{ position: "relative", top: "50px", left: "50px", width: '350px' }}>
            Total exams to attend: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{totalRecords}</span>
          </h4>

          <div className="flex justify-right items-center gap-4 mt-4" style={{ position: "relative", left: "800px", bottom: "20PX", width: '450px' }}>
            <label>
              No of records per page:
              <input type="number" value={rowsPerPage} onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value > 0) {
                  setRowsPerPage(value);
                  setCurrentPage(1);
                }
              }} style={{ width: "50px", padding: "5px", marginRight: "20PX" }} />
            </label>
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="btn" disabled={currentPage === 1}>
              <i className="bi bi-chevron-double-left"></i>
            </button>
            <span className="text-lg">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="btn" disabled={currentPage === totalPages}>
              <i className="bi bi-chevron-double-right arr"></i>
            </button>
          </div>

          <div style={{ position: "relative", top: "20px", left: "-30px", overflowY: "auto", minWidth: '1270px', maxHeight: "800px" }}>
            <table className="table table-striped table-hover" style={{ position: "relative", right: "0px", left: "25px", top: "20px", marginBottom: '50px', marginRight: '50px' }}>
              <thead>
                <tr>
                  <th>Question paper code</th>
                  <th>Title</th>
                  <th>Academic year</th>
                  <th>Department</th>
                  <th>Batch</th>
                  <th>Exam Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Semester</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {displayedData.length > 0 ? (
    displayedData.map((paper, index) => (
      <tr key={index}>
        <td>{paper.qpcode}</td>
        <td>{paper.title}</td>
        <td>{paper.academicYear}</td>
        <td>{paper.department}</td>
        <td>{paper.batch}</td>
        <td>{new Date(paper.examDate).toLocaleDateString("en-GB")}</td>
        <td>{paper.startTime}</td>
        <td>{paper.endTime}</td>
        <td>{paper.semesterType}</td>
        <td>
          <button className="btn btn-primary me-2" onClick={() => handleStartTest(index)}>
            Take Test
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="10" style={{ textAlign: "center", fontWeight: "bold", color: "red", fontSize: "20px" }}>
        No Exams Left 
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>)}
      

    
      {showQuestionPaper && selectedPaperIndex !== null && (
        <div>
        <div className="border p-4 mt-3 " style={{position:"relative",bottom:"310px",left:"240px",backgroundColor:"rgb(177, 177, 177)",width:"1275px",height:'650px'}}>
             
             
        <div className="title"style={{width:"104.5%",height:"55px",backgroundColor:"rgb(216, 216, 216)",position:"relative",right:"25px",bottom:'30px '}}>  <h3 className="text-center">{title}</h3> 
       
</div>
        <p className="text-center">
          Academic Year: {academicYear} |Department:{department}|Batch:{batch}<br/> Semester: {semesterType} | Exam Date: {new Date(examDate).toLocaleDateString("en-GB")}

        </p>
        

        <div 
className="timer-box" 
style={{ backgroundColor: remainingTime <= 600 ? "red" : "#222" ,width:"100px"}}
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
        <button className="btn btn-primary" style={{position:"relative",left:"1000px"}} onClick={handleSubmit}> Submit</button>



        <div className="iic qq" >
          <div style={{ position: "relative", bottom: "50px" }} className="">
            <div className="mb-3 ">
            {questions.length > 0 && questions[currentQuestionIndex] && (
<h5 className="text-wrap">
Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex].question} ({questions[currentQuestionIndex].marks} Marks)
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
      </div>
      )}
    </>
  );
}

export default Studenttrainingexams;
