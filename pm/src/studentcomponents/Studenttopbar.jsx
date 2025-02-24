import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import "./Studenttopbar.css";


function Studenttopbar(){
   
    return( <>
          <div className="topbar">
            <img src="ritraja.jpg" class="img-fluid" alt="Responsive image" />
            <h1 className="placementword">PLACEMENT AND TRAINING</h1>
            <h6
              style={{
                fontSize: "13px",
                width: "220PX",
                color: "rgb(250, 60, 2)",
                position: "relative",
                top: "76px",
                right: "718px",
                backgroundColor: "white",
                paddingLeft: "5px",
                height: "15px",
              }}
            >
              AN AUTONOMOUS INSTITUTION
            </h6>
            <Link to="/">
              <button
                type="button"
                class="btn "
                style={{
                  borderRadius: "30px",
                  backgroundColor: "white",
                  width: "110px",
                  height: "40px",
                  position: "relative",
                  left: "330px",
                  top: "13px",
                  marginRight: "20px",
                  boxShadow: "none !important",
                }}
              >
                {" "}
                <i class="bi bi-box-arrow-left" style={{ marginRight: "10px" }}></i>
                Logout
              </button>
            </Link>
            <Link to="/Studentprofile">
            <div className="profile">
              <h6 className="admin">Student</h6>
              <FaUser className="user1"  style={{color:"black",position:'relative',top:"-17.5px"}}/>
            </div></Link>
          </div>
          
           
         
          <div className="sidebox">
          <div className="btnn">
          {" "}
              <Link to="/Studentdashboard">
                <button class="btnn ">
                <i class="bi bi-speedometer"  style={{ marginRight: "10px",paddingLeft:'5px' }} ></i>
                 
                  Dashboard
                </button>
              </Link>
            </div>
           
        
            <div className="btnn">
            <Link to="/Studenttraining">
                <button class="btnn">
                <i class="bi bi-funnel-fill"   style={{ marginRight: "10px" ,paddingLeft:'5px'}} />
                Training 
                </button>
              </Link>
            </div>
            <div className="btnn">
              {" "}
              <Link to="/Studentplacement">
                <button class="btnn">
                  <i class="bi bi-bullseye"   style={{ marginRight: "10px",paddingLeft:'5px' }} />
                  Placement 
                </button>
              </Link>
            </div>
           
           
            <div className="btnn">
            {" "}
              
                <button class="btnn ">
                  
                 
                </button>
           
            </div>
                       <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
            <div className="btnn">
              <button class="btnn"></button>
            </div>
          </div>
    
          <div className="rajalakshmibottomimg">
            <img src="rajalakshmibottom.png" alt="" />
          </div>
   
    </> )
}
export default Studenttopbar;