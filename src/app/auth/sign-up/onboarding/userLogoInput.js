import { useState, useEffect } from "react";

import { MdDriveFileRenameOutline } from "react-icons/md";
import { PiUploadSimpleBold } from "react-icons/pi";
// import uploadFileImg from "../../../../../assets/uploadFile.png";
import uploadFileImg from "../../../../../public/assets/sign-up/uploadFile.png";
import Image from "next/image";

export default function UserLogoUpload({ pageNo, setPageNo }) {
  let [errors, setError] = useState(null);
  let [toOpen, setToOpen] = useState(false);
  let [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  let handleFileUpload = () => {
    setToOpen(!toOpen);
  };
  let onClickHandler = () => {
    const file = selectedFile;
    if (
      file &&
      !["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)
    ) {
      console.log("File type is not valid");

      setSelectedFile(null);
      setFileName(null);
      setError({ message: "File type is not valid" });
      return;
    }
    if (!errors) {
      setPageNo(pageNo + 1);
    }
  };
  const handleFileChange = (event) => {
    setError(null);
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0].name);
    setFileName(event.target.files[0].name);
  };
  //   useEffect(() => {
  //     const file = selectedFile;
  //     if (file && !["image/png", "image/jpeg"].includes(file.type)) {
  //       console.log("File type is not valid");

  //       setSelectedFile(null);
  //       setError({ message: "File type is not valid" });
  //     } else {
  //       setError(null);
  //       setSelectedFile(file);
  //     }
  //     if (selectedFile) {
  //       const formData = new FormData();
  //       formData.append("file", selectedFile);
  //     }
  //   }, [selectedFile]);

  return (
    <div className="flex justify-center flex-col  items-center mt-2">
      <Image
        src={uploadFileImg}
        alt="Image to file upload"
        className="my-5 h-[8.5rem] w-[8.5rem]"
      />
      <div className="flex justify-center  flex-wrap items-center">
        <label
          htmlFor="Newlogo"
          className="flex justify-center items-center border  border-gray-400 rounded-md my-2 sm:mx-6 w-[12rem] h-[3rem]"
          style={{ color: "rgba(38, 32, 59, 1)" }}
          onClick={handleFileUpload}
        >
          <PiUploadSimpleBold fontSize={"18px"} />
          <span className="ml-2 text-base font-semibold">Upload Image</span>
        </label>
        {toOpen && (
          <input
            id="Newlogo"
            name="Newlogo"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          ></input>
        )}

        <div className=" sm:w-[1px] h-14 bg-slate-400"></div>
        <button
          className="flex flex-row justify-center items-center border  border-gray-400 rounded-md my-2 mx-2 sm:mx-6 w-[12rem] h-[3rem] "
          style={{ color: "rgba(38, 32, 59, 1)" }}
        >
          <MdDriveFileRenameOutline fontSize={"18px"} />
          <span className="ml-2 text-base font-semibold">Edit Image</span>
        </button>
      </div>
      {errors ? <p>{errors.message}</p> : <p>{fileName}</p>}
      <div className="flex justify-center w-full mt-8 ">
        <button
          className="flex justify-center items-center w-[50%] p-2 text-white font-medium rounded-md hover:border-white"
          style={{ background: "rgba(70, 95, 241, 1)" }}
          onClick={onClickHandler}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
