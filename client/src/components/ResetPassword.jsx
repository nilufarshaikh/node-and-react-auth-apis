import { useState } from "react";
import "../App.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/auth/reset-password/${token}`,
        {
          password,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
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
        <h2>Reset Password</h2>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default ResetPassword;
