import React, { useState } from "react";
import Navbar from "../../../Component/DashboardComponents/Navbar";
import Account from "../Account/Account";
import Categories from "../Category/Categories";
import ProfileSetting from "../ProfileSetting/ProfileSetting";
import "./Profile.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div>
      <Navbar />

      <div className="profile-container">

        {/* Sidebar */}
        <div className="profile-sidebar">
          <div
            className={activeTab === "account" ? "active" : ""}
            onClick={() => setActiveTab("account")}
          >
            Account
          </div>

          {/* <div
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            All Categories
          </div> */}

          <div
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile Settings
          </div>
        </div>

        {/* Right Content */}
        <div className="profile-content">
          {activeTab === "account" && <Account />}
          {/* {activeTab === "categories" && <Categories />} */}
          {activeTab === "profile" && <ProfileSetting />}
        </div>

      </div>
    </div>
  );
}

export default Profile;