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
import Hero from "./components/Hero/Hero";
import { AuthService } from "./services";

const authService = new AuthService();
// const chatService = new ChatService(authService.getBearerHeader);
// const socketService = new SocketService(chatService);
export const UserContext = createContext();
const AuthProvider = ({ children }) => {
  const context = {
    authService,
    // chatService,
    // socketService,
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

const PrivateRoute = ({ children, ...props }) => {
  const context = useContext(UserContext);
  const location = useLocation();

  if (!context.authService.isLoggedIn) {
    return (
      <Navigate {...props} to="/login" state={{ from: location }} replace />
    );
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Hero />} exact /> */}
          <Route path="/login" element={<UserLogin />} exact />
          <Route path="/" element={<UserCreate />} exact />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
