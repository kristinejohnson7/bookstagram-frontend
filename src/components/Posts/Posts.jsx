import React, { useState } from "react";
import { useContext } from "react";
import "./Posts.css";
// import posting from "../../assets/post.jpg";
import PostContext from "../../PostContext";
import dayjs from "dayjs";
import { UserContext } from "../../App";
import { Progress } from "antd";

export default function Posts() {
  const { filteredPosts, handleLikePost } = useContext(PostContext);
  const [updatePost, setUpdatePost] = useState(false);
  const { posts, setFilteredPosts, getPosts, loadingPosts } =
    useContext(PostContext);
  const { authService, postService } = useContext(UserContext);

  const handleLikeGrammar = (number) => {
    return number > 1 ? `${number} likes` : `${number} like`;
  };

  const userId = localStorage.getItem("userId");
  console.log("FILTERED POSTS", filteredPosts);

  const handleUpdatePost = (e, postId) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    const title = fData.get("updateTitle");
    const description = fData.get("updateDescription");
    postService
      .updateMessage(postId, title, description)
      .then(() => {
        getPosts();
      })
      .catch((error) => {
        console.error("Updating post", error);
      });
  };

  const handleDeletePost = (postId) => {
    postService
      .deletePost(postId)
      .then(() => {
        getPosts();
      })
      .catch((error) => {
        console.error("Deleting post", error);
      });
  };

  return (
    <div className="postsContainer">
      {loadingPosts ? (
        <div> Loading...</div>
      ) : (
        <>
          {/* <Progress percent={33} /> */}

          {!!filteredPosts.length ? (
            filteredPosts.map((post, index) => {
              const {
                _id,
                createdAt,
                description,
                photo,
                title,
                userName,
                likes,
                user,
              } = post;
              return (
                <div className="postCard" key={_id}>
                  <p className="cardName">{userName}</p>
                  <div className="postCardImg">
                    <img src={photo} alt="post" />
                  </div>
                  <div className="postCardText">
                    <div className="likeEdit">
                      <button
                        className="cardLikes"
                        onClick={() => handleLikePost(_id)}
                      >
                        <i
                          className={`${
                            post.likes.includes(userId)
                              ? "fa-solid"
                              : "fa-regular"
                          } fa-heart fa-lg`}
                        ></i>
                      </button>
                      {user === userId && (
                        <div className="editIcons">
                          <i
                            className="fa-solid fa-pen-to-square"
                            onClick={() => setUpdatePost(!updatePost)}
                          ></i>
                          <i
                            className="fa-regular fa-trash-can"
                            onClick={() => handleDeletePost(_id)}
                          ></i>
                        </div>
                      )}
                    </div>
                    <p>
                      {`${likes.length}` <= 0
                        ? "Be the first to like this post!"
                        : handleLikeGrammar(likes.length)}
                    </p>

                    <div>
                      {!updatePost ? (
                        <p>
                          <span>{title}</span>
                          {description}
                        </p>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            handleUpdatePost(e, _id);
                            setUpdatePost(false);
                          }}
                          className="updateForm"
                        >
                          <input
                            type="text"
                            name="updateTitle"
                            defaultValue={title}
                          />
                          <input
                            type="text"
                            name="updateDescription"
                            defaultValue={description}
                          />
                          <input
                            className="updateSubmit"
                            type="submit"
                            value="Update"
                          />
                        </form>
                      )}
                    </div>
                  </div>

                  <p className="cardDate">
                    {dayjs(createdAt).format("dddd MMM DD YYYY, h:mm a")}
                  </p>
                </div>
              );
            })
          ) : (
            <div>Be the first to post!</div>
          )}
        </>
      )}
    </div>
  );
}
