import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "bootstrap-icons/font/bootstrap-icons.css"; 
import axios from 'axios';
import { useAuth } from "../context/authContext";

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error,setError]=useState(null)
  const {login} =useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data); 

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);

        if (response.data.user.role === "admin") {
          navigate("/mainDashboard");
        } else if(response.data.user.role === "student") {
          navigate("/Studentdashboard");
        }else{
          navigate("/");
        }
      } else {
        setError("Login failed. Please check credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error);
      setError(error.response?.data?.error || "Server error. Please try again.");
    }
};


  return (
    <div>
      <div className="top">
        <img src="top.jpg" alt="Top Background" />
      </div>

      <div className="bottom">
        <img src="back.jpg" alt="Background" />
        <div className="hoverimage"></div>
        <h1 className="believe">BELIEVE IN THE</h1>
        <h1 className="believe">POSSIBILITIES</h1>
        <div className="log">
          <h2 className="logs">LOGIN</h2>
        
          {error &&<p className="text-red-500" style={{color:"red"}}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                value={email}
                className="reg1"
                onChange={(e) => setEmail(e.target.value)}
                
                placeholder="Enter email"
                required
              />
              <div style={{ position: "relative", display: "inline-block" }}>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  className="pass1"
                  onChange={(e) => setPassword(e.target.value)}
                 
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  className="password-toggle"
                  style={{backgroundColor:"white",border:"none",fontSize:"23px",position:"relative",bottom:"-16.5px",left:"-6px"
                  }}
                >
                  <i className={isPasswordVisible ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
              </div>
              <br />
              <button className="btn btn-primary submit" type="submit">
                Submit
              </button>
            </div>
            <FaUser className="user" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
