import React, { useEffect, useRef, useState } from "react";

const DisplayStory = ({ open, setOpen, index }) => {
  const dialogRef = useRef(null);
  const videoRef = useRef(null);

  const videoUrls = [
    "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740330241/socialMedia/videos/1740330232651-videoplayback%20%284%29.mp4.mp4",
    "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740333146/socialMedia/videos/1740333139819-MAX%20QUALITY%20FILE%20IN%20BIO%20From%20the%20magnetic%20presence%20of%20Nayanthara%2C%20the%20versatile%20performances%20of%20Samantha%20Akkineni%2C%20and%20the%20powerful%20portrayals%20of%20Anushka%20Shetty%20to%20the%20graceful%20charm%20of%20Trisha%20Krishnan%2C%20these%20l%20%281%29.mp4.mp4"
  ];

  const [showButton, setShowButton] = useState(false);
  
  
    const handleVideoClick = () => {
      setShowButton(true);
  
      // Hide the button after 500ms
      setTimeout(() => {
        setShowButton(false);
      }, 500);
  
      // Toggle play/pause
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    };


  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open, index]); // Run effect when `open` changes

  const closeDialog = () => {
    setOpen(false);
    if (videoRef.current) videoRef.current.pause();
    dialogRef.current?.close();
  };

  if (index === -1 || !open) return null; // Stop rendering if `open` is false or index is -1

  return (
    <dialog ref={dialogRef} className="relative w-full h-full flex justify-center items-center mx-auto p-2 py-4 backdrop:bg-black/50 bg-transparent shadow-xl rounded-lg z-[100]">
      <p
        onClick={closeDialog}
        className="absolute top-2 right-2 text-lg hover:bg-gray-800 text-white px-3 py-1 rounded-md focus:outline-none hover:cursore-pointer"
      >
        ✕
      </p>
      <div className="w-[60%]" data-carousel="static">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {videoUrls.slice(index)?.map((story, index) => (
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <video 
                    ref={videoRef}
                    src={story}
                    className="w-max h-[min(40rem,max-content)]" 
                    onClick={handleVideoClick}
                  >
                    {/* <source src={ele} type="video/mp4" /> */}
                    Your browser does not support the video tag.
                  </video>
            
                  {showButton && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center text-white text-3xl bg-black bg-opacity-0 p-4 transition-opacity duration-300"
                      style={{ pointerEvents: "none" }} // Prevents unwanted clicks on the button itself
                    >
                      {videoRef.current?.paused ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                    </div>
                  )}
            </div>
          ))}
        </div> 
      </div>
      <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <i class="fa-solid fa-angle-left"></i>
            <span className="sr-only">Previous</span>
        </span>
    </button>
    <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <i class="fa-solid fa-angle-right"></i>
            <span className="sr-only">Next</span>
        </span>
    </button>
    </dialog>
  );
};

export default DisplayStory;
