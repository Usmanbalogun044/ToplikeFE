import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "../Pages/Landingpage";
import Signup from "../Pages/Auth/Signup";
import Login from "../Pages/Auth/Login";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import Home from "../Pages/Dashboard/Home";
import CreatepostPage from "../Pages/Post/CreatepostPage";
import Walletpage from "../Pages/Wallet/Walletpage";
import CreateAccount from "../Pages/Bank/CreateAccount";
import Layout from "../Pages/Dashboard/Layout";
import Profilepage from "../Pages/Profile/Profilepage";
import VerifiedSubscription from "../Pages/Subscription/VerifiedSubscription";

const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/posts/create" element={<CreatepostPage />} />
            <Route path="/wallet" element={<Walletpage />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/profile" element={<Profilepage />} />
            <Route path="/verified" element={<VerifiedSubscription />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;
