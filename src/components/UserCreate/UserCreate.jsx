import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./UserCreate.css";
import { UserContext } from "../../App";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import profile from "../../assets/profile.jpg";

const UserCreate = ({ closeRegister }) => {
  const { authService } = useContext(UserContext);
  const INIT_STATE = {
    photo: null,
    userName: "",
    email: "",
    password: "",
  };
  const [userInfo, setUserInfo] = useState(INIT_STATE);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const onChange = ({ target: { name, value } }) => {
    setUserInfo({ ...userInfo, [name]: value });
  };

  let navigate = useNavigate();
  let location = useLocation();

  const createUser = (e) => {
    e.preventDefault();
    const { userName, email, password, photo } = userInfo;
    if (!!userName && !!email && !!password) {
      setIsLoading(true);
      let from = location.state?.from.pathname || "/feed";
      console.log("submit user info", userInfo);
      authService
        .createUser(userName, email, password, photo)
        .then(() => {
          authService
            .loginUser(email, password)
            .then(() => {
              setUserInfo(INIT_STATE);
              navigate(from, { replace: true });
            })
            .catch((error) => {
              console.error("logging in user", error);
              setError(true);
            });
        })
        .catch((error) => {
          console.error("registering user", error);
          setError(true);
        });
      setIsLoading(false);
    }
  };

  const validateImg = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setUserInfo({ ...userInfo, photo: file });
      console.log("file name", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { userName, email, password } = userInfo;
  const errorMsg = "Error creating account. Please try again.";

  const userCreateValues = [
    {
      value: `${userName}`,
      type: "text",
      name: "userName",
      placeholder: "Enter username",
    },
    {
      value: `${email}`,
      type: "email",
      name: "email",
      placeholder: "Enter email",
    },
    {
      value: `${password}`,
      type: "password",
      name: "password",
      placeholder: "Enter password",
    },
  ];

  return (
    <>
      <div className="center-display">
        {error ? <Alert message={errorMsg} type="alert-danger" /> : null}
        {isLoading ? <div>Loading...</div> : null}
        <h3 className="title">Create an account</h3>
        <form onSubmit={createUser} className="form">
          <div className="signup-profile-pic__container">
            <img
              src={imagePreview || profile}
              alt="profile"
              className="signup-profile-pic"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              <i className="fas fa-plus-circle add-picture-icon"></i>
            </label>
            <input
              type="file"
              id="image-upload"
              name="photo"
              hidden
              accept="image/png, image/jpeg"
              onChange={validateImg}
            />
          </div>
          <FormBody onChange={onChange} formValues={userCreateValues} />
          <Button
            cname="submitBtn"
            title={!isLoading ? "Create Account" : "Creating your account"}
          />
        </form>
      </div>
    </>
  );
};

export default UserCreate;
