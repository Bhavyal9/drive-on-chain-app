import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CarDatas } from "../utils/carData";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import "../styles/bookingPage.css";

function BookingDetails() {
  const { id } = useParams();
  const cardatas = CarDatas;
  const tax = 0.1;
  const [baseRate, setBaseRate] = useState(0);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [diffDays, setDiffDays] = useState(0);

  useEffect(() => {
    let locationDetails: any = localStorage.getItem("locationDetails");
    locationDetails = JSON.parse(locationDetails);
    setPickupLocation(locationDetails.pickup);
    setDropLocation(locationDetails.drop);
    setPickupDate(locationDetails.pickupDate);
    setPickupTime(locationDetails.pickupTime);
    setDropTime(locationDetails.dropTime);
    setDropDate(locationDetails.dropDate);

    const date1: any = new Date(locationDetails.pickupDate);
    const date2: any = new Date(locationDetails.dropDate);
    const diffTime: any = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDiffDays(diffDays);

    cardatas.forEach((cardata) => {
      if (cardata.id === Number(id)) {
        setBaseRate(cardata.price);
      }
    });
  }, []);

  const setFinalPay = () => {
    localStorage.setItem(
      "totalCost",
      String(tax * baseRate * diffDays + baseRate * diffDays)
    );
  };

  return (
    <>
      <Nav />
      {cardatas.map(
        (cardata, index) =>
          cardata.id === Number(id) && (
            <div>
              <div className="booking-first-container">
                <div className="summary-charges">
                  <p className="bold heading">Summary of Charges</p>
                  <div>
                    <div className="summary-content">
                      <p>Booking Rate</p>
                      <p>£ 100.00</p>
                    </div>
                    <div className="summary-content">
                      <p>Base Rate</p>
                      <p>£ {cardata.price}</p>
                    </div>
                    <div className="summary-content">
                      <p>Days</p>
                      <p>{diffDays}</p>
                    </div>
                    <div className="summary-content">
                      <p>Total Cost</p>
                      <p>£ {baseRate * diffDays}</p>
                    </div>
                    <div className="summary-content">
                      <p>Tax</p>
                      <p>10%</p>
                    </div>
                    <div className="summary-content">
                      <p className="bold">Final Cost</p>
                      <p className="bold">
                        £ {tax * baseRate * diffDays + baseRate * diffDays}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="right-container">
                  <div className="customer-info">
                    <p className="bold header">Customer Information</p>
                    <div className="c-line">
                      <div className="c-row">
                        <p>Full Name</p>
                        <p>Bhavya B Mudhaliyar</p>
                      </div>
                      <div className="c-row">
                        <p>Age</p>
                        <p>23</p>
                      </div>
                    </div>
                    <div className="c-line">
                      <div className="c-row">
                        <p>Phone no.</p>
                        <p>+44 - 9893457342</p>
                      </div>
                      <div className="c-row">
                        <p>License No.</p>
                        <p>343543647</p>
                      </div>
                    </div>
                  </div>
                  <div className="booking-info">
                    <p className="bold header">Booking Information</p>
                    <span>Car :</span>
                    <span> {cardata.brand}</span>
                    <div className="c-line">
                      <div className="c-row">
                        <p>Pickup Location</p>
                        <p>{pickupLocation}</p>
                      </div>
                      <div className="c-row">
                        <p>Pick-up Date</p>
                        <p>{pickupDate}</p>
                      </div>
                      <div className="c-row">
                        <p>Pick-up Time</p>
                        <p>{pickupTime}</p>
                      </div>
                    </div>
                    <div className="c-line">
                      <div className="c-row">
                        <p>Drop Location</p>
                        <p>{dropLocation}</p>
                      </div>
                      <div className="c-row">
                        <p>Drop Date</p>
                        <p>{dropDate}</p>
                      </div>
                      <div className="c-row">
                        <p>Drop Time</p>
                        <p>{dropTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="bookingButton" onClick={() => setFinalPay()}>
                <Link
                  to={`pickup/${cardata.id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Make Payement: £100{" "}
                </Link>
              </button>
              <div className="locationConfirmation">
                <p className="bold">Pick Up Location</p>
                <p>Stoke Bishop, Tunstall Close, StokeHolm, United Kingdom</p>
                <p className="bold">Drop Location</p>
                <p>Walker Point West, 234 Road, Hayes, United Kingdom</p>
              </div>
            </div>
          )
      )}
      <Footer />
    </>
  );
}

export default BookingDetails;
