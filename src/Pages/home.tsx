import React from "react";
import "../App.css";
import "../styles/homepage.css";
import Navbar from "../Components/Nav";
import Selection from "../Components/Select";
import CarCard from "../Components/CarCard";
import Footer from "../Components/Footer";
import Mission from "../Components/Mission";

function home() {
  return (
    <>
      <Navbar />
      <hr />
      <Selection />
      <hr />
      <p className="amnt bold">Current Price: 1 Pound = 0.0408 BSV</p>
      <CarCard />
      <Mission />
      <Footer />
    </>
  );
}

export default home;
