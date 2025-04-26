import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "../Pages/Landingpage";
import Signup from "../Pages/Auth/Signup";
import Login from "../Pages/Auth/Login";
import Home from "../Pages/Dashboard/Home";
import CreatepostPage from "../Pages/Post/CreatepostPage";

const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/posts/create" element={<CreatepostPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;
