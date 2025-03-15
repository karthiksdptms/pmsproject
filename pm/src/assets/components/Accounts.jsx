import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import './Aptitude.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

function Accounts() {
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
              Accounts{" "}
            </h2>
          </div>
        </Link>
        <div className="menu5">
          
                    <div>
                      
                      <Link to="/Maindashboard/Accountsstudentaccounts" style={{textDecoration:"none",width:"250px"}}> <div className='cq'>
                                    <h4 style={{position:"relative",top:"30px",right:"40px"}}>Students</h4>
                                    <i className="bi bi-calendar2-check-fill" style={{fontSize:"50px",position:"relative",left:"110px",bottom:"30px",color:'rgba(11,132,164,255)'}}></i>
                                </div></Link></div>
                                <div> <Link to="/Maindashboard/Accountapprovals" style={{textDecoration:"none",width:"250px"}}> <div className='sc'>
                                    <h4 style={{position:"relative",top:"30px",right:"40px"}}>Approvals</h4>
                                    <i className="bi bi-calendar2-check-fill" style={{fontSize:"50px",position:"relative",left:"110px",bottom:"30px",color:'rgba(11,132,164,255)'}}></i>
                                </div></Link></div>
         
        </div>
      </div>
   
      
    </>
  );
}

export default Accounts;
