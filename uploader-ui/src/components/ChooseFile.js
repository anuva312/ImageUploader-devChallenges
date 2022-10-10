import React from "react";

export default function ChooseFile({
  onUpload,
  count,
  formats,
  className,
  handleError,
}) {
  let supportedFormats = formats.map((format) => `image/${format}`);

  function validFileType(file) {
    return supportedFormats.includes(file.type);
  }

  function validateFiles(input) {
    const filesList = input.files;
    if (filesList.length > count) {
      handleError(
        `Sorry, only ${count} file${
          count !== 1 ? "s" : ""
        } can be uploaded at a time`
      );
    } else {
      let filesToUpload = [];
      for (const file of filesList) {
        if (validFileType(file)) {
          filesToUpload.push(file);
        } else {
          handleError(`Not a valid file type. Update your selection.`);
        }
      }
      if (filesToUpload.length) {
        onUpload(filesToUpload);
      }
    }
  }

  return (
    <div>
      <label className={className}>
        <input
          type="file"
          id="choose-file"
          name="choose-file"
          onChange={(e) => validateFiles(e.target)}
        />
        Choose file
      </label>
    </div>
  );
}
