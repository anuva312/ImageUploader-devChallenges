import "./App.css";
import DragAndDrop from "./components/DragAndDrop.js";
import ChooseFile from "./components/ChooseFile.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const countOfFilesSupported = 1;
  const fileFormatsSupported = ["jpeg", "jpg", "png"];
  const onUpload = function (file) {
    console.log("File Uploading...", file);
  };

  const onValiationError = function (message) {
    console.log(message);
    toast.error(message, {
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
            handleError={onValiationError}
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
            handleError={onValiationError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
