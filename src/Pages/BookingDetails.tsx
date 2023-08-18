import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CarDatas } from "../utils/carData";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import "../styles/bookingPage.css";

import {
  ScryptProvider,
  SensiletSigner,
  Scrypt,
  bsv,
  PubKey,
  findSig,
  MethodCallOptions,
  Utils,
  ContractTransaction,
} from "scrypt-ts";
import { Escrow } from "../contracts/Escrow";
import { toast } from "react-toastify";

function BookingDetails() {
  const { id } = useParams();
  const cardatas = CarDatas;
  const tax = 0.1;
  const [baseRate, setBaseRate] = useState(100);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [diffDays, setDiffDays] = useState(0);

  const signerRef = useRef<SensiletSigner>();
  const [error, setError] = useState("");
  const [contractInstance, setContract] = useState<Escrow>();

  useEffect(() => {
    const provider = new ScryptProvider();
    const signer = new SensiletSigner(provider);
    signerRef.current = signer;
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
    localStorage.setItem("days", diffDays.toString());
    cardatas.forEach((cardata) => {
      if (cardata.id === Number(id)) {
        setBaseRate(cardata.price);
      }
    });
  }, []);

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(Escrow, {
        txId: "f1980412b045570092d5db653562476b450352d4a277de8064523df03606bf3b",
        outputIndex: 0,
      });
      setContract(instance);
    } catch (error: any) {
      console.log("error", error);
      setError(error.message);
    }
  }

  async function payDeposit() {
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
        "confirmDeposit",
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
                  Utils.buildPublicKeyHashScript(current.arbiterAddr)
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
      const arbiterPublicKey: bsv.PublicKey = await signer.getDefaultPubKey();
      const arbiterPubKey: PubKey = PubKey(arbiterPublicKey.toHex());

      console.log(buyerPublicKey);
      const res = await contractInstance.methods.confirmDeposit(
        (sigResps) => findSig(sigResps, buyerPublicKey),
        buyerPubKey,
        (sigResps) => findSig(sigResps, arbiterPublicKey),
        arbiterPubKey,
        {
          changeAddress: await signer.getDefaultAddress(),
          pubKeyOrAddrToSign: [buyerPublicKey, arbiterPublicKey],
        } as MethodCallOptions<Escrow>
      );

      console.log("Confirm payment call txid:", res.tx.id);
      localStorage.setItem("depoTx", res.tx.id);
      toast.success(`Yay! Reservation confirmed. Call txid:, ${res.tx.id}`, {
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
  localStorage.setItem(
    "totalCost",
    String(tax * baseRate * diffDays + baseRate * diffDays)
  );
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
                        £{tax * baseRate * diffDays + baseRate * diffDays}
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
                        <p className="drop">Drop Date</p>
                        <p className="drop">{dropDate}</p>
                      </div>
                      <div className="c-row drop">
                        <p className="drop-r">Drop Time</p>
                        <p className="drop-r">{dropTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="bookingButton CarButton"
                onClick={() => payDeposit()}
              >
                Make Payement: £100{" "}
              </button>
              <button className="errSubmitButton">
                <Link
                  to={`pickup/${cardata.id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Get the Car{" "}
                </Link>
              </button>
              <div className="locationConfirmation">
                <p className="bold">Pick Up Location</p>
                <p>
                  Stoke Bishop, Tunstall Close, StokeHolm, {pickupLocation},
                  United Kingdom
                </p>
                <p className="bold">Drop Location</p>
                <p>
                  Walker Point West, 234 Road, Hayes, {dropLocation}, United
                  Kingdom
                </p>
              </div>
            </div>
          )
      )}
      <Footer />
    </>
  );
}

export default BookingDetails;
