import { useNavigate } from "react-router-dom"
import axios from "axios"
import React from "react"
import "bootstrap/dist/css/bootstrap.min.css";

export const StudentButtons=({id})=>{
    const navigate=useNavigate()

    return (
        <div className="flex space-x-3">
            <button
            className="px-3 py-1 bg-blue-600 t">
               Edit
            </button>
            <button
            className="px-3 py-1 bg-blue-600 t">
               Delete
            </button>
        </div>
    )
   
}

export const columns=[
    {
        name:"#",
        selector:(row)=>row.id,
    },
    {
        name:"Profile",
        selector:(row)=>row.profileImage,
        sortable: true
    },
    {
        name:"Registeration Number",
        selector:(row)=>row.registration_number,
        sortable: true
    },
    {
        name:"Name",
        selector:(row)=>row.name,
        sortable: true
    },
    {
        name:"Department",
        selector:(row)=>row.department,
        sortable: true
    },
    {
        name:"Batch",
        selector:(row)=>row.batch,
        sortable: true
    },
    {
        name:"Email",
        selector:(row)=>row.email,
        sortable: true
    },
    {
        name:"Actions",
        selector:(row)=>row.action,
    },
    

]