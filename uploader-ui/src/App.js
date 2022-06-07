import "./App.css";
import DragAndDrop from "./components/DragAndDrop.js";

function App() {
  const onUpload = function (file) {
    console.log("File Uploading...", file);
  };
  return (
    <div className="App">
      <div className="main-container">
        <div className="heading">Upload your image</div>
        <div className="help-text">Files should be jpeg,png,jpg...</div>
        <div className="drag-drop-container">
          <DragAndDrop onUpload={onUpload} count={1} formats={["jpg", "png"]}>
            <div className="drag-drop-area">
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
            </div>
          </DragAndDrop>
        </div>
        <div className="or-label">Or</div>
        <div>
          <label className="choose-file-button-container choose-file-button">
            <input type="file" id="choose-file" name="choose-file" />
            Choose file
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
