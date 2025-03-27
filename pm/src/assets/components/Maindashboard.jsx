import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Maindashboard.css";
import Topbar from "./Topbar";
import Adminsummmary from "./Adminsummary";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Maindashboard() {
 
  
  return (
    <>
      <Topbar />
      <Outlet/>
      
    </>
  );
}

export default Maindashboard;
