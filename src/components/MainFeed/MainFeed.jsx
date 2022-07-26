import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../App";
import Posts from "../Posts/Posts";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import UploadPost from "../UploadPost/UploadPost";
import "./MainFeed.css";
import Nav from "../Nav/Nav";
import UpdateProfile from "../UpdateProfile/UpdateProfile";

export default function MainFeed() {
  const { authService, socketService, postService } = useContext(UserContext);

  const [modal, setModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  // useEffect(() => {
  //   socketService.establishConnection();
  //   return () => socketService.closeConnection();
  // }, []);

  return (
    <>
      <Nav
        profileModal={() => setModal(true)}
        uploadModal={() => setUploadModal(true)}
      />
      <div className="mainFeedPosts">
        <UpdateProfile modalToggle={setModal} modal={modal} />
        {/* <Modal></Modal> */}
        <Posts />
        {/* <button onClick={() => setUploadModal(true)}>Create Post</button> */}
        {uploadModal && (
          <UploadPost close={() => setUploadModal(false)} modal="true" />
        )}
      </div>
    </>
  );
}
