import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import "./App.css";
import DragAndDrop from "./components/DragAndDrop.js";
import ChooseFile from "./components/ChooseFile.js";
import LoaderLine from "./components/LoaderLine";
import LoaderSpinner from "./components/LoaderSpinner.js";

function App() {
  const countOfFilesSupported = 1;
  const fileFormatsSupported = ["jpeg", "jpg", "png"];
  const domainURL = "https://anusreeva-my-unsplash-backend.onrender.com";

  const [isHomePage, setIsHomePage] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const invokeUploadImageAPI = async function (data) {
    const url = `${domainURL}/api/v1/images`;

    try {
      const response = await (
        await fetch(url, {
          method: "POST",
          mode: "cors",
          body: data,
        })
      ).json();
      onUploadSuccess(response.data, response.image);
    } catch (error) {
      console.error(error);
      onError("Unable to upload image!");
      setIsUploading(false);
      setIsUploadComplete(false);
    }
  };

  const onUpload = function (files) {
    setIsHomePage(false);
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

  const onUploadSuccess = function (data, message) {
    onSuccess(message);
    setIsUploading(false);
    setIsUploadComplete(true);
    if (data) {
      setUploadedImage({
        name: data.originalName,
        path: `${domainURL}${data.path}`,
      });
    } else {
      onError("Unable to get uploaded image");
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      {isUploading ? (
        <div className="main-container uploading-container">
          <div className="heading uploading-heading">Uploading...</div>
          <div className="loader-container">
            <LoaderLine></LoaderLine>
          </div>
        </div>
      ) : isUploadComplete ? (
        <div className="main-container upload-success-container">
          <div className="check-icon-container">
            <span className="material-symbols-rounded check-icon">
              check_circle
            </span>
          </div>
          <div className="heading uploaded-successfully-heading">
            Uploaded Successfully
          </div>
          <div className="uploaded-image-container">
            <img
              src={uploadedImage.path}
              alt={uploadedImage.name}
              className="uploaded-image"
            ></img>
          </div>
          <div className="copy-link-container">
            <div className="image-link">{uploadedImage.path}</div>
            <button
              className="copy-link-button"
              onClick={() => {
                navigator.clipboard.writeText(uploadedImage.path);
              }}
            >
              Copy Link
            </button>
          </div>
          <button
            className="upload-another-button"
            onClick={() => {
              setIsUploadComplete(false);
              setIsHomePage(true);
            }}
          >
            Upload Another
          </button>
        </div>
      ) : isHomePage ? (
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
              <div className="placeholder-container">
                <img
                  src="/images/placeholder.svg"
                  alt="placeholder"
                  className="placeholder-image"
                ></img>
              </div>
              Drag and Drop your image here
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
      ) : (
        <div className="main-container spinner-main-container">
          <div className="loader-spinner-container">
            <LoaderSpinner></LoaderSpinner>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
