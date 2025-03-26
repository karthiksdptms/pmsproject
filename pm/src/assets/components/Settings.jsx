import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Aptitude.css";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { Modal, Button,Row,Col,Form } from "react-bootstrap";
import axios from "axios";
import "./Settings.css"
import Swal from "sweetalert2";
function Settings() {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newScore, setNewScore] = useState("");

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/category/getcategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories();
    }
  }, [isModalOpen]);

  // Add New Category
  // Add New Category
const handleAddCategory = async () => {
  if (!newCategory || newScore === "") {
    Swal.fire("Error", "Please fill in all fields", "error");
    return;
  }

  const scoreValue = parseFloat(newScore);

 
  if (isNaN(scoreValue) || scoreValue < 0) {
    Swal.fire("Error", "Please enter a valid score", "error");
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/api/category/add-category", {
      name: newCategory,
      scoreValue,
    });
    Swal.fire("Success", "Category added successfully!", "success");
    setNewCategory("");
    setNewScore("");
    fetchCategories();
  } catch (error) {
    Swal.fire("Error", "Failed to add category", "error");
  }
};


  const handleDeleteCategory = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/category/delete-category/${id}`);
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          fetchCategories();
        } catch (error) {
          Swal.fire("Error", "Failed to delete category", "error");
        }
      }
    });
  };
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
          to="/Maindashboard"
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
              Settings{" "}
            </h2>
          </div>
        </Link>
        <div className="menu5">
          
                    <div>
                      
                      <Link to="/Maindashboard/Settingsfilters" style={{textDecoration:"none",width:"20px"}}> <div className='sce'>
                                    <h4 style={{position:"relative",top:"30px",right:"40px"}}>filters</h4>
                                    <i className="bi bi-filter" style={{fontSize:"50px",position:"relative",left:"80px",bottom:"30px",color:'rgb(132, 65, 136)'}}></i>
                                </div></Link></div>
                                <div style={{fontSize:"50px",position:"relative",left:"20px",color:'rgba(11,132,164,255)'}}> <Link to="/Maindashboard/Settingsstaffs" style={{textDecoration:"none",width:"250px"}}> <div className='att'>
                                    <h4 style={{position:"relative",top:"30px",right:"40px"}}>Staffs</h4>
                                    <i className="bi bi-microsoft-teams" style={{fontSize:"50px",position:"relative",left:"80px",bottom:"30px",color:"rgb(114, 107, 169)"}}></i>
                                </div></Link></div>
                              <div className='rep' style={{position:'relative',left:"40px"}} onClick={() => setIsModalOpen(true)}>
                                                <h4 style={{position:"relative",top:"30px",right:"40px"}}>Scores</h4>
                                                <i className="bi bi-bar-chart-line-fill" style={{fontSize:"60px",position:"relative",left:"70px",bottom:"30px",color:"rgb(181, 113, 149)"}}></i>
                                            </div>
                               
                                
         
        </div>
      </div>
   
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Categories & Scores</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {categories.map((category) => (
            <Row key={category._id} className="mb-3 align-items-center">
              <Col xs={6}>
                <Form.Control type="text" value={category.name} readOnly />
              </Col>
              <Col xs={4}>
                <Form.Control type="number" value={category.scoreValue} readOnly />
              </Col>
              <Col xs={2}>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          ))}

          <hr />
          <h5 className="mb-3">Add New Category:</h5>
          <Row className="mb-3">
            <Col xs={6}>
              <Form.Control
                type="text"
                placeholder="Enter Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Col>
            <Col xs={4}>
              <Form.Control
                type="number"
                placeholder="Enter Score Value"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
              />
            </Col>
            <Col xs={2}>
              <Button variant="success" onClick={handleAddCategory}>
                Add
              </Button>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Settings;
