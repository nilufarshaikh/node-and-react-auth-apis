import { useState } from "react";
import "../App.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/forgot-password",
        {
          email,
        }
      );

      if (response.status === 200) {
        alert("Check your email for reset password link");
        navigate("/login");
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button>Send</button>
      </form>
      <p>
        Back to <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
