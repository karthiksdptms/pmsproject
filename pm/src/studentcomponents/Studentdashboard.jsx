import React from "react";
import Studenttopbar from "./Studenttopbar";
import { Outlet } from "react-router-dom";

function Studentdashboard(){
    return( <>
    <Studenttopbar/>
    <Outlet/>
    </> )
}
export default Studentdashboard;