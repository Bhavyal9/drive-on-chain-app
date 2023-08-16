import React, { useEffect, useRef, useState } from "react";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import { Escrow } from "../contracts/Escrow";

import { ScryptProvider, SensiletSigner, Scrypt } from "scrypt-ts";

const Admin = () => {
  const signerRef = useRef<SensiletSigner>();
  const [error, setError] = useState("");
  const [contractInstance, setContract] = useState<Escrow>();

  useEffect(() => {
    const provider = new ScryptProvider();
    const signer = new SensiletSigner(provider);
    signerRef.current = signer;
  }, []);

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
      const nextInstance = contractInstance.next();
      contractInstance.methods
        .refund({
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
      <button className="errSubmitButton">Check the requests</button>
      <button
        className="refundButton"
        onClick={() => {
          refundAmount();
        }}
      >
        Get Refund
      </button>
      <Footer />
    </>
  );
};

export default Admin;
