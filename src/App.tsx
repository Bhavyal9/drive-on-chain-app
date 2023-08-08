import React from 'react';
import './App.css';
import Home from "./Pages/home"
import {Route, Routes} from "react-router-dom"
import CarDetails from './Pages/CarDetails';
import Login from './Pages/Login';
import BookingDetails from './Pages/BookingDetails';
import PickupPage from './Pages/PickupPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path ="/:id" element = {<CarDetails/>}/>
        <Route path = ":id/book/:id" element = {<BookingDetails/>}/>
        <Route path = ":id/book/:id/pickup/:id" element = {<PickupPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
