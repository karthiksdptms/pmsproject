import React from "react";
import Studenttopbar from "./Studenttopbar";

import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';


function Studenttrainingattendance() {
  return (<>

    <div className='hea'> <Link to="/Studentdashboard/Studentactualtraining" style={{
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
        <h2 style={{ position: "relative", top: '45px', left: "30px", fontFamily: 'poppins', fontSize: "35px", width: '100px' }}>Attendance</h2>
      </div>
    </Link></div>
    
  </>)
}
export default Studenttrainingattendance;