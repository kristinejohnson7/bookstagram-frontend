import React, { useContext, useState } from "react";
import Modal from "../Modal/Modal";
import { UserContext } from "../../App";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";
import "./UploadPost.css";
import PostContext from "../../PostContext";
import axios from "axios";
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

  // const onPostUpload = (e) => {

  // postService
  //   .createPost(fData)
  //   .then(() => close())
  //   .then(getPosts)

  // };

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

// import React, { useContext, useState } from "react";
// import Modal from "../Modal/Modal";
// import { UserContext } from "../../App";
// import Button from "../Button/Button";
// import FormBody from "../FormBody/FormBody";
// import "./UploadPost.css";
// // import { useDropzone } from "react-dropzone";
// import PostContext from "../../PostContext";
// // import { ProgressBar } from "react-bootstrap";
// import axios from "axios";
// // import { ProgressBar, Row, Col } from "react-bootstrap";
// // import "bootstrap/dist/css/bootstrap.min.css";
// import { Progress, message, Upload, Input, Form, Spin } from "antd";
// import { InboxOutlined } from "@ant-design/icons";
// const { Dragger } = Upload;

// const props = {
//   name: "file",
//   multiple: true,
//   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",

//   onChange(info) {
//     const { status } = info.file;

//     if (status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }

//     if (status === "done") {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },

//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer.files);
//   },
// };

// export default function UploadPost({ close, modal }) {
//   const { postService } = useContext(UserContext);
//   const { getPosts } = useContext(PostContext);
//   const [error, setError] = useState(false);
//   const [files, setFiles] = useState([]);
//   const [percentage, setPercentage] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [form] = Form.useForm();

//   // const uploadPostData = [
//   //   // { type: "file", name: "photo" },
//   //   {
//   //     type: "text",
//   //     name: "title",
//   //     placeholder: "Enter your post title",
//   //     key: 1,
//   //   },
//   //   {
//   //     type: "text",
//   //     name: "description",
//   //     placeholder: "Enter your post description",
//   //     key: 2,
//   //   },
//   // ];

//   const onPostUpload = (values) => {
//     // e.preventDefault();
//     const { title, file } = values;
//     // const fData = new FormData(e.target);
//     // fData.set("photo", files[0], files[0].name);
//     // fData.set("user", localStorage.getItem("userId"));
//     postService
//       .createPost(title, file)
//       .then(() => close())
//       .then(getPosts)
//       .catch((error) => {
//         console.error("Upload post", error);
//         setError(true);
//       });
//     console.log("good");
//   };

//   const uploadFile = (e) => {
//     console.log(e.target);
//     console.log(files[0]);
//     let data = new FormData();
//     data.append("file", files[0]);
//     const options = {
//       onUploadProgress: (progressEvent) => {
//         const { loaded, total } = progressEvent;
//         let percent = Math.floor((loaded * 100) / total);
//         console.log(`${loaded}kb of ${total}kb ${percent}%`);
//         if (percent < 100) {
//           setPercentage(percent);
//         }
//       },
//     };
//     axios
//       .post("http://localhost:5005/api/v1/posts", data, options)
//       .then((res) => {
//         console.log(res);
//         setPercentage(100);
//       });
//   };

//   const props = {
//     name: "file",
//     // customRequest: onPostUpload,
//     maxCount: 1,
//     progress: {
//       format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
//     },
//     beforeUpload: (file) => {
//       const isPNG = file.type === "image/png";
//       const isJPG = file.type === "image/jpg";
//       const isJPEG = file.type === "image/jpeg";
//       if (!isPNG && !isJPG && !isJPEG) {
//         Notification(
//           "error",
//           "Wrong File Type",
//           `${file.name} is not a png, jpg, or jpeg file`
//         );
//         return isPNG || isJPG || isJPEG || Upload.LIST_IGNORE;
//       }
//       return true;
//     },
//   };

//   const getFile = (e) => {
//     if (Array.isArray(e)) {
//       return e;
//     }

//     return e && e.fileList;
//   };

//   return (
//     <Modal title="Profile" isOpen={true} close={close}>
//       {/* <form id="postForm" onSubmit={onPostUpload} className="uploadPostForm"> */}

//       {/* <input type="file" onChange={uploadFile} /> */}
//       {/* {percentage > 0 && <Progress percent={percentage} />} */}
//       <Form onFinish={uploadFile} form={form}>
//         <Form.Item
//           label="Post Title"
//           name="title"
//           rules={[
//             {
//               required: true,
//               message: "Please write a book title",
//             },
//           ]}
//         >
//           <Input type="text" />
//         </Form.Item>
//         <Form.Item label="Upload Photo">
//           <Form.Item
//             name="photo"
//             valuePropName="fileList"
//             getValueFromEvent={getFile}
//             noStyle
//             rules={[
//               {
//                 required: true,
//                 message: "Please upload a photo",
//               },
//             ]}
//           >
//             <Dragger {...props}>
//               <p className="ant-upload-drag-icon">
//                 <InboxOutlined />
//               </p>
//               <p className="ant-upload-text">
//                 Click or drag file to this area to upload
//               </p>
//               <p className="ant-upload-hint">
//                 Support for a single or bulk upload. Strictly prohibit from
//                 uploading company data or other band files
//               </p>
//             </Dragger>
//           </Form.Item>
//         </Form.Item>
//       </Form>
//       {/* <div className="uploadInputs">
//           <FormBody formValues={uploadPostData} />
//           <Button cname="submitBtn" title="Create post" />
//         </div> */}
//       {/* </form> */}
//     </Modal>
//   );
