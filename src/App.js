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
import PasswordReset from "./components/PasswordReset/PasswordReset";

const authService = new AuthService();
const postService = new PostService(authService.getBearerHeader);
export const UserContext = createContext();
const AuthProvider = ({ children }) => {
  const context = {
    authService,
    postService,
  };
  const [authContext, setAuthContext] = useState(context);

  useEffect(() => {
    if (authService.getAuthToken()) {
      authService.getLoggedInUser();
    }
  }, []);

  return (
    <UserContext.Provider value={authContext}>{children}</UserContext.Provider>
  );
};

const PrivateRoute = ({ children, ...props }) => {
  const location = useLocation();
  const context = useContext(UserContext);

  if (!context.authService.isLoggedIn) {
    return <Navigate {...props} to="/" state={{ from: location }} replace />;
  }

  return children;
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
                <PrivateRoute>
                  <MainFeed />
                </PrivateRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <PrivateRoute>
                  <Explore />
                </PrivateRoute>
              }
            />
            <Route path="/reset/:resetToken" element={<PasswordReset />} />
          </Routes>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
