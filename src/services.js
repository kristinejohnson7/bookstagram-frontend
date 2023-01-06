import axios from "axios";

const BASE_URL = "https://combative-crow-sock.cyclic.app/api/v1";
// const BASE_URL = "http://localhost:5005/api/v1";
const URL_ACCOUNT = `${BASE_URL}/auth/me`;
const URL_LOGIN = `${BASE_URL}/auth/login`;
const URL_USER = `${BASE_URL}/users/`;
const URL_GET_POSTS = `${BASE_URL}/posts/`;

const headers = { "Content-Type": "application/json" };

class User {
  constructor() {
    this.id = "";
    this.name = "";
    this.email = "";
    this.avatar = "";
    this.userName = "";
    this.isLoggedIn = false;
  }

  setUserEmail(email) {
    this.email = email;
  }
  setIsLoggedIn(loggedIn) {
    this.isLoggedIn = loggedIn;
  }

  setUserData(userData) {
    const { _id, name, email, avatar, userName } = userData;
    this.id = _id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.userName = userName;
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
    if (this.authToken) {
      this.isLoggedIn = true;
    }
  }

  logoutUser() {
    this.id = "";
    this.name = "";
    this.userName = "";
    this.email = "";
    this.isLoggedIn = false;
    this.authToken = "";
    this.bearerHeader = {};
    this.avatar = "";
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
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
      Authorization: `Bearer ${token}`,
    };
    return this.bearerHeader;
  }

  getBearerHeader = () => this.bearerHeader;

  async createUser(body, options) {
    try {
      const response = await axios.post(URL_USER, body, {
        headers,
        ...options,
      });
      this.setUserData({
        _id: response.data.data._id,
        name: response.data.data.name,
        avatar: response.data.data.photo,
        email: response.data.data.email,
        userName: response.data.data.userName,
      });
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLoggedInUser() {
    const headers = this.getBearerHeader();
    try {
      const response = await axios.get(URL_ACCOUNT, { headers });
      this.setUserData({
        name: response.data.data.name,
        email: response.data.data.email,
        _id: response.data.data._id,
        avatar: response.data.data.photo,
        userName: response.data.data.userName,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async forgotPassword(email) {
    const headers = this.getBearerHeader();
    const body = {
      email: email,
    };
    try {
      await axios.post(`${BASE_URL}/auth/forgotpassword`, body, { headers });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUser(body, options) {
    const headers = this.getBearerHeader();
    try {
      const response = await axios.put(URL_USER + this.id, body, {
        headers,
        ...options,
      });
      this.setUserData({
        name: response.data.data.name,
        email: response.data.data.email,
        _id: response.data.data._id,
        avatar: response.data.data.photo,
        userName: response.data.data.userName,
      });
      return this.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteUser() {
    const headers = this.getBearerHeader();
    try {
      return await axios.delete(URL_USER + this.id, { headers });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export class PostService {
  constructor(authHeader) {
    this.getAuthHeader = authHeader;
  }

  async findAllPosts() {
    try {
      const response = await axios.get(URL_GET_POSTS);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findAllLikesForPost(postId) {
    try {
      await axios.get(`${URL_GET_POSTS}likes/${postId}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createLikeForPost(postId, userId) {
    const headers = this.getAuthHeader();
    try {
      const body = { likes: [`${userId}`] };
      await axios.put(`${URL_GET_POSTS}likes/${postId}`, body, { headers });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteLikeForPost(postId, userId) {
    const headers = this.getAuthHeader();
    try {
      await axios.delete(`${URL_GET_POSTS}likes/${postId}/${userId}`, {
        headers,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createPost(body, options) {
    const headers = this.getAuthHeader();
    try {
      await axios.post(URL_GET_POSTS, body, {
        headers,
        ...options,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async deletePost(id) {
    const headers = this.getAuthHeader();
    try {
      await axios.delete(URL_GET_POSTS + id, { headers });
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
