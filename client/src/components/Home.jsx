import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/logout");

      console.log(response);
      if (response.status === 200) {
        navigate("/");
      } else {
        console.error(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p> HomePage</p>
      <button>
        <Link to="/dashboard">Dashboard</Link>
      </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
