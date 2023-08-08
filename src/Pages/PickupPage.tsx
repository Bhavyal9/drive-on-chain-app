import React, { useEffect } from 'react'
import Nav from '../Components/Nav'
import {CarDatas} from "../utils/carData"
import { useParams } from 'react-router-dom'
import "../styles/pickupPage.css"
import {AiFillCheckCircle} from "react-icons/ai"
import ImageUploading, { ImageListType } from "react-images-uploading";
// import {carInfo} from "../asset/data/carInfo"

const PickupPage = () => {
  const {id} = useParams()
  let cardatas = CarDatas
  const [images, setImages] = React.useState([]);
  const maxNumber = 5;
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

//   useEffect(() = > {
// let totalCost:any= localStorage.getItem("totalCost")
// totalCost = JSON.parse(totalCost)
//   }, [])
  
  return (
    <>
    <Nav/>
    {cardatas.map((cardata, index)=>(
        cardata.id === Number(id) && 
        <div className='first-container'>
            <img src={cardata.imgUrl} className="car-feature-img" alt={cardata.imgUrl}></img>
            <div>
              <p>Information about Car</p>
              <ul className=''>
              <li>Year of Car : 2021 </li>
              <li>Car colour : White</li>
              <li>Emmisions: EURO 6</li>
              <li>Safety Rating : 5/5</li>
              {/* <li>Final Cost: {totalCost}</li> */}
              <li>Fuel Type: Petrol <span className='bold green'> Diesel</span> Hybrid</li>
                <li> <AiFillCheckCircle className='green'/> Kilometer driven (live reading from OBD) : 50000km</li>
                <li> <AiFillCheckCircle className='green'/> Fuel Level (live reading from OBD) : 75%</li>
                <li><AiFillCheckCircle className='green'/> Physical Condition (live reading from OBD) : Very Good <span className='bold green'>Good </span> Average Poor</li>
                <li> <AiFillCheckCircle className='green'/> Mechanical Condition (live reading from OBD) : <span className='bold green'>Very Good</span> Good Average Poor</li>
              </ul>
            </div>
            </div>
      ))}
                  <p className='bold'>Current Images</p>
                  <div>
                    <p>Is there any issues with your car?</p>
                    <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            <div className="upload-img">
            {imageList.map((image: any, index: any) => (
              <div key={index} className="image-item">
                <img src={image.dataURL} alt="" width="250" height="200" className='err-images'/>
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </ImageUploading>
      <div>
        <p>Please Describe the issue in the given box:</p>
        <input type="textarea" 
          name="textValue" className='errText'
        />
        <button>Submit</button>
      </div>
      <button>Final Payement</button>
                  </div>
    </>
  )
}

export default PickupPage