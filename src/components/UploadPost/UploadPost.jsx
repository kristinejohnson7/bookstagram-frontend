import React, { useContext, useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { UserContext } from "../../App";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import "./UploadPost.css";
import PostContext from "../../PostContext";
import { Progress } from "antd";

export default function UploadPost({ close, modal }) {
  const { postService } = useContext(UserContext);
  const { getPosts } = useContext(PostContext);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [percentage, setPercentage] = useState(0);

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

  const onPostUpload = (e) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    // fData.append("file", fData.get("photo"));
    console.log(fData.get("photo"));
    // fData.delete("photo");
    // fData.set("photo", files[0], files[0].name);
    fData.set("user", localStorage.getItem("userId"));
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb ${percent}%`);
        if (percent < 100) {
          setPercentage(percent);
        }
      },
    };
    postService
      .createPost(fData, options)
      .then((res) => {
        console.log(res);
        setPercentage(100);
        getPosts();
        close();
      })
      .catch((error) => {
        console.error("Upload post", error);
        setError(true);
      });
  };

  return (
    <Modal title="Profile" isOpen={true} close={close}>
      <form id="postForm" onSubmit={onPostUpload} className="uploadPostForm">
        <input type="file" name="photo" />
        {percentage > 0 && <Progress percent={percentage} />}
        <div className="uploadInputs">
          <FormBody formValues={uploadPostData} />
          <Button cname="submitBtn" title="Create post" />
        </div>
      </form>
    </Modal>
  );
}
