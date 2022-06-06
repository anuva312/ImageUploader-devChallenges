import "./App.css";
import DragAndDrop from "./components/DragAndDrop.js";

function App() {
  const onUpload = function (file) {
    console.log("File Uploading...", file);
  };
  return (
    <div className="App">
      <div className="main-container">
        <div className="drag-drop-container">
          <DragAndDrop onUpload={onUpload} count={1} formats={["jpg", "png"]}>
            <div className="drag-drop-area">
              Drag and Drop your image here
              <span role="img" aria-label="emoji" className="area__icon">
                &#128526;
              </span>
            </div>
          </DragAndDrop>
        </div>
      </div>
    </div>
  );
}

export default App;
