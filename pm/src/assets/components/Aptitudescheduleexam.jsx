import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Aptitudeconfigurequestions.jsx"
import Topbar from './Topbar'
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./Aptitudescheduleexam.css";


function Aptitudescheduleexam() {
 

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
    const [questionPapers, setQuestionPapers] = useState([]);
      const [selectedAnswers, setSelectedAnswers] = useState({});
       const [selectedPaperIndex, setSelectedPaperIndex] = useState(null);
        const [editIndex, setEditIndex] = useState(null);
        const [remainingTime, setRemainingTime] = useState(null);
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
        
            axios.put(`http://localhost:3000/updateqp/${paperId}`, questionPaperData)
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
            axios.post('http://localhost:3000/addqp', questionPaperData)
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
      
          axios.get('http://localhost:3000/getqp')
            .then(result => setQuestionPapers(result.data))
            .catch(err => console.log(err))
        }, [])
        
        const handleDelete = (id) => {
          if (window.confirm("Are you sure you want to delete this record?")) {
            axios
              .delete(`http://localhost:3000/delqp/${id}`)
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
        <><Topbar/>
        <div
             style={{
               position: "relative",
               top: "00px",
               left: "250px",
               marginTop: "0",
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
                     width: "450px",
                   }}
                 >
                Schedule Exam{" "}
                 </h2>
               </div>
             </Link>
             <div className="menu5">
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
           </div>
        </>
       )
}

export default Aptitudescheduleexam