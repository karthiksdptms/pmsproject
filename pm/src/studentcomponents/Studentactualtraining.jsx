import React from "react";
import Studenttopbar from "./Studenttopbar";

import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';


function Studentactualtraining() {
  return (<>

    <div className='hea'> <Link to="/Studentdashboard" style={{
      textDecoration: 'none', color:
        "black"
    }}>
      <div>
        <button
          type="button"
          className="btn btn-secondary"
          style={{
            marginLeft: "20px",
            border: "none",
            position: "relative",
            top: "95px",
            right: '40px',
            fontSize: "35px",
            color: "black",
            backgroundColor: "transparent",
          }}
        >
          <IoIosArrowBack />
        </button>
        <h2 style={{ position: "relative", top: '45px', left: "30px", fontFamily: 'poppins', fontSize: "35px", width: '100px' }}>Training</h2>
      </div>
    </Link></div>
    <div className="menu">

      <Link to="/Studentdashboard/Studenttrainingschedules" style={{ textDecoration: "none", width: "250px" }}> <div className='sce'>
        <h4 style={{ position: "relative", top: "30px", right: "40px" }}>Schedule's</h4>
        <i className="bi bi-calendar-check-fill" style={{ fontSize: "50px", position: "relative", left: "70px", bottom: "30px", color: 'rgb(132, 65, 136)' }}></i>
      </div></Link>
      <Link to="/Studentdashboard/Studenttrainingattendance" style={{ textDecoration: "none", width: "250px" }}> <div className='att'>
        <h4 style={{ position: "relative", top: "30px", right: "40px" }}>Attendance</h4>
        <i className="bi bi-card-checklist" style={{ fontSize: "50px", position: "relative", left: "70px", bottom: "30px", color:"rgb(73, 67, 119)" }}></i>
      </div></Link>


    </div>
  </>)
}
export default Studentactualtraining;