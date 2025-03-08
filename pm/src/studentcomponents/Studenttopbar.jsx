import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import "./Studenttopbar.css";
import { useAuth } from "../assets/context/authContext";


function Studenttopbar() {
  const { user, logout } = useAuth();

  return (<>
    <div className="topbar">
      <img src="/ritraja.jpg" className="img-fluid" alt="Responsive image" />
      <h6 style={{

        color: "white",
        position: "fixed",
        top: "49px",
        left: "250px",

        height: "15px",
      }}>welcome {user.name}!</h6>
      <h1 className="" style={{ position: "relative", right: "-300px", color: "white", fontFamily: "cambria", top: "10px" }}>PLACEMENT AND TRAINING</h1>
      <h6
        style={{
          fontSize: "13px",
          width: "220PX",
          color: "rgb(250, 60, 2)",
          position: "fixed",
          top: "76px",
          right: "1285px",
          backgroundColor: "white",
          paddingLeft: "5px",
          height: "15px",
        }}
      >
        AN AUTONOMOUS INSTITUTION
      </h6>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "410px",
          height: "40px",
          position: "relative",
          left: "270px",
          top: "2px",

        }}>
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
          <i className="bi bi-box-arrow-left" style={{ marginRight: "10px" }}></i>
          Logout
        </button>


        <div style={{ position: "fixed", right: '20px', top: "10px" }}>

          {user.profileImage ? (
            <img
              src={`http://localhost:3000/${user.profileImage}`}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          ) : (
            <FaUser
              size={50}
              style={{ color: "#999", borderRadius: "50%", padding: "10px", background: "#f4f4f4" }}
            />
          )}
        </div>
      </div>


    </div>



    <div className="sidebox">
      <div className="btnn">
        {" "}
        <Link to="/Studentdashboard">
          <button className="btnn ">
            <i className="bi bi-speedometer" style={{ marginRight: "10px", paddingLeft: '5px' }} ></i>

            Dashboard
          </button>
        </Link>
      </div>
      <div className="btnn">
        {" "}
        <Link to="/Studentdashboard/Studentprofile">
          <button className="btnn ">
            <i className="bi bi-speedometer" style={{ marginRight: "10px", paddingLeft: '5px' }} ></i>
            My Profile
          </button>
        </Link>
      </div>


      <div className="btnn">
        <Link to="/Studentdashboard/Studenttraining">
          <button className="btnn">
            <i className="bi bi-funnel-fill" style={{ marginRight: "10px", paddingLeft: '5px' }} />
            Training
          </button>
        </Link>
      </div>
      <div className="btnn">
        {" "}
        <Link to="/Studentdashboard/Studentplacement">
          <button className="btnn">
            <i className="bi bi-bullseye" style={{ marginRight: "10px", paddingLeft: '5px' }} />
            Placement
          </button>
        </Link>
      </div>


      <div className="btnn">
        {" "}

        <button className="btnn ">


        </button>

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
      <div className="btnn">
        <button className="btnn"></button>
      </div>
    </div>

    <div className="rajalakshmibottomimg">
      <img src="rajalakshmibottom.png" alt="" />
    </div>

  </>)
}
export default Studenttopbar;