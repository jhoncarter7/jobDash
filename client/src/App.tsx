import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/Auth/Signin";
import JobListings from "./pages/Job/jobList";
import Signup from "./pages/Auth/SignUp";
import RecruiterPage from "./pages/Job/RecruiterPage";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/navBar";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated}/>
      <ToastContainer />

      <Routes>
        <Route path="/SignIn" element={<SignIn setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/RecruiterPage" element={<RecruiterPage />} />
        <Route path="/jobs" element={<JobListings  isAuthenticated={isAuthenticated}/>} />
      </Routes>
    </Router>
  );
};

export default App;
