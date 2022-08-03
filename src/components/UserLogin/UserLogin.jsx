import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import Alert from "../Alert/Alert";
import "./UserLogin.css";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import UserCreate from "../UserCreate/UserCreate";
import Modal from "../Modal/Modal";
import { useEffect } from "react";
import HeroLogo from "../HeroLogo/HeroLogo";

const UserLogin = () => {
  const { authService } = useContext(UserContext);
  const [userLogins, setUserLogins] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [register, setRegister] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const onChange = ({ target: { name, value } }) => {
    setUserLogins({ ...userLogins, [name]: value });
  };

  let navigate = useNavigate();

  useEffect(() => {
    if (authService.isLoggedIn) {
      navigate("/feed", {
        replace: true,
      });
    }
  }, [authService.isLoggedIn]);

  const onLoginUser = (e) => {
    e.preventDefault();
    const { email, password } = userLogins;
    if (!!email && !!password) {
      authService
        .loginUser(email, password)
        .then(() => navigate("/feed"))
        .catch(() => {
          setError(true);
          setUserLogins({ email: "", password: "" });
        });
    }
  };

  const resetPassword = (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    const email = fData.get("email");
    authService
      .forgotPassword(email)
      .then(() => setForgotPassword(false))
      .catch((err) => {
        console.error(err);
      });
  };

  const errorMsg = "Sorry, you entered an incorrect email or password";

  const loginData = [
    {
      value: userLogins.email,
      type: "email",
      name: "email",
      placeholder: "youremail@gmail.com",
      key: 1,
    },
    {
      value: userLogins.password,
      type: "password",
      name: "password",
      placeholder: "password",
      key: 2,
    },
  ];

  return (
    <div className="heroContainer">
      <HeroLogo />
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
              <>
                <button
                  className="forgotPassword"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot your password?
                </button>
                {forgotPassword && (
                  <Modal
                    isOpen={forgotPassword}
                    close={() => setForgotPassword(false)}
                  >
                    <h3>Forgot your password?</h3>
                    <h5>Enter your email and reset your password.</h5>
                    <form
                      onSubmit={resetPassword}
                      className="forgotPasswordForm"
                    >
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                      />
                      <Button title="Reset Password" cname="submitBtn" />
                    </form>
                  </Modal>
                )}
                <div>
                  No Account? Create one
                  <button onClick={() => setRegister(true)}> HERE</button>
                </div>
              </>
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
