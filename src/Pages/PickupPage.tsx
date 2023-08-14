import React, { useEffect, useRef, useState } from "react";
import Nav from "../Components/Nav";
import { CarDatas } from "../utils/carData";
import { useParams } from "react-router-dom";
import "../styles/pickupPage.css";
import ImageUpload from "../Components/ImageUpload";
import { Link } from "react-router-dom";
import { BookingDetails } from "../contracts/bookingDetails";

import {
  ScryptProvider,
  SensiletSigner,
  toByteString,
  sha256,
  Scrypt,
} from "scrypt-ts";

const check = require("../asset/tick.gif");

const PickupPage = () => {
  const { id } = useParams();
  let cardatas = CarDatas;
  const [error, setError] = useState("");
  const signerRef = useRef<SensiletSigner>();
  const [contract, setContract] = useState<BookingDetails>();

  useEffect(() => {
    const provider = new ScryptProvider();
    const signer = new SensiletSigner(provider);
    signerRef.current = signer;
    fetchContract();
  }, []);

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(
        BookingDetails,
        {
          txId: "f0994f4fb87915cc89af0206372cab282bfd3dcd752462c59322074b4bffaac3",
          outputIndex: 0,
        }
      );
      setContract(instance);
    } catch (error: any) {
      console.log("error", error);
      setError(error.message);
    }
  }

  async function deployMsg() {
    await fetchContract();
    const signer = signerRef.current as SensiletSigner;
    console.log(signer, contract);

    if (contract && signer) {
      const { isAuthenticated, error } = await signer.requestAuth();
      if (!isAuthenticated) {
        throw new Error(error);
      }
      await contract.connect(signer);

      const message = toByteString("Pranav", true);

      await BookingDetails.compile();

      const instance = new BookingDetails(sha256(message));

      // deploy the contract and lock up 42 satoshis in it
      const deployTx = await instance.deploy(50);
      console.log("Helloworld contract deployed: ", deployTx.id);

      // contract call
      const { tx: callTx } = await instance.methods.unlock(message);
      console.log("Helloworld contract `unlock` called: ", callTx.id);
    }
  }

  return (
    <>
      <Nav />
      {cardatas.map(
        (cardata, index) =>
          cardata.id === Number(id) && (
            <div className="first-container">
              <img
                src={cardata.imgUrl}
                className="car-feature-img"
                alt={cardata.imgUrl}
              ></img>
              <div className="car-info-confirmation">
                <p className="heading bold">Information about Car</p>
                <ul className="">
                  <li>Year of Car : 2021 </li>
                  <li>Car colour : White</li>
                  <li>Emmisions: EURO 6</li>
                  <li>Safety Rating : 5/5</li>
                  <li>
                    Fuel Type : <span className="grey">Petrol</span>
                    <span className="bold green"> Diesel</span>{" "}
                    <span className="grey">Hybrid</span>
                  </li>
                  <div className="fadeIn">
                    <li>
                      <img src={check} alt="tick" height="20px"></img>
                      Kilometer driven (live reading from OBD) : 50000km
                    </li>
                    <li>
                      <img src={check} alt="tick" height="20px"></img> Fuel
                      Level (live reading from OBD) : 75%
                    </li>
                    <li>
                      <img src={check} alt="tick" height="20px"></img> Physical
                      Condition (live reading from OBD) :
                      <span className="grey"> &nbsp;Very Good &nbsp;</span>
                      <span className="bold green"> Good &nbsp; </span>
                      <span className="grey"> Average Poor </span>
                    </li>
                    <li>
                      <img src={check} alt="tick" height="20px"></img>
                      Mechanical Condition (live reading from OBD) :
                      <span className="bold green">
                        {" "}
                        &nbsp;Very Good &nbsp;{" "}
                      </span>
                      <span className="grey">Good Average Poor</span>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          )
      )}
      <div className="car-issues">
        <p>Is there any issues with your car?</p>
        <ImageUpload />
        <div>
          <p>Please describe the issue in the given box:</p>
          <input type="textarea" name="textValue" className="errText" />
          <button className="errSubmitButton">Submit</button>
        </div>
        <button className="finalPayement green">
          <Link
            to="/complete"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Final Payement{" "}
          </Link>
        </button>
      </div>
    </>
  );
};

export default PickupPage;
