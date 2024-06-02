import React, { useEffect } from "react";
import Header from "./components/header/Header";
import Sidebar from "../../components/ui/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authData = JSON.parse(sessionStorage.getItem("auth"));
    if (!authData || !authData.isLogin) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <div className="bg-black min-h-screen">
      <Header />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Root;
