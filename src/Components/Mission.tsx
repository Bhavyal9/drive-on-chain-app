import React from "react";

const img1 = require("../asset/img1.gif");
const img2 = require("../asset/img2.gif");

const Mission = () => {
  return (
    <>
      <div className="message">
        <h1 className="l-heading">Our Mission and Vision</h1>
        <div className="landing-content">
          <img src={img1} alt="customer choosing car"></img>
          <div>
            <h2 className="l-content">Mission</h2>
            <p className="l-content">
              Our mission is simple – to redefine car rentals by using smart
              contracts for instant and hassle-free payements, deposit and
              refunds. We're committed to offering a transparent and efficient
              process that enhances customer confidence, making car rental
              experiences smoother and more trustworthy than ever before.
            </p>
          </div>
        </div>
        <div className="landing-content">
          <div>
            <h2 className="l-content">Vision</h2>
            <p className="l-content">
              Our vision is to revolutionize car rentals with a focus on carbon
              footprint reduction. We aim to provide a fleet of eco-conscious
              vehicles, inspiring greener travel choices that contribute to a
              cleaner and healthier planet.
            </p>
          </div>
          <img src={img2} alt="electric car" width="350px"></img>
        </div>
      </div>
    </>
  );
};

export default Mission;
