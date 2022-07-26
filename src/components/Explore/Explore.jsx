import React, { useContext, useState } from "react";
import "./Explore.css";
import PostContext from "../../PostContext";
import photo from "../../assets/post.jpg";
import Nav from "../Nav/Nav";
import UploadPost from "../UploadPost/UploadPost";
import UpdateProfile from "../UpdateProfile/UpdateProfile";
import Modal from "../Modal/Modal";

export default function Explore() {
  const { posts, setPosts } = useContext(PostContext);
  const [uploadModal, setUploadModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [exploreModal, setExploreModal] = useState(false);
  const [currentPost, setCurrentPost] = useState("");

  const handleExploreModal = (index) => {
    setCurrentPost(posts[index]);
    setExploreModal(true);
  };

  return (
    <>
      <Nav
        profileModal={() => setModal(true)}
        uploadModal={() => setUploadModal(true)}
      />
      {!!posts.length ? (
        <div class="image-grid">
          <img
            class="image-grid-col-2 image-grid-row-2"
            src={posts[0].photo}
            alt="architecture"
          />
          {posts.map((post, index) => {
            if (index !== 0) {
              return (
                <img
                  src={post.photo}
                  alt="explore post"
                  onClick={() => handleExploreModal(index)}
                />
              );
            } else return null;
          })}
        </div>
      ) : (
        <div className="noPostsExplore">No posts to explore</div>
      )}
      {exploreModal && (
        <Modal isOpen={exploreModal} close={() => setExploreModal(false)}>
          <div>{currentPost.title}</div>
        </Modal>
      )}
      <UpdateProfile modalToggle={setModal} modal={modal} />
      {uploadModal && (
        <UploadPost close={() => setUploadModal(false)} modal="true" />
      )}
    </>
  );
}
