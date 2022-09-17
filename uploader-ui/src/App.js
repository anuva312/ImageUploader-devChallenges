import "./App.css";
import DragAndDrop from "./components/DragAndDrop.js";
import ChooseFile from "./components/ChooseFile.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function App() {
  const countOfFilesSupported = 1;
  const fileFormatsSupported = ["jpeg", "jpg", "png"];

  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const invokeUploadImageAPI = async function (data) {
    const url = "http://localhost:4000/api/v1/images";

    try {
      const response = await (
        await fetch(url, {
          method: "POST",
          mode: "cors",
          body: data,
        })
      ).json();
      onSuccess(response.message);
      setIsUploading(false);
      setIsUploadComplete(true);
    } catch (error) {
      console.error(error);
    }
  };

  const onUpload = function (files) {
    console.log("File Uploading...", files);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image-file", files[0]);
    invokeUploadImageAPI(formData);
  };

  const onError = function (message) {
    toast.error(message, {
      theme: "colored",
    });
  };

  const onSuccess = function (message) {
    toast.success(message, {
      theme: "colored",
    });
  };

  return (
    <div className="App">
      <ToastContainer />
      <div className="main-container">
        <div className="heading">Upload your image</div>
        <div className="help-text">Files should be jpeg,png,jpg...</div>
        <div className="drag-drop-container">
          <DragAndDrop
            onUpload={onUpload}
            count={countOfFilesSupported}
            formats={fileFormatsSupported}
            handleError={onError}
          >
            {/* <div className="drag-drop-area"> */}
            <div className="placeholder-container">
              <img
                src="/images/placeholder.png"
                alt="placeholder"
                className="placeholder-image"
              ></img>
            </div>
            Drag and Drop your image here
            {/* <span role="img" aria-label="emoji" className="area__icon">
                &#128526;
              </span> */}
            {/* </div> */}
          </DragAndDrop>
        </div>
        <div className="or-label">Or</div>
        <div>
          <ChooseFile
            className={"choose-file-button-container choose-file-button"}
            count={countOfFilesSupported}
            formats={fileFormatsSupported}
            onUpload={onUpload}
            handleError={onError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
