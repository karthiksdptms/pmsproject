import React from 'react'
import Topbar from './Topbar'
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

function Aptitudescheduleexam() {
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
               to="/Maindashboard/Aptitude"
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
                     width: "450px",
                   }}
                 >
                Schedule Exam{" "}
                 </h2>
               </div>
             </Link>
             <div className="menu5">
               
                                  
             </div>
           </div>
        </>
       )
}

export default Aptitudescheduleexam