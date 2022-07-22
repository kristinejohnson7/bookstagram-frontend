import React, { useContext, useState } from "react";
import Modal from "../Modal/Modal";
import { UserContext } from "../../App";

export default function UploadPost({ close, modal }) {
  const { postService } = useContext(UserContext);
  const [error, setError] = useState(false);

  const handlePostUpload = (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    const postData = {
      image: fData.get("image"),
      description: fData.get("description"),
      title: fData.get("title"),
    };
    postService
      .createPost(postData.image, postData.description, postData.title)
      .then(() => close)
      .catch((error) => {
        console.error("Upload post", error);
        setError(true);
      });
  };

  return (
    <Modal title="Profile" isOpen={modal} close={close}>
      <form onSubmit={handlePostUpload}>
        <label htmlFor="image">
          Upload Photo
          <input type="file" id="image" name="image" />
        </label>
        <label htmlFor="description">
          Description
          <input type="text" name="description" id="description" />
        </label>
        <label htmlFor="title">
          Title
          <input type="text" name="title" id="title" />
        </label>
        <input type="submit" />
      </form>
    </Modal>
  );
}
