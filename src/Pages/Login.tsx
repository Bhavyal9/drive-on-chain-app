import React, { useState } from 'react'
import "../styles/login.css"
import Nav from '../Components/Nav';
import { Link } from 'react-router-dom';
import {users} from "../utils/users"
import Footer from '../Components/Footer';

const loginImg = require("../asset/all-images/login-img.jpg"); 

const Login = () => {
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

const setLoginDetails = (e:any) =>{
  e.preventDefault()
  const found = users.find((user) => {
    if(user.email === email && String(user.pass) === password){
      return true;
    }
  } )

if (found){
  const loginDetails = {
    email,
    password
}
const serializeLogin = JSON.stringify(loginDetails)

localStorage.setItem("loginDetails",serializeLogin)
}
}

  return (
    <>
<Nav/>
    <div className='login-pg'>
      <div className='form-side'>
      <span className='head bold'>Login</span>
      <span className='head signup'>Sign Up</span>
      <form className='login-form'>
      <label htmlFor="email-id" className='label'>Email id</label>
      <input type="text" id="email-id" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
      <label htmlFor="password" className='label'>Password</label>
      <input type="text" id="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
      <p className='forgot'>Forgot your Password?</p>
      <button className='login-btn'style={{textDecoration:"none", color:"#fff"}} onClick={(e)=>setLoginDetails(e)}> Login</button>
    </form>
      </div>
    <img src={loginImg} className="login-img" alt="Friends siting in car" />
    </div>
    <Footer/>
    </>
  )
}

export default Login