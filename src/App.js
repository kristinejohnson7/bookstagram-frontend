import React, { useState, createContext, useContext } from "react";
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
import { AuthService, SocketService, PostService } from "./services";

const authService = new AuthService();
const postService = new PostService(authService.getBearerHeader);
const socketService = new SocketService(postService);
export const UserContext = createContext();
const AuthProvider = ({ children }) => {
  const context = {
    authService,
    postService,
    socketService,
    // appSelectedChannel: {},
    // appSetChannel: (ch) => {
    //   setAuthContext({ ...authContext, appSelectedChannel: ch });
    //   chatService.setSelectedChannel(ch);
    // },
  };
  const [authContext, setAuthContext] = useState(context);

  return (
    <UserContext.Provider value={authContext}>{children}</UserContext.Provider>
  );
};

// const PrivateRoute = ({ children, ...props }) => {
//   const context = useContext(UserContext);
//   const location = useLocation();

//   if (!context.authService.isLoggedIn) {
//     return (
//       <Navigate {...props} to="/login" state={{ from: location }} replace />
//     );
//   }

//   return children;
// };

const PrivateRoute = ({ children, ...props }) => {
  const context = useContext(UserContext);
  const location = useLocation();

  if (!context.authService.isLoggedIn) {
    return <Navigate {...props} to="/" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
