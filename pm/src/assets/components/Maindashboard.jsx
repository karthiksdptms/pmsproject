import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Maindashboard.css";
import Topbar from "./Topbar";
import Adminsummmary from "./Adminsummary";


function Maindashboard() {
 
  
  return (
    <>
      <Topbar />
      <Outlet/>
      
    </>
  );
}

export default Maindashboard;
