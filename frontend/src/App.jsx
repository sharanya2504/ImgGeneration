import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [activeForm, setActiveForm] = useState("login"); // login or register
  const [isLoggedIn, setIsLoggedIn] = useState(false);   // track login state

  // On mount, check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // Called when user successfully logs in
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token); // persist token
    setIsLoggedIn(true);
  };

  // Called when user successfully registers
  const handleRegisterSuccess = (token) => {
    localStorage.setItem("token", token); // persist token
    setIsLoggedIn(true);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    setIsLoggedIn(false);
    setActiveForm("login");
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div>
      {activeForm === "login" ? (
        <LoginForm
          onLogin={handleLoginSuccess}
          onSwitchToRegister={() => setActiveForm("register")}
        />
      ) : (
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setActiveForm("login")}
        />
      )}
    </div>
  );
}

export default App;
