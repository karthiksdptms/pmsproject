import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Aptitude.css";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

import { Button, Table,Modal,Form } from "react-bootstrap";

function Settingsstaffs() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalll, setShowModalll] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    profileImage: "",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/admin/get-admins");
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      password: "", 
      profileImage: admin.profileImage,
    });
    setShowModalll(true);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0],
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("profileImage", formData.profileImage);

    try {
      await axios.post(
        "http://localhost:3000/api/admin/add-admin",
        formDataToSend
      );
      setShowModal(false);
     window.location.reload()
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };  

  const handleDeleteAdmin = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Staff?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/admin/delete-admin/${id}`
      );
  
      if (response.status === 200) {
        alert("Staff deleted successfully!");
       
        setAdmins(admins.filter((admin) => admin._id !== id));
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin. Please try again.");
    }
  };
  
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("role", formData.role);
  
    
    if (formData.password) {
      formDataToSend.append("password", formData.password);
    }
  
  
    if (formData.profileImage && formData.profileImage.name) {
      formDataToSend.append("profileImage", formData.profileImage);
    }
  
    try {
      if (selectedAdmin) {
        
        const response = await axios.put(
          `http://localhost:3000/api/admin/edit-admin/${selectedAdmin._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (response.status === 200) {
          alert("Admin updated successfully!");
          setAdmins(
            admins.map((admin) =>
              admin._id === selectedAdmin._id ? response.data.updatedAdmin : admin
            )
          );
        }
      }
  
      setShowModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update admin. Please try again.");
    }
  };
  

  const totalRecords = admins?.length || 0;

      const [currentPage, setCurrentPage] = useState(1);
      const [rowsPerPage, setRowsPerPage] = useState(10);
      const handleRowsPerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
          setRowsPerPage(value);
          setCurrentPage(1);
        }
      };
    
      const totalPages = Math.ceil(admins?.length || 0 / rowsPerPage);
    
      const startIdx = (currentPage - 1) * rowsPerPage;
      const displayedData = admins?.slice(startIdx, startIdx + rowsPerPage) || [];

    

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
          to="/Maindashboard/Settings"
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
                zIndex:'100'
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
                  zIndex:'100'
              }}
            >
              Staffs{" "}
            </h2>
          </div>
        </Link>
        
        <div  style={{position:'relative',bottom:'80px'}}>
        <button className="btn  " onClick={() => setShowModal(true)} style={{ marginRight: "50px", position: "relative", left: "1080px", top: "60px" }}><i className="bi bi-plus-circle-fill" style={{ fontSize: "40px", color: "blue" }}></i></button>

        <h4 className="mb-4" style={{ position: "relative", top: "70px", left: "50px", width: '350px' }}>
                Total no of Staffs: <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>{totalRecords}</span>
              </h4>


              <div
                className="flex justify-right items-center gap-4 mt-4 "
                style={{ position: "relative", left: "800px", bottom: "-20px", width: '460px' }}
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
        <div className="container mt-2" style={{ position: "relative", right: "0px", top: "50px" }}>
        <div style={{
                position: "relative",
                top: "20px",
                left: "-20px",
                overflowY: "auto",


                maxHeight: "800px",
              }}>
                <div style={{position:"relative",left:"-230px"}}>
          <Table striped bordered hover className="mt-3" >
            <thead>
              <tr>
              <th>Name</th>
                <th>Email</th>
                <th>Profile Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>
                    {admin.profileImage ? (
                      <img
                         src={admin.profileImage ? `http://localhost:3000/${admin.profileImage}` : "/default-avatar.png"}
                  alt="Profile"
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEditClick(admin)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteAdmin(admin._id)}
                        >
                          Delete
                        </button>
                      </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
          </div>
        </div>
        </div>
       
      
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="profileImage" className="mt-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="profileImage"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
              Add Staff
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showModalll} onHide={() => setShowModalll(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>{selectedAdmin ? "Edit Admin" : "Add Admin"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form onSubmit={handleFormSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="text"
          className="form-control"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter new password (leave blank to keep existing password)"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="role" className="form-label">
          Role
        </label>
        <select
          className="form-control"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
        >
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="profileImage" className="form-label">
          Profile Image
        </label>
        <input
          type="file"
          className="form-control"
          id="profileImage"
          name="profileImage"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit" className="btn btn-success">
        {selectedAdmin ? "Update Admin" : "Add Admin"}
      </button>
    </form>
  </Modal.Body>
</Modal>

      
    </>
  );
}

export default Settingsstaffs;
