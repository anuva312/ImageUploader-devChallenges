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

  const handleDragOver = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = React.useCallback(
    (e) => {
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
    },
    [count, formats, handleError, onUpload]
  );

  const handleDragEnter = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== drag.current) {
      setDragging(true);
    }
  }, []);

  const handleDragLeave = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === drag.current) {
      setDragging(false);
    }
  }, []);

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

  React.useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);

    const dragAndDropElement = drop.current;

    return () => {
      dragAndDropElement.removeEventListener("dragover", handleDragOver);
      dragAndDropElement.removeEventListener("drop", handleDrop);
    };
  }, [handleDragOver, handleDrop]);

  React.useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);
    drop.current.addEventListener("dragenter", handleDragEnter);
    drop.current.addEventListener("dragleave", handleDragLeave);

    const dragAndDropElement = drop.current;

    return () => {
      dragAndDropElement.removeEventListener("dragover", handleDragOver);
      dragAndDropElement.removeEventListener("drop", handleDrop);
      dragAndDropElement.removeEventListener("dragenter", handleDragEnter);
      dragAndDropElement.removeEventListener("dragleave", handleDragLeave);
    };
  }, [handleDragOver, handleDrop, handleDragEnter, handleDragLeave]);

  return (
    <div ref={drop} className="drag-and-drop">
      {message.show && (
        <div
          className={`drag-and-drop-placeholder drag-and-drop-placeholder--${message.type}`}
        >
          {message.text}
        </div>
      )}
      {dragging && <div ref={drag} className="drag-and-drop-placeholder"></div>}
      <div className="drag-drop-area">{children}</div>
    </div>
  );
}

DragAndDrop.propTypes = {
  onUpload: PropTypes.func.isRequired,
};
