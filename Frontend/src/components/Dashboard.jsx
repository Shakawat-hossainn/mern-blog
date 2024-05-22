import React, { useEffect, useState } from "react";
import DashSidebar from "./DashSidebar";
import { useLocation } from "react-router-dom";
import DashProfile from "./DashProfile";
import Posts from "./Posts.jsx";
import Users from "./Users.jsx";
import DashComments from "./DashComments.jsx";
import DashComp from "./DashComp.jsx";

const Dashboard = () => {
  const [tab, setTab] = useState("");
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const getParams = urlParams.get("tab");
    //console.log(getParams)
    if (getParams) {
      setTab(getParams);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {/* post */}
      {tab === "posts" && <Posts />}
      {/* users */}
      {tab === "users" && <Users/>}
      {/* comments */}
      {tab === "comments" && <DashComments/>}
      {/* dash */}
      {tab === "dash" && <DashComp/>}
    </div>
  );
};

export default Dashboard;
