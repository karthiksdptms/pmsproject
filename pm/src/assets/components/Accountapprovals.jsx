import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import './Aptitude.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";


import Loading from "./Loading";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";


function Accountsapprovals() {

  const [loading, setLoading] = useState(true);
  const [getstudents, setgetstudents] = useState([])
  const [showw, setShoww] = useState(false);
  const [stdloading, setstdloading] = useState(false)
  const [preview, setPreview] = useState("")



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
    patents: "",
    publications: "",
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


  useEffect(() => {
    const fetchstudents = async () => {
      setLoading(true)
      try {
        const responnse = await axios.get("http://localhost:3000/api/students/approved-students", {

        }
        )

        if (responnse.data.success) {

          const data = await responnse.data.students.map((std, index) => ({
            _id: std._id,
            registration_number: std.registration_number,
            name: std.name,
            department: std.department,
            batch: std.batch,
            profileImage: std.userId.profileImage,
            email: std.userId.email,
            sslc: std.sslc,
            hsc: std.hsc,
            achievements: std.achievements,
            index: index + 1,
            diploma: std.diploma,
            sem1: std.sem1,
            sem2: std.sem2,
            sem3: std.sem3,
            sem4: std.sem4,
            sem5: std.sem5,
            sem6: std.sem6,
            sem7: std.sem7,
            sem8: std.sem8,
            cgpa: std.cgpa,
            arrears: std.arrears,
            internships: std.internships,
            certifications: std.certifications,
            password: std.password,
            role: std.role,
            publications: std.publications,
            patents: std.patents,
            hoa: std.hoa,
            language: std.language,
            aoi: std.aoi,
            address: std.address,
            phoneno: std.phoneno,
            resume: std.resume,
            offerpdf: std.offerpdf,
            placement: std.placement,
            offers: std.offers,
            expassword: std.expassword,


          }))

          setgetstudents(data)
          setLoading(false)

        }

      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setstdloading(false)
      }
    }
    fetchstudents()
  }, [])


  const addOffer = () => {
    setStudent({
      ...student,
      offers: [...student.offers, { offerno: "", company: "", designation: "", package: "", offertype: "" }],
    });
  };


  const deleteOffer = (index) => {
    const updatedOffers = student.offers.filter((_, i) => i !== index);
    setStudent({ ...student, offers: updatedOffers });
  };




  const handleOfferChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOffers = [...student.offers];
    updatedOffers[index][name] = value;
    setStudent({ ...student, offers: updatedOffers });
  };


  const handleEdit = (registration_number) => {
    const selectedStudent = displayedData.find((student) => student.registration_number === registration_number);
    if (selectedStudent) {
      setStudent({
        ...selectedStudent,
        offers: selectedStudent.offers || [],
      });
      setShoww(true);
    }
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
      formData.append(`offers[${index}][offertype]`, offer.offertype);

    });


    if (student.offerpdf) {
      formData.append("offerpdf", student.offerpdf);
    } else {
      formData.append("offerpdf", "");
    }

    console.log("Sending FormData:", Object.fromEntries(formData.entries()));

    try {
      const token = localStorage.getItem("token");


      const response = await axios.put(
        "http://localhost:3000/api/students/approveedit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Student Updated Successfully");
        setStudent(response.data.updatedStudent);
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

  const handleReject = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/students/reject",
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Student rejected and removed from approval data");
        window.location.reload();

      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error rejecting student:", error);
      alert("Failed to reject student");
    }
  };




  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(getstudents.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = getstudents.slice(
    startIdx,
    startIdx + rowsPerPage
  );
  useEffect(() => {
    if (student.profileImage) {
      setPreview(`http://localhost:3000/${student.profileImage}`);
    }
  }, [student.profileImage]);
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
          to="/Maindashboard/Accounts"
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
                width: "100px",
              }}
            >
              Approval's
            </h2>
          </div>
        </Link>
        {loading ? (
          <Loading />
        ) : (
          <div className="table-responsive" style={{ position: "relative", top: '60px' }}>


            <h4 className="" style={{ width: "350px", position: "relative", top: "20px" }}>
              Total Approvals Pending: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 4px', borderRadius: '4px', color: "white", zIndex: "100" }}>{getstudents.flat().length}</span>
            </h4>
            <div
              className="flex justify-right items-center gap-4 mt-4 "
              style={{ position: "relative", left: "700px", bottom: "20PX" }}
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
            <table className="table table-striped table-bordered table-hover" style={{
              position: "relative",
              left: "12px",
              bottom: "0px",
            }}>
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Profile</th>
                  <th>Registration Number</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Batch</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center " style={{ color: "red" }}>
                      No approvals pending
                    </td>
                  </tr>
                ) : (
                  displayedData.map((student) => (
                    <tr key={student._id}>
                      <td>{student.index}</td>
                      <td>
                        {student.profileImage ? (
                          <img
                            src={`http://localhost:3000/${student.profileImage}`}
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
                      <td>{student.batch}</td>
                      <td>{student.email}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEdit(student.registration_number)}
                        >
                          Check
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(student.email)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>



          </div>
        )}
        {showw && student && (
          <div className="modal d-block" tabIndex="-1" key={student._id}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content" style={{ minWidth: "100%" }}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Student Details To Create Account</h5>
                  <button type="button" className="btn-close" onClick={() => setShoww(false)}></button>
                </div>
                <div className="modal-body">
                  <form encType="multipart/form-data" onSubmit={handleSubmitt}>

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
                        <label>Patents Field:</label>
                        <input type="text" className="form-control" name="patents" onChange={handleChange} value={student.patents} />
                      </Col>
                      <Col md={6}>
                        <label>Publications Field:</label>
                        <input type="text" className="form-control" name="publications" onChange={handleChange} value={student.publications} />
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
                      <label>password:(password given by student: {student.expassword})<span style={{ color: "red" }}>*</span></label>
                      <input type="text" className="form-control" name="password" onChange={handleChange} required value={student.password} />
                    </div>
                    <div className="mb-3">
                      <label>role:<span style={{ color: "red" }}>*</span></label>
                      <select className="form-control" name="role" onChange={handleChange} required value={student.role}>

                        <option value="">Select Role</option>
                        <option value="student">student</option>
                      </select>
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
                              <a href={`http://localhost:3000/${student.resume}`} target="_blank" rel="noopener noreferrer">
                                View Resume
                              </a>
                            )}
                          </div>
                        </Col>
                        <Col md={6}>
                          <label>Placement:</label>
                          <select className="form-control" name="placement" onChange={handleChange} value={student.placement} >
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
                        <input type="text" className="form-control mb-2" name="offertype" placeholder="offertype(Elite,Superdream,Dream,Fair)" value={offer.offertype} onChange={(e) => handleOfferChange(index, e)} />
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
                        <a href={`http://localhost:3000/${student.offerpdf}`} target="_blank" rel="noopener noreferrer">
                          View Offer Letter
                        </a>
                      )}

                    </div>

                    <div className="modal-footer">

                      <button type="button" className="btn btn-danger" onClick={() => setShoww(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success" >
                        Approve
                      </button>
                    </div>

                  </form>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

    </>
  );
}

export default Accountsapprovals;
