import "../App.css";
import React, { useEffect, useState } from "react";
import { IoCall } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

const logo = require("../asset/logo1.png");

const Nav = () => {
  let location = useLocation();
  const [name, setName] = useState("User");
  useEffect(() => {
    const loginDetails = JSON.parse(
      localStorage.getItem("loginDetails") || "{}"
    );
    if (!!loginDetails.name) {
      setName(loginDetails.name);
    }
  }, [location.pathname]);

  const Logout = () => {
    if (name === "Admin") {
      localStorage.clear();
    }
    setName("User");
  };

  return (
    <>
      <div className="nav-section">
        <Link to="/">
          <img src={logo} className="logo" alt="car-logo"></img>{" "}
        </Link>
        <div>
          <p className="nav-head">United Kingdom</p>
          <p className="nav-minor">Exeter, EX4 4FG</p>
        </div>
        <div>
          <p className="nav-head">Monday - Friday</p>
          <p className="nav-minor">10am - 7pm</p>
        </div>

        <button className="req-call navcolor">
          <IoCall className="call-icon" /> 24/7 Customer Assistance
        </button>
        {name === "User" ? (
          <div>
            <p className="login-link navcolor">
              {" "}
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#F79413" }}
              >
                Login/ Sign Up{" "}
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div className="bold">Hi {name}</div>
            <div>
              <p className="login-link navcolor">
                <Link
                  to="/login"
                  onClick={() => {
                    Logout();
                  }}
                  style={{ textDecoration: "none", color: "#F79413" }}
                >
                  Logout
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Nav;
