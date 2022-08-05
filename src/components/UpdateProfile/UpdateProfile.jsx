import React, { useContext, useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import { UserContext } from "../../App";
import "./UpdateProfile.css";
import profile from "../../assets/defaultAvatar.png";

export default function UpdateProfile({
  modal,
  modalToggle,
  setIsFetching,
  isFetching,
}) {
  const { authService } = useContext(UserContext);

  const CURRENT_PROFILE = {
    name: authService.name,
    email: authService.email,
    avatar: authService.avatar,
  };
  const [updateProfile, setUpdateProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(CURRENT_PROFILE);
  const [error, setError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [percentage, setPercentage] = useState(0);

  const handleUpdateProfile = () => {
    setUpdateProfile(true);
  };

  const onProfileUpdate = (e) => {
    e.preventDefault();
    setError(false);
    const fData = new FormData(e.target);
    const userData = {
      name: fData.get("name"),
      email: fData.get("email"),
      avatar: imagePreview,
    };
    setUserInfo(userData);
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        if (percent < 100) {
          setPercentage(percent);
        }
      },
    };
    setIsFetching(true);
    authService
      .updateUser(fData, options)
      .catch((error) => {
        console.error("Update profile", error);
        setError(true);
        throw error;
      })
      .finally(() => setIsFetching(false));
    setUpdateProfile(false);
  };

  const logoutUser = () => {
    modalToggle(false);
    authService.logoutUser();
    window.location = "/";
  };

  const deleteUser = () => {
    const result = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (result) {
      authService
        .deleteUser()
        .then(() => logoutUser())
        .catch((err) => console.error(err));
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

  const editProfile = [
    {
      type: "text",
      id: "name",
      name: "name",
      defaultValue: `${authService.name}`,
      forLabel: "name",
      label: "Name:",
      key: 1,
    },
    {
      type: "text",
      id: "userName",
      name: "userName",
      defaultValue: `${authService.userName}`,
      forLabel: "userName",
      label: "User Name:",
      key: 2,
    },
    {
      type: "email",
      id: "email",
      name: "email",
      defaultValue: `${authService.email}`,
      forLabel: "email",
      label: "Email: ",
      key: 3,
    },
  ];

  return (
    <Modal isOpen={modal} close={() => modalToggle(false)}>
      {!updateProfile && (
        <>
          <h3>Profile:</h3>
          <div className="profile">
            <div className="profileUpdateAvatar">
              <img
                src={imagePreview ?? authService.avatar ?? profile}
                alt="user avatar"
              />
            </div>
            <h4>
              NAME: <span>{authService.name}</span>
            </h4>
            <h4>
              USERNAME: <span>{authService.userName}</span>
            </h4>
            <h4>
              EMAIL: <span>{authService.email}</span>
            </h4>
          </div>
          <Button
            handleOnClick={handleUpdateProfile}
            title="Edit Profile"
            cname="profileBtn"
          />
          <Button handleOnClick={logoutUser} title="Logout" cname="logoutBtn" />
          <Button
            handleOnClick={deleteUser}
            title="Delete User"
            cname="deleteBtn"
          />
        </>
      )}
      {updateProfile && (
        <div>
          <h3>Update profile:</h3>
          <form onSubmit={onProfileUpdate} className="form">
            <div className="signup-profile-pic__container">
              <img
                src={imagePreview ?? authService.avatar ?? profile}
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
            <FormBody formValues={editProfile} />
            <Button title="Save Changes" cname="submitBtn" />
            {error && (
              <div className="alert alert-danger">
                Error updating profile, please try again.
              </div>
            )}
          </form>
        </div>
      )}
    </Modal>
  );
}
