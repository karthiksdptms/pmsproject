import React from "react";
import { useAuth } from "../../../context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "../../Loading";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading/>;
  }

  return user ? children: <Navigate to="/Login"/>
};

export default ProtectedRoute;
