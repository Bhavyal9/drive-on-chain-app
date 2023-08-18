import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./Pages/home";
import { Route, Routes, useLocation } from "react-router-dom";
import CarDetails from "./Pages/CarDetails";
import Login from "./Pages/Login";
import BookingDetails from "./Pages/BookingDetails";
import PickupPage from "./Pages/PickupPage";
import CompleteJourney from "./Pages/CompleteJourney";
import Admin from "./Pages/Admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  let location = useLocation();
  const [name, setName] = useState("User");
  useEffect(() => {
    const loginDetails = JSON.parse(
      localStorage.getItem("loginDetails") || "{}"
    );
    setName(loginDetails.name);
  }, [location.pathname]);

  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Same as */}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:id" element={<CarDetails />} />
        <Route path=":id/book/:id" element={<BookingDetails />} />
        <Route path=":id/book/:id/pickup/:id" element={<PickupPage />} />
        <Route path="/complete/:id" element={<CompleteJourney />} />
        {name === "Admin" && <Route path="/admin" element={<Admin />} />}
      </Routes>
    </div>
  );
}

export default App;
