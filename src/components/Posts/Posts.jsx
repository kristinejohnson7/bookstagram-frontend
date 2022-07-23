import React from "react";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../App";
import "./Posts.css";
import posting from "../../assets/post.jpg";

export default function Posts() {
  const { postService } = useContext(UserContext);

  const [posts, setPosts] = useState([]);

  const getPosts = () => {
    postService.findAllPosts().then((posts) => setPosts(posts));
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="postsContainer">
      {!!posts.length ? (
        posts.map((post) => {
          const { _id, createdAt, description, photo, title, userName } = post;
          return (
            <div className="postCard" key={_id}>
              <p className="cardName">{userName}</p>
              <img src={photo} alt="post" />
              {/* <div className="postCardImg">
                <img src={posting} alt="" />
              </div> */}
              <div className="postCardText">
                <div className="cardLikes">
                  <i class="fa-regular fa-heart fa-lg"></i>
                </div>
                <p>
                  <span>{title}</span>
                  {description}
                </p>
              </div>
              <p className="cardDate">{createdAt}</p>
            </div>
          );
        })
      ) : (
        <div>No posts</div>
      )}
    </div>
  );
}
