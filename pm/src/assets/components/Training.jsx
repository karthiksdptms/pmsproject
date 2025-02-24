import React from 'react'
import "./Training.css"
import Topbar from './Topbar';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";


function Training() {
  return (
    <><Topbar/>
    <div >
        <div className='hea'> <Link to="/Maindashboard" style={{textDecoration:'none',color:
            "black"
        }}>
          <div>
            <button
              type="button"
              class="btn btn-secondary"
              style={{
                marginLeft: "20px",
                border: "none",
                position: "relative",
                top: "95px",
              right:'40px',
                fontSize: "35px",
                color: "black",
                backgroundColor: "transparent",
              }}
            >
              <IoIosArrowBack />
            </button>
            <h2 style={{position:"relative",top:'45px',left:"30px",fontFamily:'poppins',fontSize:"35px",width:'100px'}}>Training's</h2>
          </div>
        </Link></div>
        <div className="menu">
          
            <Link to="/Trainingschedule" style={{textDecoration:"none",width:"250px"}}> <div className='sce'>
                <h4 style={{position:"relative",top:"30px",right:"40px"}}>Schedule</h4>
                <i class="bi bi-calendar2-check-fill" style={{fontSize:"50px",position:"relative",left:"70px",bottom:"30px",color:'rgba(11,132,164,255)'}}></i>
            </div></Link>
            <Link to="/Trainingattendance" style={{textDecoration:"none",width:"250px"}}> <div className='att'>
                <h4 style={{position:"relative",top:"30px",right:"40px"}}>Attendance</h4>
                <i class="bi bi-card-checklist" style={{fontSize:"50px",position:"relative",left:"70px",bottom:"30px",color:"rgb(74, 109, 90)"}}></i>
            </div></Link>
            
            <Link to="/Trainingreports" style={{textDecoration:"none",width:"250px"}}> <div className='rep'>
                <h4 style={{position:"relative",top:"30px",right:"40px"}}>Reports</h4>
                <i class="bi bi-bar-chart-line-fill" style={{fontSize:"60px",position:"relative",left:"70px",bottom:"30px",color:"rgb(158, 64, 48)"}}></i>
            </div></Link>
        </div>
    </div>
    </>
  )
}

export default Training