import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "../Pages/Landingpage";
import Signup from "../Pages/Auth/Signup";
import Login from "../Pages/Auth/Login";
import Home from "../Pages/Dashboard/Home";
import CreatepostPage from "../Pages/Post/CreatepostPage";
import Walletpage from "../Pages/Wallet/Walletpage";
import CreateAccount from "../Pages/Bank/CreateAccount";
import Layout from "../Pages/Dashboard/Layout";
import Profilepage from "../Pages/Profile/Profilepage";

const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/posts/create" element={<CreatepostPage />} />
            <Route path="/wallet" element={<Walletpage />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/profile" element={<Profilepage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;
