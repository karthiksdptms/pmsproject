import React from 'react'

import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import "./Aptitudescheduleexam.css"
import Papa from "papaparse";
import Loading from './Loading';

function Aptitudescheduleexam() {

  const [uploadedKeys, setUploadedKeys] = useState({});
  const [questionPapers, setQuestionPapers] = useState([]);
  const [autoPostStatus, setAutoPostStatus] = useState({});
  const [stdloading, setstdloading] = useState(false)

  useEffect(() => {
    setstdloading(true)

    axios.get('http://localhost:3000/getqp')
      .then(result => {
        setQuestionPapers(result.data);
        const autoPostData = {};
        result.data.forEach((item) => {
          autoPostData[item.qpcode] = item.autoPost;

        });
        setAutoPostStatus(autoPostData);
      })
      .catch(err => console.log(err));
    setstdloading(false)
    axios.get("http://localhost:3000/api/answerkey/getuploadedanswerkeys")
      .then((res) => {
        const uploadedData = {};
        res.data.forEach((item) => {
          uploadedData[item.qpcode] = true;
        });
        setUploadedKeys(uploadedData);
      })
      .catch((err) => console.log(err));




  }, [])



  const fileInputRefs = {};


  const triggerFileUpload = (qpcode) => {
    if (fileInputRefs[qpcode]) {
      fileInputRefs[qpcode].click();
    }
  };




  const handleAnswerKey = async (e, qpcode) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a CSV file");
      return;
    }


    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (result) {
        const questionsArray = result.data;
        console.log("CSV Parsed Data: ", questionsArray);

        try {
          const response = await axios.post(`http://localhost:3000/api/answerkey/uploadanswerkey/${qpcode}`, {
            qpcode: qpcode,
            answerKey: questionsArray,
          });

          if (response.status === 200) {
            alert("Answer Key Uploaded Successfully");


            setUploadedKeys((prev) => ({
              ...prev,
              [qpcode]: true,
            }));
          }
        } catch (error) {
          console.log(error);
          alert("Failed to Upload Answer Key");
        }
      },
    });
  };

  const handleToggleAutoPost = async (qpcode, newStatus) => {
    console.log("Toggling Auto Post for:", qpcode, "New Status:", newStatus);

    try {
      await axios.post(`http://localhost:3000/api/students/autopost/${qpcode}`, {
        autoPost: newStatus,
      });

      setAutoPostStatus((prev) => ({
        ...prev,
        [qpcode]: newStatus,
      }));

      alert(`Auto Post ${newStatus ? "Enabled" : "Disabled"} Successfully`);
    } catch (err) {
      console.error("Auto Post Error:", err.response?.data || err.message);
      alert("Failed to update auto post");
    }
  };



  const handlePostQuestionPaper = async (qpcode) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/students/postquestionpaper/${qpcode}`);
      if (response.status === 200) {
        alert("Question Paper Posted Successfully");
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };


  const [showModal, setShowModal] = useState(false);
  const [registerNumbers, setRegisterNumbers] = useState("");
  const [selectedQpcode, setSelectedQpcode] = useState("");


  const openSpecificModal = (qpcode) => {
    setSelectedQpcode(qpcode);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setRegisterNumbers("");
  };
  const handleSpecificPost = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/student/postspecific/",
        {
          registerNumbers: registerNumbers.split(",").map((num) => num.trim()),
          qpcode: selectedQpcode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Question Paper Posted to Specific Students Successfully");
        setShowModal(false);
        setRegisterNumbers("");
      }
    } catch (error) {
      console.error(error);
      alert(error.response.data.message || "Failed to Post Question Paper");
    }
  };



  const totalRecords = questionPapers.length;
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
    <>
      <div
        style={{
          position: "relative",
          top: "00px",
          left: "250px",
          marginTop: "0",
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
              Schedule Exam
            </h2>
          </div>
        </Link>
        {stdloading ? (
          <Loading />
        ) : (
          <div className="">

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
                left: "-20px",
                overflowY: "auto",


                maxHeight: "800px",
              }}>
                <table className="table table-striped  table-hover " style={{ position: "relative", right: "0px", left: "25px", top: "20px", marginBottom: '50px', width: '100%', marginRight: "40px", minWidth: '1850px' }} >
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
                      <th>Answer key</th>
                      <th>Auto Post</th>
                      <th>Manual Post</th>

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

                          <button style={{ marginRight: '20px' }}
                            className="btn btn-secondary"
                            onClick={() => document.getElementById(`fileInput_${paper.qpcode}`).click()}
                            disabled={uploadedKeys[paper.qpcode]}
                          >
                            {uploadedKeys[paper.qpcode] ? "Uploaded" : "Add Answer Key"}
                          </button>

                          <input
                            type="file"
                            id={`fileInput_${paper.qpcode}`}
                            style={{ display: "none" }}
                            accept=".csv"
                            onChange={(e) => handleAnswerKey(e, paper.qpcode)}
                          />
                        </td><td>
                          <button
                            className='btn btn-success'
                            style={{ marginRight: "20px" }}
                            onClick={() => handleToggleAutoPost(paper.qpcode, !autoPostStatus[paper.qpcode])}
                          >
                            {autoPostStatus[paper.qpcode] ? "On" : "Off"}
                          </button></td>
                        <td>
                          <button
                            style={{ marginRight: "20px" }}
                            className="btn btn-primary me-2"
                            onClick={() => handlePostQuestionPaper(paper.qpcode)}
                          >
                            Post
                          </button>

                          <button
                            className="btn btn-info me-2"
                            onClick={() => openSpecificModal(paper.qpcode)}

                          >
                            Post to Specific Students
                          </button></td>


                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>)}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Post Question Paper to Specific Students</h5>
            <label>Enter Register Numbers (comma separated):</label>
            <textarea
              rows="4"
              className="form-control"
              value={registerNumbers}
              onChange={(e) => setRegisterNumbers(e.target.value)}
            />
            <div className="modal-buttons mt-3">
              <button className="btn btn-success" onClick={handleSpecificPost}>
                Post
              </button>
              <button className="btn btn-danger" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )

}

export default Aptitudescheduleexam