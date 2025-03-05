import React from "react";

import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';



function Studenttrainingexams () {
  return(
        <>
         <div className='hea'> <Link to="/Studentdashboard/Studenttraining" style={{textDecoration:'none',color:
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
                <h2 style={{position:"relative",top:'45px',left:"30px",fontFamily:'poppins',fontSize:"35px",width:'100px'}}>Exams</h2>
              </div>
            </Link></div>
            
            </>
    )

}

export default Studenttrainingexams