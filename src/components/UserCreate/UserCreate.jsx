import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./UserCreate.css";
import { UserContext } from "../../App";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import profile from "../../assets/defaultAvatar.png";
import { Progress } from "antd";

const UserCreate = () => {
  const { authService } = useContext(UserContext);
  const INIT_STATE = {
    photo: null,
    name: "",
    userName: "",
    email: "",
    password: "",
  };
  const [userInfo, setUserInfo] = useState(INIT_STATE);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [passwordError, setPasswordError] = useState(false);

  const onChange = ({ target: { name, value } }) => {
    setUserInfo({ ...userInfo, [name]: value });
  };

  let navigate = useNavigate();

  const createUser = (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters in length.");
    }

    if (!!userName && !!email && !!password) {
      setIsLoading(true);
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          if (percent < 100) {
            setPercentage(percent);
          }
        },
      };
      authService
        .createUser(fData, options)
        .then((res) => {
          authService
            .loginUser(email, password)
            .then(() => {
              setUserInfo(INIT_STATE);
              navigate("/feed");
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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { userName, email, password, name } = userInfo;
  const errorMsg = "Error creating account. Please try again.";

  const userCreateValues = [
    {
      value: `${name}`,
      type: "text",
      name: "name",
      placeholder: "Enter name",
      key: 1,
    },
    {
      value: `${userName}`,
      type: "text",
      name: "userName",
      placeholder: "Enter username",
      key: 2,
    },
    {
      value: `${email}`,
      type: "email",
      name: "email",
      placeholder: "Enter email",
      key: 3,
    },
    {
      value: `${password}`,
      type: "password",
      name: "password",
      error: passwordError,
      placeholder: "Enter password",
      key: 4,
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
          {percentage > 0 && <Progress percent={percentage} />}
        </form>
      </div>
    </>
  );
};

export default UserCreate;
