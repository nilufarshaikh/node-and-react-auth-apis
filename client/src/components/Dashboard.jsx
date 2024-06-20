import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify");
      } catch (error) {
        console.log(error.response.data);
        navigate("/");
      }
    };

    verifyAuth();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
