import React, { useEffect, useRef, useState } from "react";
import { DriveOnChainApp } from "../contracts/driveOnChainApp";
import { FaThumbsUp } from "react-icons/fa";

import {
  Scrypt,
  ScryptProvider,
  SensiletSigner,
  toByteString,
} from "scrypt-ts";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { CarDatas } from "../utils/carData";

function CarCard() {
  const cardatas = CarDatas;
  const signerRef = useRef<SensiletSigner>();
  const [error, setError] = useState("");
  const [contract, setContract] = useState<DriveOnChainApp>();

  useEffect(() => {
    const provider = new ScryptProvider();
    const signer = new SensiletSigner(provider);
    signerRef.current = signer;
    fetchContract();
  }, []);

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(
        DriveOnChainApp,
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

  async function vote(brand: any) {
    await fetchContract();
    const signer = signerRef.current as SensiletSigner;
    console.log(signer, contract);

    if (contract && signer) {
      const { isAuthenticated, error } = await signer.requestAuth();
      if (!isAuthenticated) {
        throw new Error(error);
      }
      await contract.connect(signer);

      const nextInstance = contract.next();

      const candidateName = brand;
      if (candidateName === "Toyota") {
        nextInstance.candidates[0].votesReceived++;
      } else if (candidateName === "BMW") {
        nextInstance.candidates[1].votesReceived++;
      } else if (candidateName === "Nissan") {
        nextInstance.candidates[2].votesReceived++;
      } else if (candidateName === "Mercedes") {
        nextInstance.candidates[3].votesReceived++;
      }
      console.log(candidateName, nextInstance);
      contract.methods
        .vote(toByteString(candidateName, true), {
          next: {
            instance: nextInstance,
            balance: contract.balance,
          },
        })
        .then((result) => {
          setContract(nextInstance);
          console.group(result.tx.id);
        })
        .catch((e) => {
          setError(e.message);
          console.error(e);
        });
      await fetchContract();
    }
  }
  return (
    <>
      <div className="car-display-section">
        <h2 className="hot-offers">Hot Offers</h2>
        <div className="list-of-cars">
          {cardatas.map((cardata) => (
            <div className="car-card">
              <img
                src={cardata.imgUrl}
                className="car-img"
                alt={cardata.imgUrl}
              ></img>
              <h3>{cardata.brand}</h3>
              <div className="car-details">
                <p>{cardata.Transmission}</p>
                <p>{cardata.topSpeed}</p>
                <p>
                  <AiFillStar className="star" /> {cardata.star}
                </p>
              </div>
              <p className="reviews">{cardata.rating} Reviews</p>
              <p className="price">Price: £{cardata.price}/day</p>
              <div>
                <button
                  name={cardata.brand}
                  onClick={() => {
                    vote(cardata.brand);
                  }}
                  className="voteButton"
                >
                  Vote <FaThumbsUp className="bcolor" />
                </button>
                <span>
                  {" "}
                  {contract?.candidates[cardata.id].votesReceived.toString()}
                </span>
              </div>
              <button className="book">
                <Link
                  to={`/${cardata.id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Book Now
                </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CarCard;
