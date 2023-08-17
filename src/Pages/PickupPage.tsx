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
  Sig,
  MethodCallOptions,
  PubKey,
  ContractTransaction,
  bsv,
  Utils,
  findSig,
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
    // TODO: I see you hard-coded the deployed escrow contract.
    //       Note, that similar to your BookingDetails contract, the Escrow 
    //       contract is not stateful, so it gets terminated once a public method is
    //       sucessfully called.
    //       Additionally, the confirmPayment public function will enforce the next output to be a P2PKH
    //       payment output to the seller. For that you need to bind a custom tx builder to the contract call.
    //        
    //       Below I have adapted the code to what it should look like for a correct call.
    //       But obviously it wont work on an already spend one.
    //await fetchContract();
    //const signer = signerRef.current as SensiletSigner;
    //console.log(signer, contractInstance);

    //if (contractInstance && signer) {
    //  const { isAuthenticated, error } = await signer.requestAuth();
    //  if (!isAuthenticated) {
    //    throw new Error(error);
    //  }

    //  await contractInstance.connect(signer);

    //  // Bind custom tx builder:
    //  contractInstance.bindTxBuilder("confirmPayment",
    //    (
    //      current: Escrow,
    //      options: MethodCallOptions<Escrow>
    //    ): Promise<ContractTransaction> => {
    //      const unsignedTx: bsv.Transaction = new bsv.Transaction()
    //        // add contract input
    //        .addInput(current.buildContractInput(options.fromUTXO))
    //        // build seller payment (P2PKH) output
    //        .addOutput(
    //          new bsv.Transaction.Output({
    //            script: bsv.Script.fromHex(
    //              Utils.buildPublicKeyHashScript(current.sellerAddr)
    //            ),
    //            satoshis: current.balance,
    //          })
    //        )

    //      // build change output
    //      if (options.changeAddress) {
    //        unsignedTx.change(options.changeAddress)
    //      }

    //      return Promise.resolve({
    //        tx: unsignedTx,
    //        atInputIndex: 0,
    //        nexts: [],
    //      })
    //    }
    //  )
    //  
    //  // TODO: Make sure the signer has both the buyers and sellers private key.

    //  const res = await contractInstance.methods.confirmPayment(
    //    (sigResps) => findSig(sigResps, buyerPublicKey),
    //    buyerPubKey,
    //    (sigResps) => findSig(sigResps, sellerPublicKey),
    //    sellerPubKey,
    //    {
    //      changeAddress: await signer.getDefaultAddress(),
    //      pubKeyOrAddrToSign: [buyerPublicKey, sellerPublicKey]
    //    } as MethodCallOptions<Escrow>
    //  )

    //  console.log('Confirm payment call txid:', res.tx.id)

    //  await fetchContract();
    //}
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
