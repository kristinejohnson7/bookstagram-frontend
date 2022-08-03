import { createContext, useEffect, useState, useContext } from "react";
import { UserContext } from "./App";

const PostContext = createContext();

export function PostProvider({ children }) {
  const { postService } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const getPosts = () => {
    setLoadingPosts(true);
    postService
      .findAllPosts()
      .then((posts) => {
        setPosts(posts);
        setLoadingPosts(false);
      })
      .catch((error) => {
        console.error("Error loading posts", error);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleLikePost = (postId) => {
    const likes = posts.find((post) => post._id === postId).likes;
    const userId = localStorage.getItem("userId");
    if (likes.includes(userId)) {
      postService
        .deleteLikeForPost(postId, userId)
        .then((res) => {
          getPosts();
        })
        .catch((error) => console.error("Like for post", error));
    } else {
      postService
        .createLikeForPost(postId, userId)
        .then((res) => {
          getPosts();
        })
        .catch((error) => console.error("Like for post", error));
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        filteredPosts,
        setPosts,
        setFilteredPosts,
        handleLikePost,
        getPosts,
        loadingPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export default PostContext;
