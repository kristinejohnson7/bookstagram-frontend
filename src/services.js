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
const URL_GET_POSTS = `${BASE_URL}/posts/`;

const headers = { "Content-Type": "application/json" };

class User {
  constructor() {
    this.id = "";
    this.name = "";
    this.email = "";
    this.isLoggedIn = false;
    console.log(this.id, "constructor");
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
    console.log("setting id", this.id);
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
    console.log("logged out", this.isLoggedIn);
  }

  setAuthToken(token) {
    this.authToken = token;
  }
  setBearerHeader(token) {
    this.bearerHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  getBearerHeader = () => this.bearerHeader;

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
      this.setUserData({
        name: response.data.data.name,
        email: response.data.data.email,
        _id: response.data.data._id,
      });
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
    const userId = this.id;
    console.log(userId);

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
    // this.selectedChannel = {};
    // this.channels = [];
    // this.unreadChannels = [];
    this.posts = [];
  }

  // addChannel = (channel) => this.channels.push(channel);
  addPost = (post) => this.posts.push(post);
  // setSelectedChannel = (channel) => (this.selectedChannel = channel);
  // getSelectedChannel = () => this.selectedChannel;
  // getAllChannels = () => this.channels;

  // addToUnread = (urc) => this.unreadChannels.push(urc);

  // setUnreadChannels = (channel) => {
  //   if (this.unreadChannels.includes(channel.id)) {
  //     this.unreadChannels = this.unreadChannels.filter(
  //       (ch) => ch !== channel.id
  //     );
  //   }
  //   return this.unreadChannels;
  // };

  // async findAllChannels() {
  //   const headers = this.getAuthHeader();
  //   try {
  //     let response = await axios.get(URL_GET_CHANNELS, { headers });
  //     response = response.data.map((channel) => ({
  //       name: channel.name,
  //       description: channel.description,
  //       id: channel._id,
  //     }));
  //     this.channels = [...response];
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  // async findAllMessagesForChannel(channelId) {
  //   const headers = this.getAuthHeader();
  //   try {
  //     let response = await axios.get(URL_GET_MESSAGES + channelId, { headers });
  //     response = response.data.map((msg) => ({
  //       userId: msg.userId,
  //       messageBody: msg.messageBody,
  //       channelId: msg.channelId,
  //       id: msg._id,
  //       userName: msg.userName,
  //       userAvatar: msg.userAvatar,
  //       userAvatarColor: msg.userAvatarColor,
  //       timeStamp: msg.timeStamp,
  //     }));
  //     this.messages = response;
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     this.messages = [];
  //     throw error;
  //   }
  // }

  // async deleteChannel(id) {
  //   const headers = this.getAuthHeader();
  //   try {
  //     const response = await axios.delete(URL_GET_CHANNELS + id, { headers });
  //     this.channels = response;
  //     console.log("this.channels", this.channels);
  //     return this.channels;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   } finally {
  //     this.messages.filter((message) => {
  //       if (message.channelId === id) {
  //         this.deleteMessage(message.id);
  //       }
  //     });
  //   }
  // }

  async findAllPosts() {
    try {
      const response = await axios.get(URL_GET_POSTS);
      // this.posts.push(response.data.data);
      console.log("await", response.data.data);
      return response.data.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // async findUserOfPost(id) {
  //   try {
  //     const response = await axios.get(URL_USER + "62d21a7926712d35824f33ad");
  //     console.log("response", response.data.data.name);
  //   } catch (err) {
  //     console.error(err);
  //     throw err;
  //   }
  // }

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

  async updateMessage(id, body) {
    const headers = this.getAuthHeader();
    try {
      const response = await axios.put(URL_GET_POSTS + id, body, { headers });
      console.log("response", response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export class SocketService {
  socket = io("http://localhost:3005/");
  constructor(chatService) {
    this.chatService = chatService;
  }

  establishConnection() {
    console.log("client connect");
    this.socket.connect();
  }

  closeConnection() {
    console.log("client disconnect");
    this.socket.disconnect();
  }

  addChannel(name, description) {
    this.socket.emit("newChannel", name, description);
  }

  getChannel(cb) {
    this.socket.on("channelCreated", (name, description, id) => {
      const channel = { name, description, id };
      this.chatService.addChannel(channel);
      const channelList = this.chatService.getAllChannels();
      cb(channelList);
    });
  }

  addMessage(messageBody, channelId, user) {
    const { userName, userId, userAvatar, userAvatarColor } = user;
    if (!!messageBody && !!channelId && !!user) {
      this.socket.emit(
        "newMessage",
        messageBody,
        userId,
        channelId,
        userName,
        userAvatar,
        userAvatarColor
      );
    }
  }

  getChatMessage(cb) {
    this.socket.on(
      "messageCreated",
      (
        messageBody,
        userId,
        channelId,
        userName,
        userAvatar,
        userAvatarColor,
        id,
        timeStamp
      ) => {
        const channel = this.chatService.getSelectedChannel();
        const chat = {
          messageBody,
          userId,
          channelId,
          userName,
          userAvatar,
          userAvatarColor,
          id,
          timeStamp,
        };
        if (
          channelId !== channel.id &&
          !this.chatService.unreadChannels.includes(channelId)
        ) {
          this.chatService.addToUnread(channelId);
        }
        this.chatService.messages = [...this.chatService.messages, chat];
        cb(chat, this.chatService.messages);
      }
    );
  }

  startTyping(userName, channelId) {
    this.socket.emit("startType", userName, channelId);
  }

  stopTyping(userName) {
    this.socket.emit("startType", userName);
  }

  getUserTyping(cb) {
    this.socket.on("userTypingUpdate", (typingUsers) => {
      cb(typingUsers);
    });
  }
}
