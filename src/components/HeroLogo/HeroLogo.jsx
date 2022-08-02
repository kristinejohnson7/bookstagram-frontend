import React from "react";
import logo from "../../assets/logo.png";
import "./HeroLogo.css";

export default function HeroLogo() {
  return (
    <div className="heroTopContainer">
      <div className="heroLogo">
        <img src={logo} alt="bookstagram logo" />
      </div>
      <h1>bookstagram</h1>
    </div>
  );
}
