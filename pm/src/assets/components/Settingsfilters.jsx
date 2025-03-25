import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

function Settingsfilters() {
    const [showModal, setShowModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [newDept, setNewDept] = useState("");
    const [newBatch, setNewBatch] = useState("");
    const [batches, setBatches] = useState([]);
    const [showBatchModal, setShowBatchModal] = useState(false);

    const [showAOIModal, setShowAOIModal] = useState(false);
    const [aois, setAOIs] = useState([]);
    const [newAOI, setNewAOI] = useState("");
    
  
    useEffect(() => {
        fetchDepartments();
        fetchBatches();
        fetchAOIs(); 
      }, []);
      
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/filters/getdepartments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
  
   
    const handleAddDepartment = async () => {
      if (newDept.trim() === "") return;
  
      try {
        const response = await axios.post("http://localhost:3000/api/filters/adddepartments", {
          name: newDept,
        });
        setDepartments([...departments, response.data]); 
        setNewDept("");
      } catch (error) {
        console.error("Error adding department:", error);
      }
    };
  
    
    const handleDeleteDepartment = async (id) => {
      try {
        await axios.delete(`http://localhost:3000/api/filters/deletedepartments/${id}`);
        setDepartments(departments.filter((dept) => dept._id !== id)); 
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    };


    const fetchBatches = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/filters/getbatch");
          setBatches(response.data);
        } catch (error) {
          console.error("Error fetching batches:", error);
        }
      };

      const handleAddBatch = async () => {
        if (newBatch.trim() === "") return;
    
        try {
          const response = await axios.post("http://localhost:3000/api/filters/addbatch", {
            batchName: newBatch,
          });
          setBatches([...batches, response.data]);
          setNewBatch("");
        } catch (error) {
          console.error("Error adding batch:", error);
        }
      };   
      const handleDeleteBatch = async (id) => {
        try {
          await axios.delete(`http://localhost:3000/api/filters/deletebatch/${id}`);
          setBatches(batches.filter((batch) => batch._id !== id));
        } catch (error) {
          console.error("Error deleting batch:", error);
        }
      };



    
const fetchAOIs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/filters/getaoi");
      setAOIs(response.data);
    } catch (error) {
      console.error("Error fetching AOIs:", error);
    }
  };
  
 
  const handleAddAOI = async () => {
    if (newAOI.trim() === "") return;
  
    try {
      const response = await axios.post("http://localhost:3000/api/filters/addaoi", {
        aoiName: newAOI,
      });
      setAOIs([...aois, response.data]);
      setNewAOI("");
    } catch (error) {
      console.error("Error adding AOI:", error);
    }
  };
  

  const handleDeleteAOI = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/filters/deleteaoi/${id}`);
      setAOIs(aois.filter((aoi) => aoi._id !== id));
    } catch (error) {
      console.error("Error deleting AOI:", error);
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
              Filters{" "}
            </h2>
          </div>
        </Link>
        <div className="menu5">
          
                    <div>
                      
                      <div className='sce' onClick={() => setShowModal(true)}>
                                    <h4 style={{position:"relative",top:"30px",right:"30px"}}>Departments</h4>
                                    <i className="bi bi-journal-album" style={{fontSize:"50px",position:"relative",left:"80px",bottom:"30px",color:'rgb(150, 79, 154)'}}></i>
                                </div>   <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Departments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
          {departments.map((dept) => (
            <Row key={dept._id} className="mb-2 align-items-center">
              <Col sm={8}>
                <Form.Control type="text" value={dept.name} readOnly />
              </Col>
              <Col sm={4}>
                <Button variant="danger" onClick={() => handleDeleteDepartment(dept._id)}>
                  Delete
                </Button>
              </Col>
            </Row>
          ))}

        
          <h5 className="mt-4">Add New Department:</h5>
          <Row className="mt-2">
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Enter Department Name"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              />
            </Col>
            <Col sm={4}>
              <Button variant="success" onClick={handleAddDepartment}>
                Add
              </Button>
            </Col>
          </Row>
        </Modal.Body>
       
      </Modal>
      <Modal
   show={showBatchModal}
   onHide={() => setShowBatchModal(false)} 
   centered
   animation={false}
>
 
  <Modal.Header closeButton>
    <Modal.Title>Edit Batches</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {batches.map((batch) => (
      <Row key={batch._id} className="mb-2 align-items-center">
        <Col sm={8}>
          <Form.Control type="text" value={batch.batchName} readOnly />
        </Col>
        <Col sm={4}>
          <Button
            variant="danger"
            onClick={() => handleDeleteBatch(batch._id)}
          >
            Delete
          </Button>
        </Col>
      </Row>
    ))}

    <h5 className="mt-4">Add New Batch:</h5>
    <Row className="mt-2">
      <Col sm={8}>
        <Form.Control
          type="text"
          placeholder="Enter Batch Name"
          value={newBatch}
          onChange={(e) => setNewBatch(e.target.value)}
        />
      </Col>
      <Col sm={4}>
        <Button variant="success" onClick={handleAddBatch}>
          Add
        </Button>
      </Col>
    </Row>
  </Modal.Body>

 
</Modal>
<Modal
    show={showAOIModal}
    onHide={() => {
     
      setShowAOIModal(false);
    }}
    centered
    animation={false}
  >
    <Modal.Header closeButton>
      <Modal.Title>Edit Area of Interest</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {aois.map((aoi) => (
        <Row key={aoi._id} className="mb-2 align-items-center">
          <Col sm={8}>
            <Form.Control type="text" value={aoi.aoiName} readOnly />
          </Col>
          <Col sm={4}>
            <Button variant="danger" onClick={() => handleDeleteAOI(aoi._id)}>
              Delete
            </Button>
          </Col>
        </Row>
      ))}

      <h5 className="mt-4">Add New Area of Interest:</h5>
      <Row className="mt-2">
        <Col sm={8}>
          <Form.Control
            type="text"
            placeholder="Enter Area of Interest"
            value={newAOI}
            onChange={(e) => setNewAOI(e.target.value)}
          />
        </Col>
        <Col sm={4}>
          <Button variant="success" onClick={handleAddAOI}>
            Add
          </Button>
        </Col>
      </Row>
    </Modal.Body>

    
  </Modal>

                                </div>

                                <div style={{fontSize:"50px",position:"relative",left:"20px",color:'rgba(11,132,164,255)'}} onClick={() => setShowBatchModal(true)}>  <div className='att' >
                                    <h4 style={{position:"relative",top:"30px",right:"40px"}}>Batch</h4>
                                    <i className="bi bi-list-ul" style={{fontSize:"50px",position:"relative",left:"80px",bottom:"30px",color:"rgb(93, 86, 145)"}}></i>
                                </div>
                                
                               

                                </div>

                                <div style={{fontSize:"50px",position:"relative",left:"40px",color:'rgba(11,132,164,255)'}}   onClick={() => setShowAOIModal(true)}>  <div className='rep' >
                                    <h4 style={{position:"relative",top:"20px",right:"40px"}}>Area of <br />Interest</h4>
                                    <i className="bi bi-nintendo-switch" style={{fontSize:"50px",position:"relative",left:"80px",bottom:"50px",color:"rgb(166, 100, 135)"}}></i>
                                </div>
                                
                               

                                </div>
         
        </div>
      </div>
   
      
    </>
  );
}

export default Settingsfilters;
