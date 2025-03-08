import React from "react";
import "./Topbar.css";
import { NavLink,Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";


function Topbar() {
  const {user,logout} = useAuth();
  
  
  return (
    <>
      <div className="topbar">
        <img src="/ritraja.jpg"    alt="logo"/>
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
       
          <button
          onClick={logout}
            type="button"
            className="btn "
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
            <i className="bi bi-box-arrow-left" style={{ marginRight: "10px" }}></i>
            Logout
          </button>
       
          <div className="profile1">
   <h6 className="admin">{user && user.name}</h6>
  <FaUser className="user1" />
</div>

      </div>
       
     
      <div className="sidebox">
      <div className="btnn">
      {" "}
      <NavLink to="/Maindashboard" end>
  {({ isActive }) => (
    <button className={`btnn ${isActive ? "bgg" : ""}`}>
      <i className="bi bi-speedometer" style={{ marginRight: "10px", paddingLeft: "5px" }}></i>
      Dashboard
    </button>
  )}
</NavLink>
        </div>
    
        <div className="btnn">
        <NavLink to="/Maindashboard/Dashboard" end>
        {({ isActive }) => (
        <button className={`btnn ${isActive ? "bgg" : ""}`}>
            <i className="bi bi-funnel-fill"   style={{ marginRight: "10px" ,paddingLeft:'5px'}} />
              Student's Filters
            </button>
             )}
          </NavLink>
        </div>
        <div className="btnn">
          {" "}
          <NavLink to="/Maindashboard/Training">
          {({ isActive }) => (
          <button className={`btnn ${isActive ? "bgg" : ""}`}>
              <i className="bi bi-bullseye"   style={{ marginRight: "10px",paddingLeft:'5px' }} />
              Training
            </button>
             )}
          </NavLink>
          
        </div>
        <div className="btnnn">
          {" "}
          <NavLink to="/Maindashboard/Placementannounce">
          {({ isActive }) => (
          <button className={`btnn ${isActive ? "bgg" : ""}`}>
              <GrAchievement   style={{ marginRight: "10px" ,paddingLeft:'5px',fontSize:"20px"}} />
              Placement Announcements
            </button>
             )}
          </NavLink>
        </div>
       
        <div className="btnn">
        {" "}
          <NavLink to="/Maindashboard/Aptitude">
          {({ isActive }) => (
          <button className={`btnn ${isActive ? "bgg" : ""}`}>
              <GrAchievement   style={{ marginRight: "10px" ,paddingLeft:'5px',fontSize:"20px"}} />
              Aptitude
            </button>
             )}
          </NavLink>
        </div>
        <div className="btnn">
        <NavLink to="/Maindashboard/Accounts">
          {({ isActive }) => (
          <button className={`btnn ${isActive ? "bgg" : ""}`}>
              <GrAchievement   style={{ marginRight: "10px" ,paddingLeft:'5px',fontSize:"20px"}} />
              Accounts
            </button>
             )}
          </NavLink>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
        <div className="btnn">
          <button className="btnn"></button>
        </div>
      </div>

      <div className="rajalakshmibottomimg">
        <img src="rajalakshmibottom.png" alt="" />
      </div>
    </>
  );
}

export default Topbar;