import React, { useEffect, useRef, useState } from "react";

const DisplayStory = ({ open, setOpen, index }) => {
  if (index === -1 || !open) return null;

  const [current, setCurrent] = useState(index);
  const dialogRef = useRef(null);
  const videoRef = useRef(null);

  const videoUrls = [
    "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740330241/socialMedia/videos/1740330232651-videoplayback%20%284%29.mp4.mp4",
    "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740333146/socialMedia/videos/1740333139819-MAX%20QUALITY%20FILE%20IN%20BIO%20From%20the%20magnetic%20presence%20of%20Nayanthara%2C%20the%20versatile%20performances%20of%20Samantha%20Akkineni%2C%20and%20the%20powerful%20portrayals%20of%20Anushka%20Shetty%20to%20the%20graceful%20charm%20of%20Trisha%20Krishnan%2C%20these%20l%20%281%29.mp4.mp4"
  ];

  const [showButton, setShowButton] = useState(false);

  const handleVideoClick = () => {
    setShowButton(true);

    setTimeout(() => {
      setShowButton(false);
    }, 500);

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play(); // Auto-play the video
    }
  }, [open, current]); // Runs when `open` or `current` video changes

  const closeDialog = () => {
    setOpen(false);
    videoRef.current?.pause();
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="relative w-full h-full flex justify-center items-center mx-auto p-2 py-4 backdrop:bg-black/50 bg-transparent shadow-xl rounded-lg z-[100] focus:outline-none"
    >
      <p
        onClick={closeDialog}
        className="absolute top-2 right-2 text-lg hover:font-bold hover:text-xl text-white px-3 py-1 rounded-md focus:outline-none cursor-pointer z-[100]"
      >
        ✕
      </p>

      <div className="flex w-[40%] justify-center relative">
        {videoUrls[current] && (
          <video
            ref={videoRef}
            src={videoUrls[current]}
            className="w-max h-[min(40rem,max-content)]"
            onClick={handleVideoClick}
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        )}

        {showButton && (
          <div
            className="absolute inset-0 flex items-center justify-center text-white text-3xl bg-black bg-opacity-0 p-4 transition-opacity duration-300"
            style={{ pointerEvents: "none" }}
          >
            {videoRef.current?.paused ? (
              <i className="fa-solid fa-play"></i>
            ) : (
              <i className="fa-solid fa-pause"></i>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {current > 0 && (
        <button
          type="button"
          onClick={() => setCurrent(current - 1)}
          className="absolute top-1/2 left-2 text-white bg-black/50 p-2 rounded-full w-[2rem] focus:outline-none"
        >
          <i className="fa-solid fa-angle-left"></i>
        </button>
      )}

      {current < videoUrls.length - 1 && (
        <button
          type="button"
          onClick={() => setCurrent(current + 1)}
          className="absolute top-1/2 right-2 text-white bg-black/50 p-2 rounded-full w-[2rem] focus:outline-none"
        >
          <i className="fa-solid fa-angle-right"></i>
        </button>
      )}

    </dialog>
  );
};

export default DisplayStory;
