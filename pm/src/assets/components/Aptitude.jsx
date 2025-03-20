import React, { useState } from "react";
import Topbar from "./Topbar";
import "bootstrap/dist/css/bootstrap.min.css";
import './Aptitude.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

function Aptitude() {
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
              Assessments{" "}
            </h2>
          </div>
        </Link>
        <div className="menu5">

          
                   
                <div  className=''>
            <Link to="/Maindashboard/Aptitudeconfigurequestions" style={{ textDecoration: "none", width: "250px" }} > <div className='cq'>
              <h4 style={{ position: "relative", top: "30px", right: "30px" }}>Configure Questions</h4>
              <i className="bi bi-calendar2-check-fill" style={{ fontSize: "50px", position: "relative", left: "120px", bottom: "30px", color:'rgb(132, 65, 136)' }}></i>
            </div></Link></div>
          <div style={{marginRight:"30px"}}> <Link to="/Maindashboard/Aptitudescheduleexam" style={{ textDecoration: "none", width: "250px", }}> <div className='sc'>
            <h4 style={{ position: "relative", top: "30px", right: "40px" }}>Schedule Exam</h4>
            <i className="bi bi-calendar2-check-fill" style={{ fontSize: "50px", position: "relative", left: "110px", bottom: "30px", color: 'rgb(117, 58, 89)' }}></i>
          </div></Link></div>
          <div>

            <Link to="/Maindashboard/Aptitudescores" style={{ textDecoration: "none", width: "200px" }}> <div className='att'>
              <h4 style={{ position: "relative", top: "30px", right: "30px" }}>Scores</h4>
              <i className="bi bi-calendar2-check-fill" style={{ fontSize: "50px", position: "relative", left: "80px", bottom: "30px", color: 'rgb(73, 67, 119)' }}></i>
            </div></Link></div>



        </div>
      </div>
    </>
  );
}

export default Aptitude;
