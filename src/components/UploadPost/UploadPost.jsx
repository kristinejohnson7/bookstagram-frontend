import React from "react";
import Modal from "../Modal/Modal";

export default function UploadPost({ close, modal }) {
  const handlePostUpload = (e) => {
    e.preventDefault();
  };

  return (
    <Modal title="Profile" isOpen={modal} close={close}>
      <form onSubmit={handlePostUpload}>
        <input type="file" />
        <input type="text" />
        <input type="text" />
        <input type="submit" />
      </form>
    </Modal>
  );
}
