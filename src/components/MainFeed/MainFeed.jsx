import React, { useState } from "react";
import Posts from "../Posts/Posts";
import UploadPost from "../UploadPost/UploadPost";
import "./MainFeed.css";
import Nav from "../Nav/Nav";
import UpdateProfile from "../UpdateProfile/UpdateProfile";

export default function MainFeed() {
  const [modal, setModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  return (
    <>
      <Nav
        profileModal={() => setModal(true)}
        uploadModal={() => setUploadModal(true)}
      />
      <div className="mainFeedPosts">
        <UpdateProfile modalToggle={setModal} modal={modal} />
        <Posts />
        {uploadModal && (
          <UploadPost close={() => setUploadModal(false)} modal="true" />
        )}
      </div>
    </>
  );
}
