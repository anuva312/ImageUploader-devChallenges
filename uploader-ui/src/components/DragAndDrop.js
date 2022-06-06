import React from "react";
import PropTypes from "prop-types";
import "./DragAndDrop.css";

export default function FilesDragAndDrop({
  onUpload,
  children,
  count,
  formats,
}) {
  const drop = React.useRef(null);

  React.useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);

    return () => {
      drop.current.removeEventListener("dragover", handleDragOver);
      drop.current.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // this is required to convert FileList object to array
    const files = [...e.dataTransfer.files];

    // check if the provided count prop is less than uploaded count of files
    if (count && count < files.length) {
      console.log(
        `Only ${count} file${count !== 1 ? "s" : ""} can be uploaded at a time`
      );
      return;
    }

    // check if some uploaded file is not in one of the allowed formats
    if (
      formats &&
      files.some(
        (file) =>
          !formats.some((format) =>
            file.name.toLowerCase().endsWith(format.toLowerCase())
          )
      )
    ) {
      console.log(
        `Only following file formats are acceptable: ${formats.join(", ")}`
      );
      return;
    }

    if (files && files.length) {
      onUpload(files);
    }
  };

  return (
    <div ref={drop} className="drag-and-drop">
      {children}
      {/* <div className="drag-drop-area">
        Drag and Drop your image here
        <span role="img" aria-label="emoji" className="area__icon">
          &#128526;
        </span> */}
      {/* </div> */}
    </div>
  );
}

FilesDragAndDrop.propTypes = {
  onUpload: PropTypes.func.isRequired,
};
