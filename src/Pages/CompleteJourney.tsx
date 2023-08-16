import React from "react";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import ImageUpload from "../Components/ImageUpload";
import "../styles/pickupPage.css";
import { Link } from "react-router-dom";

const check = require("../asset/tick.gif");
const vote = require("../asset/vote.gif");

const CompleteJourney = () => {
  return (
    <>
      <Nav />
      <div className="car-final-confirmation ">
        <p className="header bold">Information about Car</p>
        <li>
          <img src={check} alt="tick" height="20px"></img> Kilometer driven
          (live reading from OBD) : 55378km
        </li>
        <li>
          <img src={check} alt="tick" height="20px"></img> Fuel Level (live
          reading from OBD) : 60%
        </li>
      </div>
      <div className="car-issues">
        <h1>Register Incident</h1>
        <ImageUpload />
        <div>
          <p>
            Please mention any scratches on the exterior of the car or any
            incidents:
          </p>
          <input type="textarea" name="textValue" className="errText" />
          <button className="errSubmitButton">Submit & Get Deposit</button>
        </div>
      </div>
      <div>
        <hr className="completeJourneyHr" />
        <div className="voting">
          <Link to="">
            <h3 className="bold">Vote the car if you like it!</h3>
          </Link>
          <img src={vote} alt="vote" height="120px"></img>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompleteJourney;
