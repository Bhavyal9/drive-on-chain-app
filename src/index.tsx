import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Scrypt, bsv } from "scrypt-ts";

import { DriveOnChainApp } from "./contracts/driveOnChainApp";
import artifactDriveOnChainApp from "../artifacts/driveOnChainApp.json";

import { BookingDetails } from "./contracts/bookingDetails";
import artifactBookingDetails from "../artifacts/driveOnChainApp.json";

DriveOnChainApp.loadArtifact(artifactDriveOnChainApp);
BookingDetails.loadArtifact(artifactBookingDetails);

Scrypt.init({
  // https://docs.scrypt.io/advanced/how-to-integrate-scrypt-service#get-your-api-key
  apiKey: "testnet_46VPti0qYpeaOvDNYpwvvKnnp0RmAD0bUQ6OkcL9OLPlTKNGn",
  network: bsv.Networks.testnet,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
