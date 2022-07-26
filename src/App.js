import React, { useState, createContext, useContext, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import UserLogin from "./components/UserLogin/UserLogin";
import UserCreate from "./components/UserCreate/UserCreate";
import MainFeed from "./components/MainFeed/MainFeed";
import { AuthService, PostService } from "./services";
import { PostProvider } from "./PostContext";
import Explore from "./components/Explore/Explore";

const authService = new AuthService();
const postService = new PostService(authService.getBearerHeader);
// const socketService = new SocketService(postService);
export const UserContext = createContext();
const AuthProvider = ({ children }) => {
  const context = {
    authService,
    postService,
    // socketService,
    // appSelectedChannel: {},
    // appSetChannel: (ch) => {
    //   setAuthContext({ ...authContext, appSelectedChannel: ch });
    //   chatService.setSelectedChannel(ch);
    // },
  };
  const [authContext, setAuthContext] = useState(context);

  useEffect(() => {
    // console.log(authContext);
    if (authService.getAuthToken()) {
      authService.getLoggedInUser();
    }
  }, []);

  return (
    <UserContext.Provider value={authContext}>{children}</UserContext.Provider>
  );
};

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <Routes>
            <Route path="/" element={<UserLogin />} exact />
            <Route path="/register" element={<UserCreate />} exact />
            <Route
              path="/feed"
              element={
                // <PrivateRoute>
                <MainFeed />
                /* </PrivateRoute> */
              }
            />
            <Route path="/explore" element={<Explore />} />
          </Routes>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
