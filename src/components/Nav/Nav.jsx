import React, { useContext, useState } from "react";
import logo from "../../assets/logo.png";
import "./Nav.css";
import PostContext from "../../PostContext";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import profile from "../../assets/defaultAvatar.png";

export default function Nav({
  profileModal,
  uploadModal,
  setIsFetching,
  isFetching,
}) {
  const { posts, setFilteredPosts } = useContext(PostContext);
  const { authService } = useContext(UserContext);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    const newFilter = posts.filter((post) => {
      return post.title.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(newFilter);
    }
  };

  return (
    <nav className="navBar">
      <Link className="navLogo" to="/feed">
        <img src={logo} alt="bookstagram logo" />
        <h2>bookstagram</h2>
      </Link>

      <div className="navOptions">
        <div className="postSearch">
          <input type="text" onChange={handleFilter} />
        </div>
        <div className="navIcons">
          <Link to="/explore" className="userIcon">
            <i className="fa-regular fa-compass fa-lg"></i>
          </Link>
          <div className="userIcon" onClick={uploadModal}>
            <i className="fa-solid fa-circle-plus fa-lg"></i>
          </div>
          <div className="userIcon" onClick={profileModal}>
            <img src={authService.avatar ?? profile} alt="user avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
}
