import '../App.css';
import React from 'react'
import {IoCall} from "react-icons/io5"
import {Link} from "react-router-dom"

const logo = require('../asset/logo1.png'); 

function Nav() {
  return (
    <>
    <div className='nav-section'>
      <img src={logo} className="logo" alt="car-logo"></img>
        <div>
          <p className="nav-head">United Kingdom</p>
          <p className="nav-minor">Exeter, EX4 4FG</p>
        </div>
        <div>
          <p className="nav-head">Monday - Friday</p>
          <p className="nav-minor">10am-7pm</p>
        </div>
        
        <button className='req-call'><IoCall className='call-icon'/> Request a Call</button>
        <div>
        <p className='login-link'> <Link to="/login" style={{textDecoration:"none", color:"#F79413"}}>Login/ Sign Up </Link></p>
        </div>
      </div>
    </>
  )
}

export default Nav;