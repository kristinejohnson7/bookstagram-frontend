import React, { useContext, useState } from "react";
import Modal from "../Modal/Modal";
import { UserContext } from "../../App";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import "./UploadPost.css";
import PostContext from "../../PostContext";
import { Progress } from "antd";

export default function UploadPost({ close }) {
  const { postService } = useContext(UserContext);
  const { getPosts } = useContext(PostContext);
  const [titleError, setTitleError] = useState(false);
  const [file, setFile] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);

  const uploadPostData = [
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

  const checkErrorBeforeSave = (data) => {
    let errorValue = "";
    let isError = false;
    Object.keys(data).forEach((val) => {
      if (data[val].length === 0 || data[val] === null) {
        errorValue = "Required";
        isError = true;
      }
    });
    setTitleError(errorValue);
    return isError;
  };

  const onPostUpload = (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    const uploadPostData = {
      title: fData.get("title"),
    };
    const errorCheck = checkErrorBeforeSave(uploadPostData);

    if (!errorCheck) {
      fData.set("user", localStorage.getItem("userId"));
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          if (percent < 100) {
            setPercentage(percent);
          }
        },
      };
      postService
        .createPost(fData, options)
        .then((res) => {
          setPercentage(100);
          getPosts();
          close();
        })
        .catch((error) => {
          console.error("Upload post", error);
          setUploadError(true);
        });
    }
  };

  const imagePreview = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Modal title="Profile" isOpen={true} close={close}>
      <form id="postForm" onSubmit={onPostUpload} className="uploadPostForm">
        <label className="custom-file-upload">
          <i className="fa-solid fa-upload fa-lg"></i>
          <br />
          Click or drag image to this area to upload
          <input
            type="file"
            name="photo"
            onChange={imagePreview}
            accept="image/*"
            required
          />
        </label>
        {file && (
          <div className="imgPreview">
            <i className="fa-solid fa-x fa-lg" onClick={() => setFile("")}></i>
            <img src={file} alt="post preview" />
          </div>
        )}
        <div className="uploadInputs">
          <FormBody formValues={uploadPostData} error={titleError} />
          <Button cname="submitBtn" title="Create post" />
          {percentage > 0 && <Progress percent={percentage} />}
          {uploadError && (
            <p className="alert alert-danger">
              Error uploading post, please try again.
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
