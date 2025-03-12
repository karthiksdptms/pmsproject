import React, { useEffect, useState } from "react";
import './Studentprofile.css'
import Studenttopbar from "./Studenttopbar";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../assets/context/authContext";
import axios from "axios";
import Loading from "../assets/components/Loading";
import { HiComputerDesktop } from "react-icons/hi2";
import { MdOutlineSmsFailed } from "react-icons/md";

import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";

function Studentprofile() {
    const { user } = useAuth();
    const [student, setStudent] = useState({ offers: [], role: "student" });


    const [loading, setLoading] = useState(true);
    const [showw, setShoww] = useState(false);


    const fetchStudent = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/api/student/getone/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStudent(response.data.student);
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
    


    
    const handleEdit = () => {
        setShoww(true);
    };
    

    const handleOfferChange = (index, e) => {
        const { name, value } = e.target;
        setStudent((prev) => {
          const updatedOffers = [...prev.offers];
          updatedOffers[index] = { ...updatedOffers[index], [name]: value };
          return { ...prev, offers: updatedOffers };
        });
      };

     
  const addOffer = () => {
    setStudent({
      ...student,
      offers: [...student.offers, { offerno: "", company: "", designation: "", package: "", }],
    });
  };
      

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setStudent((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

    const handleSubmitt = async (e) => {
        e.preventDefault();
    
    
        const formData = new FormData();
    
    
        Object.keys(student).forEach((key) => {
          if (key !== "resume" && key !== "offers" && key !== "image" && key !== "offerpdf") {
            formData.append(key, student[key]);
          }
    
        });
        formData.append("role", "student"); 

    
        if (student.resume) {
          formData.append("resume", student.resume);
        } else {
          formData.append("resume", "");
        }
        if (student.image) {
          formData.append("image", student.image);
        } else {
          formData.append("image", "");
        }
    
    
        student.offers.forEach((offer, index) => {
          formData.append(`offers[${index}][offerno]`, offer.offerno);
          formData.append(`offers[${index}][company]`, offer.company);
          formData.append(`offers[${index}][designation]`, offer.designation);
          formData.append(`offers[${index}][package]`, offer.package);
        });
    
        if (student.offerpdf) {
          formData.append("offerpdf", student.offerpdf);
        } else {
          formData.append("offerpdf", "");
        }
    
    
        console.log("Sending FormData:", Object.fromEntries(formData.entries()));
        console.log(formData)
        try {
          const token = localStorage.getItem("token");
    
          const response = await axios.put(
            `http://localhost:3000/api/student/edit/${student._id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          if (response.data.success) {
            alert("Student Updated Successfully");
    
            setStudent(response.data);
            setShoww(false);
            window.location.reload();
    
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error("Edit Error:", error);
          alert("Failed to Edit Student");
        }
    
    
      };
      
      const deleteOffer = (index) => {
        if (!student.offers) return; 
    
        const updatedOffers = student.offers.filter((_, i) => i !== index);
        setStudent((prev) => ({ ...prev, offers: updatedOffers }));
    };
    


      

    return (
        <>

            <div className="had">
                <Link
                    to="/Studentdashboard"
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
                                width: "200px",
                            }}
                        >
                            My Profile              </h2>
                    </div>
                </Link>
                <button  className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEdit(user._id)} style={{position:"relative",left:"1100px"}}>edit</button>
                {loading ? (
                    <Loading />
                ) : (
                    <div className="main" style={{ width: "1200px", height: "700px", position: "relative", top: "40px" }}>

                        <div className="pic" style={{
                            width: "320px", height: "590px", backgroundColor: "", zIndex: "10px", position: "relative",
                            top: "20px", left: "15px", borderRadius: "10px"
                        }}>   <div className="profile" ><img
                            src={`http://localhost:3000/${user.profileImage}`}
                            alt="Profile"
                            className="rounded-circle"
                            style={{ width: "170px", height: "170px", objectFit: "cover", position: "relative", right: '1.5px', bottom: '1.5px' }}
                        /></div>
                            <br />
                            <br />
                            <div style={{ justifyItems: "center", alignItems: "center", position: "relative", top: '10px' }}>
                                <h4 style={{}}>{student.name}  <br /></h4>
                                <h4 style={{}}> {student.department}  <br /></h4>
                                <h4 style={{}}>{student.registration_number}</h4>
                            </div>

                        </div>
                        <div className="cont" style={{
                            width: "800px", height: "590px", backgroundColor: "", zIndex: "10px", position: "relative", borderRadius: "10px",
                            bottom: "570px", left: "360px"
                        }}>
                            <h3 style={{ position: "relative", left: "20px", top: "10px" }}>Informations:</h3>
                            <div className="cgpa" style={{ position: "relative", left: "30px", top: "20px" }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900" }}>CGPA</p>
                                <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "250px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>{student.cgpa} </p></div>

                            <div className="batch" style={{ position: "relative", left: "400px", bottom: "67px", width: '300px' }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900", width: '300px' }}>Batch</p>
                                <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "250px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>{student.batch} </p></div>

                            <div className="email" style={{ position: "relative", left: "30px", bottom: "50px" }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900" }}>Email</p>
                                <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "620px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>{student.email}</p></div>

                            <div className="phoneno" style={{ position: "relative", left: "30px", bottom: "20px" }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900" }}>Phone Number</p>
                                <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "250px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>{student.phoneno}</p></div>

                            <div className="gphoneno" style={{ position: "relative", left: "400px", bottom: "106px", width: '300px' }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900" }}>Gaurdian Number</p>
                                <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "250px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>96662377892</p></div>

                            <div className="place" style={{ width: "260px", height: "133px", position: "relative", bottom: "95px", left: "70px", borderRadius: "13px" }}>
                                <h5 style={{ position: "relative", left: "90px", top: "16px", color: "rgb(45, 44, 44)" }}>Placement info</h5>
                                <HiComputerDesktop className="icccc" />
                                <br />
                                <p style={{ position: "relative", left: "122px", top: "10px", fontWeight: "800", color: "rgb(101, 100, 100)" }}>{student.placement}</p>
                            </div>

                            <div className="offer" style={{ width: "260px", height: "133px", position: "relative", bottom: "227px", left: "390px", borderRadius: "13px" }}>
                                <h5 style={{ position: "relative", left: "159px", top: "16px", color: "rgb(45, 44, 44)" }}>Arrears</h5>
                                <MdOutlineSmsFailed className="iccc" />
                                <br />
                                <p style={{ position: "relative", left: "222px", top: "10px", fontWeight: "800", color: "rgb(101, 100, 100)" }}>{student.arrears}</p>

                            </div>


                        </div>
                    </div>
                )}
            </div>
            {showw && student && (
          <div className="modal d-block" tabIndex="-1" key={user._id}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content" style={{minWidth:"100%"}}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Student Details To Create Account</h5>
                  <button type="button" className="btn-close" onClick={() => setShoww(false)}></button>
                </div>
                <div className="modal-body">
                  <form encType="multipart/form-data" method="post" onSubmit={handleSubmitt}>
                    
                    <Row>
                      <Col md={6}>
                        <label>Registration Number:<span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" name="registration_number" onChange={handleChange} required readOnly value={student.registration_number} />
                      </Col>
                      <Col md={6}>
                        <label>Name:<span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" name="name" onChange={handleChange} required readOnly value={student.name} />
                      </Col>
                    </Row>

                  
                    <Row>
                      <Col md={6}>
                        <label>Department:<span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" name="department" onChange={handleChange} required readOnly value={student.department} />
                      </Col>
                      <Col md={6}>
                        <label>Batch:<span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" name="batch" onChange={handleChange} required readOnly value={student.batch} />
                      </Col>
                    </Row>

                   
                    <Row>
                      <Col md={4}>
                        <label>SSLC(%):<span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" name="sslc" onChange={handleChange} required readOnly value={student.sslc} />
                      </Col>
                      <Col md={4}>
                        <label>HSC(%):</label>
                        <input type="text" className="form-control" name="hsc" onChange={handleChange} value={student.hsc} />
                      </Col>
                      <Col md={4}>
                        <label>Diploma(%):</label>
                        <input type="text" className="form-control" name="diploma" onChange={handleChange} value={student.diploma} />
                      </Col>
                    </Row>

                    <h6>Enter Semester wise CGPA:</h6>

                    
                    <Row>
                      {["sem1", "sem2", "sem3", "sem4"].map((sem, index) => (
                        <Col md={3} key={index}>
                          <label>{sem.toUpperCase() + ":"}</label>
                          <input
                            type="text"
                            className="form-control"
                            name={sem}
                            value={student[sem] || ""}
                            onChange={handleChange}
                          />
                        </Col>
                      ))}
                    </Row>

                   
                    <Row>
                      {["sem5", "sem6", "sem7", "sem8"].map((sem, index) => (
                        <Col md={3} key={index}>
                          <label>{sem.toUpperCase() + ":"}</label>
                          <input
                            type="text"
                            className="form-control"
                            name={sem}
                            value={student[sem] || ""}
                            onChange={handleChange}
                          />
                        </Col>
                      ))}
                    </Row>

                   
                    <Row>
                      <Col md={4}>
                        <label>CGPA:</label>
                        <input type="text" className="form-control" name="cgpa" onChange={handleChange} value={student.cgpa} />
                      </Col>
                      <Col md={4}>
                        <label>Arrears:<span style={{ color: "red" }}>*</span></label>
                        <input type="Number" className="form-control" name="arrears" onChange={handleChange} required value={student.arrears} />
                      </Col>
                      <Col md={4}>
                        <label>History of Arrears:</label>
                        <input type="Number" className="form-control" name="hoa" onChange={handleChange} value={student.hoa} />
                      </Col>
                    </Row>

                 
                    <Row>
                      <Col md={6}>
                        <label>Internships Attended:</label>
                        <input type="text" className="form-control" name="internships" onChange={handleChange} value={student.internships} />
                      </Col>
                      <Col md={6}>
                        <label>Certifications Completed:</label>
                        <input type="text" className="form-control" name="certifications" onChange={handleChange} value={student.certifications} />
                      </Col>
                    </Row>

                  
                    <Row>
                      <Col md={6}>
                        <label>Patents/Publications Filed:</label>
                        <input type="text" className="form-control" name="patentspublications" onChange={handleChange} value={student.patentspublications} />
                      </Col>
                      <Col md={6}>
                        <label>Achievements:</label>
                        <input type="text" className="form-control" name="achievements" onChange={handleChange} value={student.achievements} />
                      </Col>
                    </Row>

                   
                    <Row>
                      <Col md={6}>
                        <label>Enter Additional Languages Known:</label>
                        <input type="text" className="form-control" name="language" onChange={handleChange} value={student.language} />
                      </Col>
                      <Col md={6}>
                        <label>Area of Interest:</label>
                        <input type="text" className="form-control" name="aoi" onChange={handleChange} value={student.aoi} />
                      </Col>
                    </Row>

                   
                    <div className="mb-3">
                      <label>Email:<span style={{ color: "red" }}>*</span></label>
                      <input type="email" className="form-control" name="email" onChange={handleChange} required value={student.email} readOnly />
                    </div>
                    <div className="mb-3">
                      <label>password:<span style={{ color: "red" }}>*</span></label>
                      <input type="text" className="form-control" name="password" onChange={handleChange} required value={student.password} />
                    </div>
                    
                    <div className="mb-3">
                      <label>Profile Image:</label>
                      <input
                        type="file"
                        className="form-control"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      {student.profileImage && (
                        <img
                          src={`http://localhost:3000/${student.profileImage}`}
                          alt="Profile"
                          style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                        />
                      )}
                    </div>

                    <div className="mb-3">
                      <Row>
                        <Col md={6}>
                          <label>Address:<span style={{ color: "red" }}>*</span></label>
                          <input type="text" className="form-control" name="address" onChange={handleChange} required value={student.address} />
                        </Col>
                        <Col md={6}>
                          <label>Phone Number:<span style={{ color: "red" }}>*</span></label>
                          <input type="text" className="form-control" name="phoneno" onChange={handleChange} required value={student.phoneno} />
                        </Col>
                      </Row>
                    </div>

                   
                    <div className="mb-3">
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <label>Resume:</label>
                            <input type="file" className="form-control" name="resume" onChange={handleChange} accept=".pdf" />
                            {student.resume && (
                              <img
                                src={`http://localhost:3000/${student.resume}`}
                                alt=""
                                style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                              />
                            )}
                          </div>
                        </Col>
                        <Col md={6}>
                          <label>Placement:</label>
                          <select className="form-control" name="placement" onChange={handleChange}>
                            <option value="">Select:</option>
                            <option value="Placed">Placed</option>
                            <option value="Not-placed">Not-placed</option>
                          </select> </Col>

                      </Row>
                    </div>


                    <h5>Enter Placements Offers:</h5>
                    {student.offers.map((offer, index) => (
                      <div key={index} className="mb-3 border p-3">
                        <div className="d-flex justify-content-between">


                        </div>
                        <input type="text" className="form-control mb-2" name="offerno" placeholder="offer number" value={offer.offerno} onChange={(e) => handleOfferChange(index, e)} />
                        <input type="text" className="form-control mb-2" name="company" placeholder="Company" value={offer.company} onChange={(e) => handleOfferChange(index, e)} />
                        <input type="text" className="form-control mb-2" name="designation" placeholder="Designation" value={offer.designation} onChange={(e) => handleOfferChange(index, e)} />
                        <input type="text" className="form-control mb-2" name="package" placeholder="Package" value={offer.package} onChange={(e) => handleOfferChange(index, e)} />

                        <button type="button" className="btn  btn-sm" style={{ position: "relative", left: "650px" }} onClick={() => deleteOffer(index)}>
                          <i className="bi bi-x-circle" style={{ fontSize: "30px", color: "red" }}></i>
                        </button>
                      </div>
                    ))}

                    <button type="button" tyle={{ backgroundColor: "white", border: "none" }} className="btn  mb-3" onClick={addOffer}> <i className="bi bi-plus-circle-fill" style={{ fontSize: "40px", color: "grey" }}></i>
                    </button>
                    <br />
                    <div className="mb-3">
                      <label>Insert the offerletters(pdf,combine all letters as a single pdf):</label>
                      <input type="file" className="form-control" name="offerpdf" onChange={handleChange} accept="*" />
                      {student.offerpdf && (
                        <img
                          src={`http://localhost:3000/${student.offerpdf}`}
                          alt=""
                          style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                        />
                      )}

                    </div>

                    <div className="modal-footer">

                      <button type="button" className="btn btn-danger" onClick={() => setShoww(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success" >
                        Save
                      </button>
                    </div>

                  </form>
                </div>

              </div>
            </div>
          </div>
        )}


        </>


    );
}
export default Studentprofile