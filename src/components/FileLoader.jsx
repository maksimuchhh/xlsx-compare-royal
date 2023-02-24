import { useDropzone } from "react-dropzone";

function FileUploader({ onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      style={{
        height: 300,
        border: "2px solid blue",
        borderRadius: 8,
        marginBottom: 20,
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Перетащіть файли сюди ...</p>
      ) : (
        <p>Перетащіть файли сюди або натисніть, щоб обрати файли</p>
      )}
    </div>
  );
}

export default FileUploader;
