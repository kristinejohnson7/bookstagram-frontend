import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./UserCreate.css";
import { UserContext } from "../../App";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";

const UserCreate = ({ closeRegister }) => {
  const { authService } = useContext(UserContext);
  const INIT_STATE = {
    userName: "",
    email: "",
    password: "",
  };
  const [userInfo, setUserInfo] = useState(INIT_STATE);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = ({ target: { name, value } }) => {
    setUserInfo({ ...userInfo, [name]: value });
  };

  // let navigate = useNavigate();
  // const routeChange = (path) => {
  //   let pathName = `${path}`;
  //   navigate(pathName);
  // };

  let navigate = useNavigate();
  let location = useLocation();

  const createUser = (e) => {
    e.preventDefault();
    const { userName, email, password } = userInfo;
    if (!!userName && !!email && !!password) {
      setIsLoading(true);
      let from = location.state?.from.pathname || "/feed";

      authService
        .createUser(userName, email, password)
        .then(() => {
          authService
            .loginUser(email, password)
            .then(() => {
              setUserInfo(INIT_STATE);
              navigate(from, { replace: true });
              console.log("user info updated", userInfo);
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
          <FormBody onChange={onChange} formValues={userCreateValues} />
          <Button cname="submitBtn" title="Create Account" />
        </form>
        {/* <div className="footer-text">
          Already have an Account? Login{" "}
          <button onClick={() => closeRegister(true)}>HERE</button>
        </div> */}
      </div>
    </>
  );
};

export default UserCreate;
