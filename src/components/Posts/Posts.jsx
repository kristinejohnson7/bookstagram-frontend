import React from "react";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../App";

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
    <>
      <div>POSTS FORUM</div>
      {!!posts.length ? (
        posts.map((post) => {
          const { _id, createdAt, description, photo, title, userName } = post;
          return (
            <div className="postContainer" key={_id}>
              <h2>{title}</h2>
              <p>{userName}</p>
              <p>{createdAt}</p>
              <p>{description}</p>
              <img src={photo} alt="post" />
            </div>
          );
        })
      ) : (
        <div>No posts</div>
      )}
    </>
  );
}