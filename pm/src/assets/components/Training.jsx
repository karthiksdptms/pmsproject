import React from 'react'
import "./Training.css"
import Topbar from './Topbar';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";


function Training() {
  return (
    <>
      <div >
        <div className='hea'> <Link to="/Maindashboard" style={{
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
            <h2 style={{ position: "relative", top: '45px', left: "30px", fontFamily: 'poppins', fontSize: "35px", width: '100px' }}>Training's</h2>
          </div>
        </Link></div>
        <div className=" menu">
          
            <Link to="/Maindashboard/Trainingschedule" style={{textDecoration:"none",width:"250px"}} > <div className='sce'>
                <h4 style={{position:"relative",top:"30px",right:"40px"}}>Schedule</h4>
                <i className="bi bi-calendar-check-fill" style={{fontSize:"50px",position:"relative",left:"70px",bottom:"30px",color:'rgb(150, 73, 154)'}}></i>
            </div></Link>
            <Link to="/Maindashboard/Trainingattendence" style={{textDecoration:"none",width:"250px"}}> <div className='att'>
                <h4 style={{position:"relative",top:"30px",right:"40px"}}>Attendance</h4>
                <i className="bi bi-card-checklist" style={{fontSize:"50px",position:"relative",left:"70px",bottom:"30px",color:"rgb(114, 107, 170)"}}></i>
            </div></Link>
            
            <Link to="/Maindashboard/Trainingreports" style={{textDecoration:"none",width:"250px"}}> <div className='rep'>
                <h4 style={{position:"relative",top:"30px",right:"40px"}}>Reports</h4>
                <i className="bi bi-bar-chart-line-fill" style={{fontSize:"60px",position:"relative",left:"70px",bottom:"30px",color:"rgb(181, 113, 149)"}}></i>
            </div></Link>

        </div>
      </div>
    </>
  )
}

export default Training