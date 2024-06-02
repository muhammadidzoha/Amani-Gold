import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { HSStaticMethods } from "preline";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/Auth/Login";
import Root from "./pages/Dashboard/Root";
import Cards from "./pages/Dashboard/Cards";
import Users from "./pages/Dashboard/Users";

function App() {
  const location = useLocation();

  useEffect(() => {
    HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="/user" element={<Users />} />
        <Route path="/card" element={<Cards />} />
      </Route>
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  );
}

export default App;
