import React, { useRef, useState } from "react";

const DisplayStory = ({ open, setOpen, index }) => {
  console.log (open)
  if (index == -1 || !open || open == 'undefined') return <></>;

  const dialogRef = useRef(null); // Reference for the dialog
  const videoRef = useRef(null);

  const videoUrls = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740330241/socialMedia/videos/1740330232651-videoplayback%20%284%29.mp4.mp4",
    "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740333146/socialMedia/videos/1740333139819-MAX%20QUALITY%20FILE%20IN%20BIO%20From%20the%20magnetic%20presence%20of%20Nayanthara%2C%20the%20versatile%20performances%20of%20Samantha%20Akkineni%2C%20and%20the%20powerful%20portrayals%20of%20Anushka%20Shetty%20to%20the%20graceful%20charm%20of%20Trisha%20Krishnan%2C%20these%20l%20%281%29.mp4.mp4"
  ];
  const closeDialog = () => {
    setOpen(false);
    // videoRef.current.pause();
    // dialogRef.current?.close(); // Ensure the dialog closes properly
  };

  return (
    <dialog
      ref={dialogRef}
      className={`relative w-[60%] mx-auto p-2 py-4 bg-black shadow-[${_COLOR.less_light}] shadow-xl rounded-lg z-[100]`}
    >
      <button
        onClick={closeDialog}
        className="absolute top-2 right-2 bg-transparent hover:bg-gray-800 text-white text-sm px-3 py-1 rounded-md focus:outline-none"
      >
        ✕
      </button>

    </dialog>
  );
}

export default DisplayStory;
