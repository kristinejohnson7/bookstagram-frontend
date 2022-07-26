import React, { useContext, useState } from "react";
import Modal from "../Modal/Modal";
import { UserContext } from "../../App";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import "./UploadPost.css";
import { useDropzone } from "react-dropzone";
import PostContext from "../../PostContext";
import { ProgressBar } from "react-bootstrap";

export default function UploadPost({ close, modal }) {
  const { postService } = useContext(UserContext);
  const { getPosts } = useContext(PostContext);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/",
    onDrop: (acceptFiles) => {
      setFiles(
        acceptFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const images = files.map((file) => (
    <div key={file.name}>
      <div>
        <img src={file.preview} alt="preview" style={{ width: "200px" }} />
      </div>
    </div>
  ));

  const uploadPostData = [
    // { type: "file", name: "photo" },
    {
      type: "text",
      name: "title",
      placeholder: "Enter your post title",
      key: 1,
    },
    {
      type: "text",
      name: "description",
      placeholder: "Enter your post description",
      key: 2,
    },
  ];

  const onPostUpload = (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    fData.set("photo", files[0], files[0].name);
    fData.set("user", localStorage.getItem("userId"));
    postService
      .createPost(fData, setProgress)
      .then(() => close())
      .then(getPosts)
      .catch((error) => {
        console.error("Upload post", error);
        setError(true);
      });
  };

  return (
    <Modal title="Profile" isOpen={modal} close={close}>
      <form id="postForm" onSubmit={onPostUpload} className="uploadPostForm">
        <div>
          <div {...getRootProps()} className="dragPhotoContainer">
            <input {...getInputProps()} />
            <p>Drag Files or Click to Browse</p>
          </div>
          <div className="imagePreview">{images}</div>
          {!error && progress && (
            <ProgressBar now={progress} label={`${progress}%`} />
          )}
        </div>
        <div className="uploadInputs">
          <FormBody formValues={uploadPostData} />
          <Button cname="submitBtn" title="Create post" />
        </div>
      </form>
    </Modal>
  );
}
