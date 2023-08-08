import React,{useState} from 'react'
import {useParams} from "react-router-dom"
import Nav from '../Components/Nav';
import "../styles/cardetails.css"
import {AiFillStar} from "react-icons/ai"
import {Link} from "react-router-dom"
import {CarDatas} from "../utils/carData"
import Footer from '../Components/Footer';

function CarDetails() {
    const {id} = useParams()
    let cardatas = CarDatas
  return (

    <>
    <Nav/>
    {cardatas.map((cardata, index)=>(
        cardata.id === Number(id) && 
        <div>
        <div className='car-features content'>
            <img src={cardata.imgUrl} className="car-feature-img" alt={cardata.imgUrl}></img>
            <div className='car-imp-data'>
            <h3>{cardata.brand}</h3>
            <p className='price'>Price: ${cardata.price}</p>
            <div className="full-ratings">
            <p><AiFillStar className="star"/> {cardata.star}</p>
            <p className='car-reviews'>{cardata.rating} Reviews</p>
            </div>
            <ul>{cardata.features.map((f:string)=>{return <li>{f}</li>})}</ul>
            </div>
        </div> 
         <p className='description content'>{cardata.description}</p>
         <button className='book' id="deposit"><Link to={`book/${cardata.id}`} style={{textDecoration:"none", color:"white"}}>Book Now by Paying $100</Link></button>
         </div>
        ))}
        <Footer/>
    </>
  )
}

export default CarDetails;