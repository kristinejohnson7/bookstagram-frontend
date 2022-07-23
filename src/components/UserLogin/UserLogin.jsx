import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../App";
import Alert from "../Alert/Alert";
import logo from "../../assets/logo.png";
import "./UserLogin.css";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import UserCreate from "../UserCreate/UserCreate";

const UserLogin = () => {
  const { authService } = useContext(UserContext);
  const [userLogins, setUserLogins] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [register, setRegister] = useState(false);

  const onChange = ({ target: { name, value } }) => {
    setUserLogins({ ...userLogins, [name]: value });
  };

  let navigate = useNavigate();
  let location = useLocation();
  // const routeChange = (path) => {
  //   let pathName = `${path}`;
  //   navigate(pathName);
  // };

  const onLoginUser = (e) => {
    e.preventDefault();
    const { email, password } = userLogins;
    if (!!email && !!password) {
      let from = location.state?.from.pathname || "/feed";
      console.log(location, "location", from);
      authService
        .loginUser(email, password)
        .then(() => navigate(from, { replace: true }))
        .catch(() => {
          setError(true);
          setUserLogins({ email: "", password: "" });
        });
    }
  };

  // const showUserRegister = () => {
  //   set
  // }
  const errorMsg = "Sorry, you entered an incorrect email or password";

  const loginData = [
    {
      value: userLogins.email,
      type: "email",
      name: "email",
      placeholder: "youremail@gmail.com",
    },
    {
      value: userLogins.password,
      type: "password",
      name: "password",
      placeholder: "password",
    },
  ];

  return (
    <div className="heroContainer">
      <div className="heroTopContainer">
        <div className="heroLogo">
          <img src={logo} alt="bookstagram logo" />
        </div>
        <h1>bookstagram</h1>
      </div>
      <div className="heroBtmContainer">
        <div className="loginContainer">
          {error ? <Alert message={errorMsg} type="alert-danger" /> : null}
          {!register && (
            <>
              <form onSubmit={onLoginUser} className="form">
                <h3>LOGIN</h3>
                <FormBody formValues={loginData} onChange={onChange} />
                <Button cname="submitBtn" title="Sign In" />
              </form>
              <div className="otherSignIns">
                <div className="hrContainer">
                  <span>
                    <hr />
                  </span>
                  <p>OR WITH </p>{" "}
                  <span>
                    <hr />
                  </span>
                </div>
                <div className="loginBtnContainer">
                  <Button cname="defaultBtn" title="Google" />
                  <Button cname="defaultBtn" title="Facebook" />
                </div>
              </div>
            </>
          )}
          {register && <UserCreate closeRegister={setRegister} />}
          <div className="footer-text">
            {!register ? (
              <div>
                No Account? Create one
                <button onClick={() => setRegister(true)}> HERE</button>
              </div>
            ) : (
              <div>
                Already have an Account? Login
                <button onClick={() => setRegister(false)}>HERE</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
