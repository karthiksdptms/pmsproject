import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Maindashboard.css";
import Topbar from "./Topbar";


function Maindashboard() {
 
  


  const [placed, setPlaced] = useState(20);
  const [notPlaced, setNotPlaced] = useState(80);


  const placement =85 ;
  const attendance = 170;

  const total = placed + notPlaced;
  const placedPercentage = (placed / total) * 100;

  return (
    <>
      <Topbar />
      <div className="toppp">
        <i
          
          style={{
            fontSize: "27px",
            fontWeight: "100",
            position: "relative",
            top: "10px",
            left: "5px",
          }}
        ></i>
        <h2
          style={{
            fontSize: "32px",
            position: "relative",
            bottom: "30px",
            left: "40px",
          }}
        >
          Administrative Dashboard
        </h2>
        <div className="mainb">
          <div
            className="box"
            style={{ backgroundColor: "rgb(49, 177, 194)", color: "white" }}
          >
            <h1 style={{ position: "relative", top: "40px", left: "20px" }}>
              100
            </h1>
            <h5 style={{ position: "relative", top: "50px", left: "20px" }}>
              Total Students
            </h5>

            <i
              className="bi bi-mortarboard-fill"
              style={{
                position: "relative",
                left: "180px",
                bottom: "75px",
                fontSize: "98px",
                color: "rgb(34, 139, 153)",
              }}
            ></i>
          </div>
          <div
            className="box"
            style={{ backgroundColor: "rgb(37, 150, 65)", color: "white" }}
          >
            <h1 style={{ position: "relative", top: "40px", left: "20px" }}>
              50
            </h1>
            <h5 style={{ position: "relative", top: "50px", left: "20px" }}>
              Total Staffs
            </h5>

            <i
              className="bi bi-microsoft-teams"
              style={{
                position: "relative",
                left: "180px",
                bottom: "75px",
                fontSize: "98px",
                color: "rgb(19, 112, 42)",
              }}
            ></i>
          </div>
          <div
            className="box"
            style={{ backgroundColor: "rgb(166, 79, 201)", color: "white" }}
          >
            <h1 style={{ position: "relative", top: "40px", left: "20px" }}>
              10
            </h1>
            <h5 style={{ position: "relative", top: "50px", left: "20px" }}>
              Total Course
            </h5>

            <i
              className="bi bi-journal-bookmark-fill"
              style={{
                position: "relative",
                left: "180px",
                bottom: "75px",
                fontSize: "98px",
                color: "rgb(121, 36, 155)",
              }}
            ></i>
          </div>
          <div
            className="box"
            style={{ backgroundColor: "rgb(201, 79, 79)", color: "white" }}
          >
            <h1 style={{ position: "relative", top: "40px", left: "20px" }}>
              500
            </h1>
            <h5 style={{ position: "relative", top: "50px", left: "20px" }}>
              Total Subjects
            </h5>

            <i
              className="bi bi-bookmark-fill"
              style={{
                position: "relative",
                left: "180px",
                bottom: "75px",
                fontSize: "98px",
                color: "rgb(158, 43, 43)",
              }}
            ></i>
          </div>
          <h3 className="hh">Placement & Attendance</h3>
        </div>
        <div className="graphs">
          <div className="pie">
            <div
              className="container text-center mt-5"
              style={{ position: "relative", bottom: "10px" }}
            >
              <div className="h">
                <h3 style={{ position: "relative", top: "10px" }}>
                  Placement Status
                </h3>
              </div>

              <div className="d-flex justify-content-center">
                <div
                  className="pie-chart"
                  style={{ "--placed-percentage": `${placedPercentage}%` }}
                >
                  <span className="chart-label">
                    Placed: {Math.round(placedPercentage)}%
                  </span>
                </div>
              </div>

              <div
                className="mt-3"
                style={{ position: "relative", top: "20px", fontSize: "20px" }}
              >
                <span className="badge bg-success">Placed</span>
                <span className="badge bg-danger">Not Placed</span>
              </div>
            </div>
          </div>
          <div className="bar" style={{borderTop:"53px rgb(83, 83, 83) solid"}}>
          <div className="text-center mt-5" style={{position:"relative",bottom:"90px",left:"30px"}}>
      

      <div className="graph-container mx-auto">
        <div className="bar bg-primary" style={{ height: `${placement}%` }}><h6 className="pa btn-primary" style={{backgroundColor:"blue"}}>Placed</h6></div>
        <div className="bar bg-success" style={{ height: `${attendance}%` }}><h6 className="pa btn-success" style={{backgroundColor:"green"}}>Attendance</h6></div>
      </div>
     
      
    </div>
          </div>
          
        </div>
       
      </div>
    </>
  );
}

export default Maindashboard;
