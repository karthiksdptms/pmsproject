import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';



ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);


import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaSyringe, FaHeartbeat } from "react-icons/fa";
import './Adminsummary.css';
import axios from "axios"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


function Adminsummmary() {

  const [text, setText] = useState("");
  const [boxContent, setBoxContent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModall, setShowModall] = useState(false);



  const boxRef = useRef(null);
  const scrollIntervalRef = useRef(null);


  const fetchTexts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students/texts`);
      setBoxContent(response.data);
    } catch (error) {
      console.error("Error fetching texts:", error);
    }
  };


  const handleAddText = async () => {
    if (text.trim() !== "") {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/students/add-text`, {
          text,
          createdAt: new Date().toISOString(),
        });
        setBoxContent([...boxContent, response.data]);
        setText("");
        setShowModal(false);
      } catch (error) {
        console.error("Error adding text:", error);
      }
    }
  };
  const handleDeleteText = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/students/delete-text/${id}`);
      const updatedContent = boxContent.filter((item) => item._id !== id);
      setBoxContent(updatedContent);
    } catch (error) {
      console.error("Error deleting text:", error);
    }
  };



  const startAutoScroll = () => {
    if (boxRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (boxRef.current.scrollTop < boxRef.current.scrollHeight - boxRef.current.clientHeight) {
          boxRef.current.scrollTop += 1;
        } else {
          boxRef.current.scrollTop = 0;
        }
      }, 50);
    }
  };



  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
  };

  useEffect(() => {
    fetchTexts();
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const [hovered, setHovered] = useState(null);
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.ctx;
      const gradient = chart.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "rgba(167, 109, 246, 0.7)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");


      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            backgroundColor: gradient,
          },
        ],
      }));
    }
  }, []);


  const chartRef = useRef(null);


  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Placed",
        data: [],
        borderColor: "#a76df6",
        backgroundColor: "rgba(167, 109, 246, 0.2)",
        Filler: true,
        pointRadius: 5,
        pointBackgroundColor: "#a76df6",
        tension: 0.4,
      },
    ],
  });

  const [editableData, setEditableData] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");


  const fetchChartData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/charts/getChartData`);
      if (response.data) {
        setChartData({
          labels: response.data.labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: response.data.data,
            },
          ],
        });
        setEditableData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);


  const handleChange = (index, value) => {
    const updatedData = [...editableData];
    updatedData[index] = parseInt(value) || 0;
    setEditableData(updatedData);
  };

  const addNewDatapoint = () => {
    if (newLabel && newValue) {
      setChartData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, newLabel],
        datasets: [
          {
            ...prevData.datasets[0],
            data: [...editableData, parseInt(newValue)],
          },
        ],
      }));
      setEditableData([...editableData, parseInt(newValue)]);
      setNewLabel("");
      setNewValue("");
    }
  };


  const deleteDatapoint = (index) => {
    const updatedLabels = [...chartData.labels];
    const updatedData = [...editableData];

    updatedLabels.splice(index, 1);
    updatedData.splice(index, 1);

    setChartData({
      labels: updatedLabels,
      datasets: [
        {
          ...chartData.datasets[0],
          data: updatedData,
        },
      ],
    });

    setEditableData(updatedData);
  };


  const updateChartData = async () => {
    const updatedChartData = {
      labels: chartData.labels,
      data: editableData,
    };

    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: editableData,
        },
      ],
    });


    try {
      await axios.post(`${API_BASE_URL}/api/charts/saveChartData`, updatedChartData);
      alert("Chart data saved successfully! ");
      setShowModal(false)
    } catch (error) {
      console.error("Error saving chart data:", error);
    }
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };



  const patientData = [
    { name: "Placed Students", value: 4500, color: "purple", icon: <FaUser /> },
    { name: "Internships", value: 5000, color: "orange", icon: <FaSyringe /> },
    { name: "Not-Placed students", value: 3000, color: "gold", icon: <FaHeartbeat /> },
  ];
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1).getDay();

  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<span key={`empty-${i}`} className="calendar-day invisible"></span>);
  }


  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <span
        key={day}
        className={`calendar-day ${day === currentDay ? "bg-primary text-white rounded-circle" : ""}`}
      >
        {day}
      </span>
    );
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/students/students-with-score`
      );
      console.log("Fetched Students:", response.data); 
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setLoading(false);
    }
  };



  const filterStudents = (category) => {
    let filtered = [];
    let title = "";

    switch (category) {
      case "platinum":
        filtered = students.filter(
          (s) => s.cgpa >= 9 && s.cgpa <= 10 && s.score >= 9 && s.score <= 10
        );
        title = "Platinum - CGPA & Score: 9 - 10";
        break;
      case "gold":
        filtered = students.filter(
          (s) => s.cgpa >= 8 && s.cgpa <= 8.9 && s.score >= 8 && s.score <= 8.9
        );
        title = "Gold - CGPA & Score: 8 - 8.9";
        break;
      case "silver":
        filtered = students.filter(
          (s) => s.cgpa >= 7 && s.cgpa <= 7.9 && s.score >= 7 && s.score <= 7.9
        );
        title = "Silver - CGPA & Score: 7 - 7.9";
        break;
      default:
        break;
    }

    setFilteredData(filtered);
    setModalTitle(title);
    setShowModalll(true);
  };
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [showModalll, setShowModalll] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);



  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(students.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = students.slice(
    startIdx,
    startIdx + rowsPerPage
  );
  return (

    <div className="toppp">
      <h2
        style={{
          fontSize: "32px",
          position: "relative",
          bottom: "30px",
          left: "40px",
          height: "0px"
        }}
      >
        Administrative Dashboard
      </h2>
      <div style={{

        position: "relative",
        right: '120px',
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        width: "800px",
        margin: "0 auto",
        marginTop: "20px",
        marginBottom: "10px",
        gap: "0px",


      }}>
        <div className="abc" style={{
          boxShadow: "0px 4px 8px rgba(34, 34, 34, 0.5)",

          width: "180px",
          height: "150px",
          border: "0.5px solid rgb(176, 183, 228)",
          borderRadius: "12px",
          backgroundColor: "rgb(140, 150, 212)"
        }}>   <i className="bi bi-bookmarks-fill" style={{ fontSize: "30px", color: "white", position: "relative", left: "10px", top: "15px" }}></i>
          <br />
          <h5 style={{ position: 'relative', left: '50px', top: '35px', color: "white", boxShadow: "" }}>70</h5>

          <h5 style={{ position: 'relative', left: '47px', top: '30px', color: "white" }}>Courses</h5>
        </div>

        <div className="abc" style={{
          boxShadow: "0px 4px 8px rgba(34, 34, 34, 0.5)",
          width: "180px",
          height: "150px",
          border: "0.5px solid rgb(234, 147, 193)",
          borderRadius: "12px",
          backgroundColor: "rgb(231, 168, 201)"
        }}><i className="bi bi-mortarboard-fill" style={{ fontSize: "36px", color: "white", position: "relative", left: "10px", top: "15px" }}></i>
          <br />
          <h5 style={{ position: 'relative', left: '50px', top: '30px', color: "white" }}>7500</h5>

          <h5 style={{ position: 'relative', left: '47px', top: '25px', color: "white" }}>Students</h5>

        </div>

        <div className="abc" style={{
          boxShadow: "0px 4px 8px rgba(34, 34, 34, 0.5)",
          width: "180px",
          height: "150px",
          border: "0.5px solid rgb(191, 138, 222)",
          borderRadius: "12px",
          backgroundColor: "rgb(193, 155, 215)"
        }}><i className="bi bi-clipboard-plus-fill" style={{ fontSize: "30px", color: "white", position: "relative", left: "10px", top: "15px" }}></i>
          <br />
          <h5 style={{ position: 'relative', left: '50px', top: '35px', color: "white" }}>4500</h5>

          <h5 style={{ position: 'relative', left: '47px', top: '30px', color: "white" }}>Placed</h5>
        </div>

        <div className="abc" style={{
          boxShadow: "0px 4px 8px rgba(34, 34, 34, 0.5)",
          width: "180px",
          height: "150px",
          border: "0.5px solid rgb(83, 171, 181)",
          borderRadius: "12px",
          backgroundColor: "rgb(130, 188, 195)"
        }}><i className="bi bi-server" style={{ fontSize: "30px", color: "white", position: "relative", left: "10px", top: "15px" }}></i>
          <br />
          <h5 style={{ position: 'relative', left: '50px', top: '35px', color: "white" }}>256</h5>

          <h5 style={{ position: 'relative', left: '47px', top: '30px', color: "white" }}>Faculties</h5>
        </div>

      </div>
      <div
        className="border rounded shadow-sm text-center p-2"
        style={{ width: "260px", height: "300px", fontSize: "12px", background: "rgb(250, 245, 250)", position: 'relative', bottom: "159px", left: "930px", border: "0.25px solid rgb(228, 189, 231)", boxShadow: "10px 10px 8px 10px rgba(1, 1, 1, 0.5)" }}
      >
        <h6 className="mb-2">{currentMonth} {currentYear}</h6>
        <div className="d-flex justify-content-between mb-1">
          {weekDays.map((day) => (
            <span key={day} className="fw-bold text-secondary small" style={{ width: "14.2%" }}>
              {day}
            </span>
          ))}
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          {calendarDays}
        </div>
      </div>

      <br />

      <div className="container mt-50" style={{ height: '200px' }} >
        <div className="row" style={{ position: "relative", left: "50px", bottom: "310px", height: '500px' }}>

          <div className="d-flex flex-column ">
            <div style={{}}><h5 style={{ color: "rgb(117, 115, 115)" }}>Announcements</h5></div>
            <div
              ref={boxRef}
              className="border rounded p-3 mb-3 overflow-auto"
              style={{
                width: "400px",
                height: "400px",
                backgroundColor: "rgb(255, 255, 255)",
                overflowY: "scroll",
                display: "flex",
                flexDirection: "column",
              }}
            >

              {boxContent.map((item, index) => (
                <div
                  key={index}
                  className="text-dark rounded p-2 mb-2"
                  style={{
                    width: "100%",
                    wordBreak: "break-word",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    border: "1px solid #ddd",
                    backgroundColor: ""
                  }}
                >
                  <div style={{ color: 'rgb(51, 75, 137)' }} > {item.text}</div>
                  <small className="text-muted">
                    {new Date(item.createdAt).toLocaleString()}
                  </small>
                  <button
                    className="btn btn-sm ms-2"
                    onClick={() => handleDeleteText(item._id)}
                    style={{
                      position: "relative",
                      left: '300px',
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "15px",
                    }}
                  >
                    X
                  </button>
                </div>
              ))}

            </div>


            <button

              className="btn btn-primary mb-3"
              onClick={() => setShowModall(true)}
              style={{ width: "30px", height: "30px", borderRadius: "50%", fontSize: "20px", position: "relative", left: '350px', bottom: "6px" }}
            >
              <span style={{ position: 'relative', right: "4px", bottom: "5px" }}>+</span>
            </button>

            {/* Modal using react-bootstrap */}
            <Modal show={showModall} onHide={() => setShowModall(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Add Announcement</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="textInput">

                    <Form.Control
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter message..."
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleAddText}>
                  Add
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

          <div className="container mt-5" style={{ width: "400px", height: '600px', position: 'relative', bottom: '540px', left: '50px' }}>
            <h5 style={{ color: "rgb(117, 115, 115)" }}>Placement Summary</h5>
            <div className="card p-4 shadow-sm">

              <Line ref={chartRef} data={chartData} options={options} />

            </div>
            <button className="mt-3 btn btn-primary " style={{ width: "50px", position: "relative", left: '310px', height: '20px' }} onClick={() => setShowModal(true)}>
              <span style={{ fontSize: '13px', position: 'relative', bottom: '10px' }}>Edit</span>
            </button>


            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Edit placement Data</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                {editableData.map((value, index) => (
                  <div key={index} className="mb-2 d-flex align-items-center">
                    <label className="me-2">{chartData.labels[index]}:</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="form-control me-2"
                      style={{ width: "100px" }}
                    />
                    <button className="btn btn-danger btn-sm" onClick={() => deleteDatapoint(index)}>
                      Delete
                    </button>
                  </div>
                ))}

                <h5 className="mt-4">Add New Datapoint:</h5>
                <div className="d-flex mb-3">
                  <input
                    type="text"
                    placeholder="Enter Month"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="form-control me-2"
                  />
                  <input
                    type="number"
                    placeholder="Enter Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="form-control me-2"
                  />
                  <button className="btn btn-success" onClick={addNewDatapoint}>
                    Add
                  </button>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={updateChartData}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>

      </div>
      <div className="container mt-5 text-center" style={{ position: 'relative', bottom: '250px', left: '100px', width: '500px' }}>
        <h5 className="mb-4" style={{ color: "rgb(117, 115, 115)" }}>
          Leader Boards
        </h5>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="d-flex justify-content-center gap-4 mb-5">
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => filterStudents("platinum")}
            >
              🏆 Platinum
            </button>
            <button
              className="btn btn-outline-warning btn-lg"
              onClick={() => filterStudents("gold")}
            >
              🥇 Gold
            </button>
            <button
              className="btn btn-outline-primary btn-lg"
              onClick={() => filterStudents("silver")}
            >
              🥈 Silver
            </button>
          </div>
        )}


        {showModalll && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-xl" >
              <div className="modal-content" style={{ width: '100%' }}>
                <div className="modal-header">
                  <h5 className="modal-title">{modalTitle}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModalll(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {filteredData.length === 0 ? (
                    <p className="text-center">No records found!</p>
                  ) : (
                    <table className="table table-striped table-bordered" style={{ position: "relative", left: "-20px", width: '1100px' }}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Profile Image</th>
                          <th>Registration No</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>CGPA</th>
                          <th>Score</th>
                          <th>Offers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((student, index) => (
                          <tr key={student._id}>
                            <td>{index + 1}</td>
                            <td>
                              {student.profileImage ? (
                                <img
                                  src={`${API_BASE_URL}/${student.profileImage}`}
                              alt="Profile"
                              className="rounded-circle"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          />
                              ) : (
                              <img
                                src="/default-avatar.png"
                                alt="Default Profile"
                                className="rounded-circle"
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              />
                        )}

                            </td>
                            <td>{student.registration_number}</td>
                            <td>{student.name}</td>
                            <td>{student.department}</td>
                            <td>{student.cgpa}</td>
                            <td>{student.score}</td>
                            <td>
                              {student.offers?.length > 0 ? (
                                student.offers.map((offer, idx) => (
                                  <span

                                  >
                                    <i
                                      className="bi bi-bookmark-check-fill"
                                      style={{
                                        color:
                                          offer.offertype === "Elite"
                                            ? "#00bfff"
                                            : offer.offertype === "Superdream"
                                              ? "rgb(255, 215, 0)"
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModalll(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Adminsummmary;