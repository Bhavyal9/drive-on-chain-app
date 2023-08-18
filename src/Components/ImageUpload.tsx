import React, { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const maxNumber = 5;
  const [URL, setURL] = useState("");
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    setImages(imageList as never[]);
  };
  return (
    <div>
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
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              className="errSubmitButton buttonWidth"
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button
              className="errSubmitButton buttonWidth"
              onClick={onImageRemoveAll}
            >
              Remove all images
            </button>
            <div className="upload-img">
              {imageList.map((image: any, index: any) => (
                <div key={index} className="image-item">
                  <img
                    src={image.dataURL}
                    alt=""
                    width="250"
                    height="200"
                    className="err-images"
                  />
                  <div className="image-item__btn-wrapper">
                    <button
                      className="errSubmitButton"
                      onClick={() => onImageUpdate(index)}
                    >
                      Update
                    </button>
                    <button
                      className="errSubmitButton"
                      onClick={() => onImageRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUpload;
