import React, { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import ImageUpload from "../Components/ImageUpload";
import "../styles/pickupPage.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const check = require("../asset/tick.gif");
const vote = require("../asset/vote.gif");

const CompleteJourney = () => {
  const [days, setDays] = useState(1);
  const [incident, setIncident] = useState("");
  let basekm = 432;
  let km = 50000 + basekm * days;
  const prnt = "60";

  useEffect(() => {
    let days = Number(localStorage.getItem("days"));
    setDays(days);
  }, []);

  const report = () => {
    localStorage.setItem("incident", incident);
    localStorage.setItem("km", km.toString());
    localStorage.setItem("prnt", prnt);
    toast.info(
      "Cheers! The request has been submitted and you will soon get your refund back.",
      {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };
  return (
    <>
      <Nav />
      <div className="car-final-confirmation ">
        <p className="header bold">Information about Car</p>
        <li>
          <img src={check} alt="tick" height="20px"></img> Kilometer driven by
          you (live reading from OBD) : {km}km
        </li>
        <li>
          <img src={check} alt="tick" height="20px"></img> Fuel Level of your
          car (live reading from OBD) : {prnt}%
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
          <textarea
            cols={170}
            rows={12}
            className="errText"
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
          ></textarea>
          <button
            className="errSubmitButton"
            onClick={() => {
              report();
            }}
          >
            Submit & Get Deposit
          </button>
        </div>
      </div>
      <div>
        <hr className="completeJourneyHr" />
        <div className="voting">
          <Link to="/">
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
