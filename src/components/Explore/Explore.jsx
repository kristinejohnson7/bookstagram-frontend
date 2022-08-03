import React, { useContext, useState } from "react";
import "./Explore.css";
import PostContext from "../../PostContext";
import Nav from "../Nav/Nav";
import UploadPost from "../UploadPost/UploadPost";
import UpdateProfile from "../UpdateProfile/UpdateProfile";
import Modal from "../Modal/Modal";

export default function Explore() {
  const { posts } = useContext(PostContext);
  const [uploadModal, setUploadModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [exploreModal, setExploreModal] = useState(false);
  const [currentPost, setCurrentPost] = useState("");

  const handleExploreModal = (index) => {
    setCurrentPost(posts[index]);
    setExploreModal(true);
  };

  const handleLikeGrammar = (number) => {
    return (
      <div className="exploreLikeContainer">
        <i className="fa-solid fa-heart"></i>
        {number > 1 ? `${number} likes` : `${number} like`}
      </div>
    );
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
            className="image-grid-col-2 image-grid-row-2"
            src={posts[0].photo}
            alt="architecture"
            onClick={() => handleExploreModal(0)}
          />
          {posts.map((post, index) => {
            if (index !== 0) {
              return (
                <img
                  key={post.id}
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
          <div className="explorePostContainer">
            <div className="explorePostImg">
              <img src={currentPost.photo} alt="post" />
            </div>
            <div className="explorePostContent">
              <div className="exploreHeaderLike">
                <h4>{currentPost.userName}</h4>
                <p>
                  {`${currentPost.likes.length}` <= 0
                    ? "No likes yet!"
                    : handleLikeGrammar(currentPost.likes.length)}
                </p>
              </div>
              <div>{currentPost.title}</div>
            </div>
          </div>
        </Modal>
      )}
      <UpdateProfile modalToggle={setModal} modal={modal} />
      {uploadModal && (
        <UploadPost close={() => setUploadModal(false)} modal="true" />
      )}
    </>
  );
}
