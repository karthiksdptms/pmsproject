import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Aptitude.css";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "./Settings.css"
function Settings() {
 

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
                               
                                
         
        </div>
      </div>
   
      
    </>
  );
}

export default Settings;
