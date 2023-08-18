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
  MethodCallOptions,
  PubKey,
  ContractTransaction,
  bsv,
  Utils,
  findSig,
} from "scrypt-ts";
import { toast } from "react-toastify";

const check = require("../asset/tick.gif");

const PickupPage = () => {
  const [finalPayement, setFinalPayement] = useState(0);
  const [complain, setComplain] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  let cardatas = CarDatas;
  const [deployTx, setdeployTx] = useState();
  const signerRef = useRef<SensiletSigner>();
  const [instance2, setInstance] = useState<BookingDetails>();
  const [contractInstance, setContract] = useState<Escrow>();

  const sat = 4491.079;
  useEffect(() => {
    if (id) {
      localStorage.setItem("id", id);
    }
    const provider = new ScryptProvider();
    const signer = new SensiletSigner(provider);
    signerRef.current = signer;
    const finalPayement = Number(localStorage.getItem("totalCost"));
    if (finalPayement) {
      setFinalPayement(finalPayement);
    }
  }, []);
  const totalAmnt: any = finalPayement * sat;
  const deploy = async (amount: any) => {
    localStorage.setItem("complain", complain);
    try {
      const car = cardatas.find((car) => {
        if (car.id === Number(id)) {
          return true;
        }
      });
      const message = toByteString(
        `Kilometer driven: ${car?.kmDriven}, Fuel Level: ${car?.fuelPrnt}, complain:${complain}`,
        true
      );
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
      const car = cardatas.find((car) => {
        if (car.id === Number(id)) {
          return true;
        }
      });
      const signer = signerRef.current as SensiletSigner;
      const message = toByteString(
        `Kilometer driven: ${car?.kmDriven}, Fuel Level: ${car?.fuelPrnt}, complain:${complain}`,
        true
      );
      if (instance2 === undefined) {
        console.error("instance is undefined");
        return;
      }
      await instance2.connect(signer);
      const { tx: callTx } = await instance2.methods.unlock(message);
      console.log("BookingDetails contract `unlock` called: ", callTx);
      console.log("BookingDetails contract `unlock` called: ", callTx.id);
      localStorage.setItem("calltxId", callTx.id);
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
        txId: "125c1ac7b0326412de606eb59ffa33c921a3ba9c4023d9688b1ae322a1dafb9a",
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

      // Bind custom tx builder:
      contractInstance.bindTxBuilder(
        "confirmPayment",
        (
          current: Escrow,
          options: MethodCallOptions<Escrow>
        ): Promise<ContractTransaction> => {
          const unsignedTx: bsv.Transaction = new bsv.Transaction()
            // add contract input
            .addInput(current.buildContractInput(options.fromUTXO))
            // build seller payment (P2PKH) output
            .addOutput(
              new bsv.Transaction.Output({
                script: bsv.Script.fromHex(
                  Utils.buildPublicKeyHashScript(current.sellerAddr)
                ),
                satoshis: current.balance,
              })
            );

          // build change output
          if (options.changeAddress) {
            unsignedTx.change(options.changeAddress);
          }

          return Promise.resolve({
            tx: unsignedTx,
            atInputIndex: 0,
            nexts: [],
          });
        }
      );

      const buyerPublicKey: bsv.PublicKey = await signer.getDefaultPubKey();
      const buyerPubKey: PubKey = PubKey(buyerPublicKey.toHex());
      const sellerPublicKey: bsv.PublicKey = await signer.getDefaultPubKey();
      const sellerPubKey: PubKey = PubKey(sellerPublicKey.toHex());

      console.log(buyerPublicKey);
      const res = await contractInstance.methods.confirmPayment(
        (sigResps) => findSig(sigResps, buyerPublicKey),
        buyerPubKey,
        (sigResps) => findSig(sigResps, sellerPublicKey),
        sellerPubKey,
        {
          changeAddress: await signer.getDefaultAddress(),
          pubKeyOrAddrToSign: [buyerPublicKey, sellerPublicKey],
        } as MethodCallOptions<Escrow>
      );

      console.log("Confirm payment call txid:", res.tx.id);
      localStorage.setItem("payTx", res.tx.id);
      toast.success(`Yay! Enjoy your Trip. Call txid:, ${res.tx.id}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
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
          <textarea
            cols={170}
            rows={12}
            onChange={(e) => setComplain(e.target.value)}
            value={complain}
            className="errText"
          ></textarea>
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
        {cardatas.map(
          (cardata, index) =>
            cardata.id === Number(id) && (
              <button className="errSubmitButton CarButton">
                <Link
                  to={`/complete/${cardata.id}`}
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  Return Car
                </Link>
              </button>
            )
        )}
      </div>
    </>
  );
};

export default PickupPage;
