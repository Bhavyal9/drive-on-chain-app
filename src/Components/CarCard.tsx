import React,{useState} from 'react'
import {AiFillStar} from "react-icons/ai"
import {Link} from "react-router-dom"
import {CarDatas} from "../utils/carData"

function CarCard() {
 const [cardatas, setCarData] = useState(CarDatas)

    return(
       <>
        <div className='car-display-section'>
        <h2 className='hot-offers'>Hot Offers</h2>
        <div className="list-of-cars">
       {cardatas.map((cardata)=>(
            <div className='car-card'>
                <img src={cardata.imgUrl} className="car-img" alt={cardata.imgUrl}></img>
                <h3>{cardata.brand}</h3>
                <div className='car-details'>
                <p>{cardata.Transmission}</p>
                <p>{cardata.topSpeed}</p>
                <p><AiFillStar className="star"/> {cardata.star}</p>
                </div>
                <p className='reviews'>{cardata.rating} Reviews</p>
                <p className='price'>Price:{cardata.price}</p>
                <button className='book'><Link to={`/${cardata.id}`} style={{textDecoration:"none", color:"white"}}>Book Now</Link></button>
            </div>
       )
        
       )}
       </div>
        </div>
       </>
       )
}



export default CarCard;