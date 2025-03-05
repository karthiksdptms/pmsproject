import React, { useEffect,useState } from "react";
import './Studentprofile.css'
import Studenttopbar from "./Studenttopbar";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../assets/context/authContext";
import axios from "axios";
import Loading from "../assets/components/Loading";
import { HiComputerDesktop } from "react-icons/hi2";
import { MdOutlineSmsFailed } from "react-icons/md";

function Studentprofile() {
    const { user } = useAuth();
    const [student, setStudent] = useState({});
    const [loading, setLoading] = useState(true);


    const fetchStudent = async () => {
        try {
          const token = localStorage.getItem("token"); 
          const response = await axios.get(`http://localhost:3000/api/student/getone/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
          setStudent(response.data.student);
        } catch (error) {
          console.error("Error fetching student data", error);
        } finally {
            setLoading(false); 
        }
      };
    
      useEffect(() => {
        if (user?._id) {
          fetchStudent();
        }
      }, [user]);
    
    return (
        <>
           
            <div className="had">
                <Link
                    to="/Studentdashboard"
                    style={{ textDecoration: "none", color: "black" }}
                >
                    <div>
                        <button
                            type="button"
                            class="btn btn-secondary"
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
                                width: "200px",
                            }}
                        >
                            My Profile              </h2>
                    </div>
                </Link>
                {loading ? (
          <Loading/>
          ) : (
                <div className="main" style={{ width: "1200px", height: "700px", position: "relative", top: "40px" }}>

                    <div className="pic" style={{
                        width: "320px", height: "590px", backgroundColor: "", zIndex: "10px", position: "relative",
                        top: "20px", left: "15px", borderRadius: "10px"
                    }}>   <div className="profile" ><img
                        src={`http://localhost:3000/${user.profileImage}`}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: "170px", height: "170px", objectFit: "cover", position: "relative", right: '1.5px', bottom: '1.5px' }}
                    /></div>
                        <br />
                        <br />
                        <div style={{ justifyItems: "center", alignItems: "center", position: "relative", top: '10px' }}>
                            <h4 style={{}}>{student.name}  <br /></h4>
                            <h4 style={{}}> {student.department}  <br /></h4>
                            <h4 style={{}}>{student.registration_number}</h4>
                        </div>

                    </div>
                    <div className="cont" style={{
                        width: "800px", height: "590px", backgroundColor: "", zIndex: "10px", position: "relative", borderRadius: "10px",
                        bottom: "570px", left: "360px"
                    }}>
                        <h3 style={{ position: "relative", left: "20px", top: "10px" }}>Informations:</h3>
                        <div className="cgpa" style={{ position: "relative", left: "30px", top: "20px" }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900"}}>CGPA</p>
                            <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "250px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>{student.cgpa} </p></div>

                        <div className="batch" style={{ position: "relative", left: "400px", bottom: "67px",width:'300px' }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900",width:'300px' }}>Batch</p>
                            <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "250px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>{student.batch} </p></div>

                        <div className="email" style={{ position: "relative", left: "30px", bottom: "50px" }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900" }}>Email</p>
                            <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "620px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>{student.email}</p></div>

                        <div className="phoneno" style={{ position: "relative", left: "30px", bottom: "20px" }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900" }}>Phone Number</p>
                            <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "250px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>{student.phoneno}</p></div>

                        <div className="gphoneno" style={{ position: "relative", left: "400px", bottom: "106px",width:'300px' }}><p style={{ color: "rgb(101, 100, 100)", fontWeight: "900" }}>Gaurdian Number</p>
                            <p style={{ fontWeight: "2900", fontSize: "19px", backgroundColor: "rgb(237, 236, 236)", color: "rgb(45, 44, 44)", width: "250px", padding: "4px", borderRadius: "10px", paddingLeft: "25px" }}>96662377892</p></div>

                        <div className="place" style={{ width: "260px", height: "133px", position: "relative", bottom: "95px", left: "70px", borderRadius: "13px" }}>
                            <h5 style={{ position: "relative", left: "90px", top: "16px", color: "rgb(45, 44, 44)" }}>Placement info</h5>
                            <HiComputerDesktop  className="icccc"/>
                            <br />
                            <p style={{ position: "relative", left: "122px", top: "10px", fontWeight: "800", color: "rgb(101, 100, 100)" }}>{student.placement}</p>
                        </div>

                        <div className="offer" style={{ width: "260px", height: "133px", position: "relative", bottom: "227px", left: "390px", borderRadius: "13px" }}>
                            <h5 style={{ position: "relative", left: "159px", top: "16px", color: "rgb(45, 44, 44)" }}>Arrears</h5>
                            <MdOutlineSmsFailed  className="iccc"/>
                            <br />
                            <p style={{ position: "relative", left: "222px", top: "10px", fontWeight: "800", color: "rgb(101, 100, 100)" }}>{student.arrears}</p>

                        </div>


                    </div>
                </div>
          )}
            </div>


        </>


    );
}
export default Studentprofile