import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../App";
import Posts from "../Posts/Posts";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import UploadPost from "../UploadPost/UploadPost";
import "./MainFeed.css";
import Nav from "../Nav/Nav";

export default function MainFeed() {
  const { authService, socketService, postService } = useContext(UserContext);
  const CURRENT_PROFILE = {
    name: authService.name,
    email: authService.email,
    avatarName: authService.avatarName,
    avatarColor: authService.avatarColor,
  };
  const [modal, setModal] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(CURRENT_PROFILE);
  const [error, setError] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  // useEffect(() => {
  //   socketService.establishConnection();
  //   return () => socketService.closeConnection();
  // }, []);

  const handleUpdateProfile = () => {
    setUpdateProfile(true);
  };

  const logoutUser = () => {
    setModal(false);
    //fixed memory leak from router not releasing socket io emitters
    window.location = "/";
  };

  const deleteUser = () => {
    const result = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (result) {
      // authService.logoutUser();
      authService
        .deleteUser()
        .then(() => logoutUser())
        .catch((err) => console.error(err));
    }
  };
  const editProfile = [
    {
      type: "text",
      id: "userName",
      name: "name",
      defaultValue: `${authService.name}`,
      forLabel: "userName",
      label: "User Name:",
    },
    {
      type: "email",
      id: "email",
      name: "email",
      defaultValue: `${authService.email}`,
      forLabel: "email",
      label: "Email: ",
    },
  ];

  const onProfileUpdate = (e) => {
    e.preventDefault();
    setError(false);
    const fData = new FormData(e.target);
    const userData = {
      name: fData.get("name"),
      email: fData.get("email"),
    };
    setUserInfo(userData);
    authService
      .updateUser(userData)
      .then((user) => {
        // setUserInfo(user);
        authService.setUserData({
          _id: authService.id,
          name: userData.name,
          email: userData.email,
        });
      })
      .catch((error) => {
        console.error("Update profile", error);
        setError(true);
        throw error;
      });
    setUpdateProfile(false);
  };

  return (
    <>
      <Nav
        profileModal={() => setModal(true)}
        uploadModal={() => setUploadModal(true)}
      />
      <div className="mainFeedPosts">
        <Modal isOpen={modal} close={() => setModal(false)}>
          {!updateProfile && (
            <>
              <h3>Profile:</h3>
              <div className="profile">
                <h4>
                  USERNAME: <span>{CURRENT_PROFILE.name}</span>
                </h4>
                <h4>
                  EMAIL: <span>{CURRENT_PROFILE.email}</span>{" "}
                </h4>
              </div>
              <Button
                handleOnClick={handleUpdateProfile}
                title="Edit Profile"
                cname="profileBtn"
              />
              <Button
                handleOnClick={logoutUser}
                title="Logout"
                cname="logoutBtn"
              />
              <Button
                handleOnClick={deleteUser}
                title="Delete User"
                cname="deleteBtn"
              />
            </>
          )}
          {updateProfile && (
            <div>
              <h3>Create new post:</h3>
              <form onSubmit={onProfileUpdate} className="form">
                <FormBody formValues={editProfile} />
                <Button title="Save Changes" cname="submitBtn" />
                {error && <div>Error updating profile, please try again.</div>}
              </form>
            </div>
          )}
        </Modal>
        <Modal></Modal>
        <Posts />
        {/* <button onClick={() => setUploadModal(true)}>Create Post</button> */}
        {uploadModal && (
          <UploadPost close={() => setUploadModal(false)} modal="true" />
        )}
      </div>
    </>
  );
}
