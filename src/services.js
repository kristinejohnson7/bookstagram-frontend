import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";
import axios from "axios";
// import io from "socket.io-client";

const BASE_URL = "http://localhost:5005/api/v1";
const URL_ACCOUNT = `${BASE_URL}/auth/me`;
const URL_LOGIN = `${BASE_URL}/auth/login`;
const URL_REGISTER = `${BASE_URL}/auth/register`;

const URL_USER = `${BASE_URL}/users/`;
// const URL_USER_ADD = `${URL_USER}/add`;
// const URL_USER_BY_EMAIL = `${URL_USER}/byEmail/`;

// const URL_GET_CHANNELS = `${BASE_URL}/channel/`;

// const URL_GET_MESSAGES = `${BASE_URL}/message/byChannel/`;
const URL_GET_POSTS = `${BASE_URL}/posts/`;

const headers = { "Content-Type": "application/json" };

class User {
  constructor() {
    this.id = "";
    this.name = "";
    this.email = "";
    this.isLoggedIn = false;
    console.log(this.name, "set data name in constructor");
  }

  setUserEmail(email) {
    this.email = email;
  }
  setIsLoggedIn(loggedIn) {
    this.isLoggedIn = loggedIn;
  }

  setUserData(userData) {
    const { _id, name, email } = userData;
    this.id = _id;
    this.name = name;
    this.email = email;
    localStorage.setItem("userId", this.id);
  }
}

export class AuthService extends User {
  constructor() {
    super();
    this.authToken = localStorage.getItem("authToken");
    this.bearerHeader = this.authToken
      ? this.setBearerHeader(this.authToken)
      : {};
    console.log("auth", this.authToken);
    console.log("bear", this.bearerHeader);
  }

  logoutUser() {
    this.id = "";
    this.name = "";
    this.email = "";
    this.isLoggedIn = false;
    this.authToken = "";
    this.bearerHeader = {};
  }

  setAuthToken(token) {
    this.authToken = token;
    localStorage.setItem("authToken", token);
  }

  getAuthToken() {
    return this.authToken || localStorage.getItem("authToken");
  }

  setBearerHeader(token) {
    this.bearerHeader = {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    return this.bearerHeader;
  }

  getBearerHeader = () => this.bearerHeader;

  async createUser(name, email, password, photo) {
    const headers = this.getBearerHeader();
    console.log("photo", photo);
    const body = {
      name: name,
      email: email,
      password: password,
      photo: photo,
    };
    try {
      const response = await axios.post(URL_REGISTER, body, { headers });
      this.setUserData(response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async loginUser(email, password) {
    const body = { email: email.toLowerCase(), password: password };
    try {
      const response = await axios.post(URL_LOGIN, body, { headers });
      this.setAuthToken(response.data.token);
      this.setBearerHeader(response.data.token);
      this.setIsLoggedIn(true);
      await this.getLoggedInUser();
      console.log("logged in BOL", this.isLoggedIn);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLoggedInUser() {
    const headers = this.getBearerHeader();
    try {
      const response = await axios.get(URL_ACCOUNT, { headers });
      console.log("logged in user", response.data);

      this.setUserData({
        name: response.data.data.name,
        email: response.data.data.email,
        _id: response.data.data._id,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteUser() {
    const headers = this.getBearerHeader();
    const userId = this.id;
    console.log(this);

    try {
      return await axios.delete(URL_USER + this.id, { headers });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUser({ name, email }) {
    const headers = this.getBearerHeader();
    const body = {
      name: name,
      email: email,
    };
    try {
      console.log("thisid", this.id);
      const response = await axios.put(URL_USER + this.id, body, { headers });
      this.setUserData(response);
      return this.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export class PostService {
  constructor(authHeader) {
    this.getAuthHeader = authHeader;
    this.posts = [];
    this.uploadProgressCallback = null;
  }

  setPosts(newPosts) {
    this.posts = newPosts;
  }

  addPost = (post) => this.posts.push(post);

  async findAllPosts() {
    try {
      const response = await axios.get(URL_GET_POSTS);
      // this.posts.push(response.data.data);
      this.posts = response.data.data;
      console.log("posts", this.posts);
      return response.data.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findAllLikesForPost(postId) {
    try {
      const response = await axios.get(`${URL_GET_POSTS}likes/${postId}`);
      // this.posts.push(response.data.data);
      const postLikes = response.data.data;
      console.log("postLikes", postLikes);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createLikeForPost(postId, userId) {
    const headers = this.getAuthHeader();
    try {
      const body = { likes: [`${userId}`] };
      const response = await axios.put(
        `${URL_GET_POSTS}likes/${postId}`,
        body,
        { headers }
      );
      // this.posts.push(response.data.data);
      const postLikes = response.data.data;
      console.log("postLikes", postLikes);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteLikeForPost(postId, userId) {
    const headers = this.getAuthHeader();
    console.log("postid", postId);
    console.log("user", userId);
    try {
      const response = await axios.delete(
        `${URL_GET_POSTS}likes/${postId}/${userId}`,
        { headers }
      );
      // this.posts.push(response.data.data);
      const postLikes = response.data.data;
      console.log("postLikes", postLikes);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createPost(body, options) {
    const headers = this.getAuthHeader();
    try {
      console.log(body, "body");
      // const body = {
      //   photo: photo,
      //   description: description,
      //   title: title,
      // };
      const response = await axios.post(URL_GET_POSTS, body, {
        headers,
        ...options,
        // "Content-Type": "multipart/form-data",
        // onUploadProgress: (data) => {
        //   console.log("data", data);
        //   return setProgress(Math.round((100 * data.loaded) / data.total));
        // },
      });
      console.log("response", response);
    } catch (err) {
      console.error(err);
    }
  }

  async deletePost(id) {
    const headers = this.getAuthHeader();
    try {
      const response = await axios.delete(URL_GET_POSTS + id, { headers });
      this.posts = this.posts.filter((post) => post !== response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateMessage(id, title, description) {
    const headers = this.getAuthHeader();
    const body = {
      title: title,
      description: description,
    };
    try {
      await axios.put(URL_GET_POSTS + id, body, { headers });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
