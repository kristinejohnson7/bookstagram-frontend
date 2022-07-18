import axios from "axios";
import io from "socket.io-client";

const BASE_URL = "http://localhost:5005/api/v1";
const URL_ACCOUNT = `${BASE_URL}/auth/me`;
const URL_LOGIN = `${BASE_URL}/auth/login`;
const URL_REGISTER = `${BASE_URL}/auth/register`;

const URL_USER = `${BASE_URL}/users/`;
// const URL_USER_ADD = `${URL_USER}/add`;
// const URL_USER_BY_EMAIL = `${URL_USER}/byEmail/`;

// const URL_GET_CHANNELS = `${BASE_URL}/channel/`;

// const URL_GET_MESSAGES = `${BASE_URL}/message/byChannel/`;
// const URL_GET_MSG = `${BASE_URL}/message/`;

const headers = { "Content-Type": "application/json" };

class User {
  constructor() {
    this.id = "";
    this.name = "";
    this.email = "";
    this.isLoggedIn = false;
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
  }
}

export class AuthService extends User {
  constructor() {
    super();
    this.authToken = "";
    this.bearerHeader = {};
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
  }
  setBearerHeader(token) {
    this.bearerHeader = {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    };
  }

  getBearerHeader = () => this.bearerHeader;

  // async registerUser(email, password) {
  //   const body = { email: email.toLowerCase(), password: password };
  //   try {
  //     await axios.post(URL_REGISTER, body);
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  async createUser(name, email, password) {
    const headers = this.getBearerHeader();
    const body = {
      name: name,
      email: email,
      password: password,
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
      this.setUserEmail(response.data.email);
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
      console.log("response", response);
      this.setUserData(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  // async findUserByEmail() {
  //   const headers = this.getBearerHeader();
  //   try {
  //     const response = await axios.get(URL_USER_BY_EMAIL + this.email, {
  //       headers,
  //     });
  //     this.setUserData(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async deleteUser() {
    const headers = this.getBearerHeader();
    try {
      return await axios.delete(URL_USER + this.id, { headers });
    } catch (error) {
      console.error(error);
    }
  }

  async updateUser({ name, email }) {
    const headers = this.getBearerHeader();
    const body = {
      name: name,
      email: email,
    };
    try {
      const response = await axios.put(URL_USER + this.id, body, { headers });
      this.setUserData(response);
      return this.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
