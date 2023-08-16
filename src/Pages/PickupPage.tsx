import React, { useEffect, useRef, useState } from "react";
import Nav from "../Components/Nav";
import { CarDatas } from "../utils/carData";
import { useParams } from "react-router-dom";
import "../styles/pickupPage.css";
import ImageUpload from "../Components/ImageUpload";
import { Link } from "react-router-dom";
import { BookingDetails } from "../contracts/bookingDetails";
import { Escrow } from "../contracts/Escrow";

import {
  ScryptProvider,
  SensiletSigner,
  sha256,
  toByteString,
  Scrypt,
} from "scrypt-ts";

const check = require("../asset/tick.gif");

const PickupPage = () => {
  const [error, setError] = useState("");
  const { id } = useParams();
  let cardatas = CarDatas;
  const [deployTx, setdeployTx] = useState();
  const signerRef = useRef<SensiletSigner>();
  const [instance2, setInstance] = useState<BookingDetails>();
  const [contractInstance, setContract] = useState<Escrow>();

  useEffect(() => {
    const provider = new ScryptProvider();
    const signer = new SensiletSigner(provider);
    signerRef.current = signer;
  }, []);

  const deploy = async (amount: any) => {
    try {
      const message = toByteString("bhavya", true);
      const instance = new BookingDetails(sha256(message));
      const signer = signerRef.current as SensiletSigner;

      await instance.connect(signer);

      const deployTx = await instance.deploy(100);
      console.log("BookingDetails contract deployed: ", deployTx.id);
      alert("deployed: " + deployTx.id);
      setInstance(instance);
    } catch (e) {
      console.error("deploy booking detail fails", e);
      alert("deploy BookingDetail Fails");
    }
  };

  const interact = async (amount: any) => {
    try {
      const signer = signerRef.current as SensiletSigner;
      const message = toByteString("bhavya", true);
      console.log(txid);
      if (instance2 === undefined) {
        console.error("instance is undefined");
        return;
      }
      await instance2.connect(signer);
      const { tx: callTx } = await instance2.methods.unlock(message);
      console.log("BookingDetails contract `unlock` called: ", callTx);
      console.log("BookingDetails contract `unlock` called: ", callTx.id);
      alert("unlock: " + callTx.id);
    } catch (e) {
      console.error("deploy BookingDetails fails", e.message);
      alert("deploy BookingDetails fails");
    }
  };

  const txid = useRef<any>();

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(Escrow, {
        txId: "f0994f4fb87915cc89af0206372cab282bfd3dcd752462c59322074b4bffaac3",
        outputIndex: 0,
      });
      setContract(instance);
    } catch (error: any) {
      console.log("error", error);
      setError(error.message);
    }
  }

  async function payFinalPayement() {
    await fetchContract();
    const signer = signerRef.current as SensiletSigner;
    console.log(signer, contractInstance);

    if (contractInstance && signer) {
      const { isAuthenticated, error } = await signer.requestAuth();
      if (!isAuthenticated) {
        throw new Error(error);
      }

      await contractInstance.connect(signer);
      const nextInstance = contractInstance.next();

      contractInstance.methods
        .confirmPayment({
          next: {
            instance: nextInstance,
            balance: contractInstance.balance,
          },
        })
        .then((result) => {
          setContract(nextInstance);
          console.group(result.tx.id);
        })
        .catch((e) => {
          setError(e.message);
          console.error(e.message);
        });
      await fetchContract();
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
                  <li>Year of Car : {cardata.year} </li>
                  <li>Car colour : {cardata.color}</li>
                  <li>Emmisions: {cardata.emission}</li>
                  <li>Safety Rating : 5/{cardata.safety}</li>
                  <li>
                    Fuel Type : <span className="grey">Petrol</span>
                    <span className="bold green"> Diesel</span>{" "}
                    <span className="grey">Hybrid</span>
                  </li>
                  <div className="fadeIn">
                    <li>
                      <img src={check} alt="tick" height="20px"></img>
                      Kilometer driven (live reading from OBD) :{" "}
                      {cardata.kmDriven}km
                    </li>
                    <li>
                      <img src={check} alt="tick" height="20px"></img> Fuel
                      Level (live reading from OBD) : {cardata.fuelPrnt}
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
          <button className="errSubmitButton" onClick={deploy}>
            Submit
          </button>
          <label
            style={{ fontSize: "14px", paddingBottom: "5px" }}
            className="CarButton"
          >
            <input
              ref={txid}
              type="hex"
              name="PVTKEY1"
              min="1"
              defaultValue={deployTx}
              placeholder="hex"
            />
          </label>
          <button className="errSubmitButton CarButton" onClick={interact}>
            Unlock
          </button>
        </div>
        <button
          className="finalPayement green"
          onClick={() => {
            payFinalPayement();
          }}
        >
          Final Payement{" "}
        </button>
        <button className="errSubmitButton CarButton">
          <Link
            to="/complete"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Return Car
          </Link>
        </button>
      </div>
    </>
  );
};

export default PickupPage;
