import axios from "axios";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import HeroLogo from "../HeroLogo/HeroLogo";
import "./PasswordReset.css";

export default function PasswordReset() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    axios
      .put(
        "https://bookstagram7.cyclic.app/api/v1/auth/resetpassword/" +
          resetToken,
        {
          password: fData.get("password"),
        }
      )
      .then(navigate("/"));
  };

  return (
    <div className="heroContainer">
      <HeroLogo />
      <div className="loginContainer">
        <h3>Password Reset</h3>
        <form onSubmit={handleResetPassword} className="resetForm">
          <input
            name="password"
            type="password"
            placeholder="Enter your new password"
          />
          <Button cname="submitBtn" title="Reset Password" />
        </form>
      </div>
    </div>
  );
}
