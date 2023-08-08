import React,{useState} from 'react'

function Select() {
const [pickup, setPickup] = useState("")
const [drop, setDrop] = useState("")
const [pickupDate, setPickupDate] = useState("")
const [pickupTime, setPickupTime] = useState("")
const [dropDate, setDropDate] = useState("")
const [dropTime, setDropTime] = useState("")

const storeData = () =>{
  const locationData = {
    pickup :pickup,
    drop:drop,
    pickupDate,
    pickupTime,
    dropDate,
    dropTime
  }
  const serialize  = JSON.stringify(locationData)

  localStorage.setItem("locationDetails",serialize)

  console.log(serialize)
}

  return (
    <>
    <div className="bg-img">
      <div className='select-destination'>
        <div>
          <label htmlFor="pickup-location" className="label">Pick-up Location</label>
        <input type="text" placeholder='Select location' id="pickup-location" className='input' value ={pickup} onChange={(e)=>setPickup(e.target.value)}></input>
        </div>
        <div>
        <label htmlFor="drop-location" className="label">Drop Location</label>
        <input type="text" placeholder='Select location' id="drop-location" className='input' value={drop} onChange={(e)=>setDrop(e.target.value)}></input>
        </div>
        <div>
        <label htmlFor="pickup-date" className="label">Pick-up Date</label>
        <input type="date" placeholder='Select location' id="pickup-date" className='input' value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)}></input>
        </div>
        <div>
        <label htmlFor="pickup-time" className="label">Pick-up Time</label>
        <input type="time" placeholder='Select location' id="pickup-time" className='input' value={pickupTime} onChange={(e)=>setPickupTime(e.target.value)}></input>
        </div>
        <div>
        <label htmlFor="drop-date" className="label">Drop Date</label>
        <input type="date" placeholder='Select location' id="drop-date" className='input' value={dropDate} onChange={(e)=>setDropDate(e.target.value)}></input>
        </div>
        <div>
        <label htmlFor="drop-time" className="label">Drop Time</label>
        <input type="time" placeholder='Select location' id="drop-time" className='input' value={dropTime} onChange={(e)=>setDropTime(e.target.value)}></input>
        </div>
        <button className='get-car-btn' onClick={()=>storeData()}>Get Car</button>
      </div>
    </div>
    </>
  )
}

export default Select;