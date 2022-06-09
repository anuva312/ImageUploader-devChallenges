import React from "react";
import PropTypes from "prop-types";
import "./DragAndDrop.css";

export default function DragAndDrop({
  onUpload,
  children,
  count,
  formats,
  handleError,
}) {
  const drop = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef(null);
  const [message, setMessage] = React.useState({
    show: false,
    text: null,
    type: null,
  });

  React.useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);

    return () => {
      drop.current.removeEventListener("dragover", handleDragOver);
      drop.current.removeEventListener("drop", handleDrop);
    };
  }, []);

  React.useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);
    drop.current.addEventListener("dragenter", handleDragEnter);
    drop.current.addEventListener("dragleave", handleDragLeave);

    return () => {
      drop.current.removeEventListener("dragover", handleDragOver);
      drop.current.removeEventListener("drop", handleDrop);
      drop.current.removeEventListener("dragenter", handleDragEnter);
      drop.current.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);

    // this is required to convert FileList object to array
    const files = [...e.dataTransfer.files];

    // check if the provided count prop is less than uploaded count of files
    if (count && count < files.length) {
      showMessage("", "error", 2000);
      handleError(
        `Sorry, only ${count} file${
          count !== 1 ? "s" : ""
        } can be uploaded at a time`
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
      showMessage("", "error", 2000);
      handleError(
        `Sorry, only following file formats are acceptable: ${formats.join(
          ", "
        )}`
      );
      return;
    }

    if (files && files.length) {
      showMessage("", "success", 1000); //Proceeding to upload...
      onUpload(files);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== drag.current) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === drag.current) {
      setDragging(false);
    }
  };

  const showMessage = (text, type, timeout) => {
    setMessage({
      show: true,
      text,
      type,
    });

    setTimeout(
      () =>
        setMessage({
          show: false,
          text: null,
          type: null,
        }),
      timeout
    );
  };

  return (
    <div ref={drop} className="drag-and-drop">
      {message.show && (
        <div
          className={`drag-and-drop-placeholder drag-and-drop-placeholder--${message.type}`}
        >
          {message.text}
          {/* <span role="img" aria-label="emoji" className="area__icon">
            {message.type === "error" ? <>&#128546;</> : <>&#128536;</>}
          </span> */}
        </div>
      )}
      {dragging && (
        <div ref={drag} className="drag-and-drop-placeholder">
          {/* Drop that file down low
          <span role="img" aria-label="emoji" className="area__icon">
            &#128526;
          </span> */}
        </div>
      )}
      <div className="drag-drop-area">{children}</div>
      {/* <div className="drag-drop-area">
        Drag and Drop your image here
        <span role="img" aria-label="emoji" className="area__icon">
          &#128526;
        </span> */}
      {/* </div> */}
    </div>
  );
}

DragAndDrop.propTypes = {
  onUpload: PropTypes.func.isRequired,
};
