import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage";
import LiveAuctionPage from "./pages/liveauction";
import LoginPage from "./pages/loginpage";
import SignupPage from "./pages/signuppage";
import MyBidsPage from "./pages/mybidspage";
import WatchlistPage from "./pages/watchlistpage";
import UserProfile from "./pages/userprofilepage";
import AdminHome from "./pages/adminhome";
import AddItem from "./pages/admingitem";
import ManageUsers from "./pages/manageusers";
import ManageAuctions from "./pages/manageauctions";
import ContactPage from "./pages/contactpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/live-auction" element={<LiveAuctionPage />} />
      <Route path="/my-bids" element={<MyBidsPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/add" element={<AddItem />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/auctions" element={<ManageAuctions />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}

export default App;
