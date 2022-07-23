import React from "react";
import Button from "../Button/Button";
import logo from "../../assets/logo.png";
import "./Nav.css";

export default function Nav({ profileModal, uploadModal }) {
  return (
    <nav className="navBar">
      <div className="navLogo">
        <img src={logo} alt="bookstagram logo" />
        <h2>bookstagram</h2>
      </div>

      <div className="navOptions">
        <div className="userIcon">
          <i class="fa-regular fa-compass fa-lg"></i>
        </div>
        <div className="userIcon">
          <i class="fa-regular fa-heart fa-lg"></i>
        </div>
        <div className="userIcon" onClick={uploadModal}>
          <i class="fa-solid fa-circle-plus fa-lg"></i>
        </div>
        <div className="userIcon" onClick={profileModal}>
          <i class="fa-solid fa-user fa-lg"></i>
        </div>

        {/* <Button handleOnClick={setModal} title="Profile" cname="darkBtn" /> */}
      </div>
    </nav>
  );
}
