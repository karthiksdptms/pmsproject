import React from "react";
import { useAuth } from "../../../context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "../../Loading";

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading/>;
  }


  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />
  }

 
   return user ? children: <Navigate to="/Login"/>
};

export default RoleBaseRoutes;
