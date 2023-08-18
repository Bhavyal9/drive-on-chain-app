import React, { useEffect, useRef, useState } from "react";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { Escrow } from "../contracts/Escrow";

import {
  ScryptProvider,
  SensiletSigner,
  Scrypt,
  bsv,
  PubKey,
  findSig,
  MethodCallOptions,
  ContractTransaction,
  Utils,
} from "scrypt-ts";
import { CarDatas } from "../utils/carData";
import { toast } from "react-toastify";

const toyota1 = require("../asset/car-images/toyota-1.jpg");
const toyota2 = require("../asset/car-images/toyota-2.jpg");
const toyota3 = require("../asset/car-images/toyota-3.jpg");
const toyota4 = require("../asset/car-images/toyota-4.jpg");
const toyota5 = require("../asset/car-images/toyota-int.jpg");
const dent = require("../asset/car-images/dent.jpg");

const Admin = () => {
  const cardatas = CarDatas;
  const [id, setId] = useState();
  const signerRef = useRef<SensiletSigner>();
  const [error, setError] = useState("");
  const [incident, setIncident] = useState("");
  const [contractInstance, setContract] = useState<Escrow>();
  const [finalPayement, setFinalPayement] = useState("");
  const [km, setKm] = useState("");
  const [prnt, setPrnt] = useState("");
  const [txId, setTxId] = useState("");
  const [deptxId, setdeptxId] = useState("");
  const [paytxId, setpaytxId] = useState("");
  console.log("id", id);

  useEffect(() => {
    const provider = new ScryptProvider();
    const signer = new SensiletSigner(provider);
    signerRef.current = signer;
    const id = JSON.parse(localStorage.getItem("id") || "{}");
    const km = JSON.parse(localStorage.getItem("km") || "{}");
    const prnt = JSON.parse(localStorage.getItem("prnt") || "{}");
    const txId = localStorage.getItem("calltxId");
    const deptxId = localStorage.getItem("depoTx");
    const paytxId = localStorage.getItem("payTx");
    setId(id);
    setKm(km);
    setPrnt(prnt);
    const finalPayement = localStorage.getItem("totalCost");
    const incident = localStorage.getItem("incident");
    if (incident) {
      setIncident(incident);
    }
    if (txId) {
      setTxId(txId);
    }
    if (deptxId) {
      setdeptxId(deptxId);
    }
    if (paytxId) {
      setpaytxId(paytxId);
    }
    if (finalPayement) {
      setFinalPayement(finalPayement);
    }
  }, []);

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(Escrow, {
        txId: "3c0b1def3a252c14f85d14e79ad9a7c6675ab2016a60e83d8bcb6bb52dcee4af",
        outputIndex: 0,
      });
      setContract(instance);
    } catch (error: any) {
      console.log("error", error);
      setError(error.message);
    }
  }

  async function refundAmount() {
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
        "refund",
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
                  Utils.buildPublicKeyHashScript(current.buyerAddr)
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

      const res = await contractInstance.methods.refund(
        (sigResps) => findSig(sigResps, sellerPublicKey),
        sellerPubKey,
        (sigResps) => findSig(sigResps, buyerPublicKey),
        buyerPubKey,
        {
          changeAddress: await signer.getDefaultAddress(),
          pubKeyOrAddrToSign: [buyerPublicKey, sellerPublicKey],
        } as MethodCallOptions<Escrow>
      );

      console.log("Confirm payment call txid:", res.tx.id);
      toast.success(`Yeye, Deposit refunded. Call txid:, ${res.tx.id}`, {
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
      <h2 className="main-admin-header">Admin Page</h2>
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
      {cardatas.map(
        (cardata, index) =>
          cardata.id === Number(id) && (
            <div className="customer-info">
              <p className="bold header">Before Renting Out</p>
              <div className="c-line">
                <div className="c-row">
                  <p>Kilometer Driven before renting: </p>
                  <p>{cardata.kmDriven}</p>
                </div>
                <div className="c-row">
                  <p>Fuel Percentage before renting:</p>
                  <p>{cardata.fuelPrnt}</p>
                </div>
              </div>
              <div>
                <p className="bold header adminHeader">After Returning</p>
                <div className="c-line">
                  <div className="c-row">
                    <p>Kilometer Driven before renting: </p>
                    <p>{km}km</p>
                  </div>
                  <div className="c-row">
                    <p>Fuel Percentage before renting: </p>
                    <p> {prnt}%</p>
                  </div>
                </div>
              </div>{" "}
              <p className="bold header adminHeader">Payment Information</p>
              <div className="c-line">
                <div className="c-row">
                  <p>Booking Deposit</p>
                  <p>£100</p>
                  <p className="bold">Deposit Payment Transaction ID :</p>
                  <p> {deptxId}</p>
                </div>
                <div className="c-row">
                  <p>Final Payement</p>
                  <p>£{finalPayement}</p>
                  <p className="bold">Final Payment Transaction ID : </p>
                  <p>{paytxId}</p>
                </div>
              </div>
              <p className="bold header adminHeader">
                Car's Condition upon Return
              </p>
              <p>{incident}</p>
              <div className="admin-img">
                <img src={toyota1} alt="toyota img" className="a-img" />
                <img src={toyota2} alt="toyota img" className="a-img" />
                <img src={toyota3} alt="toyota img" className="a-img" />
                <img src={toyota4} alt="toyota img" className="a-img" />
                <img src={toyota5} alt="toyota img" className="a-img" />
              </div>
              <p className="bold header adminHeader">
                Car Condition & Details before Renting
              </p>
              <p className="bold">Call Transaction ID : {txId}</p>
              <img src={dent} alt="toyota img" className="a-img" />
            </div>
          )
      )}
      <button
        className="refundButton"
        onClick={() => {
          refundAmount();
        }}
      >
        Send Deposit
      </button>
      <Footer />
    </>
  );
};

export default Admin;
