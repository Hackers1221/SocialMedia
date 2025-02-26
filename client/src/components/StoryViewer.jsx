import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const StoryViewer = ({ stories, currentIndex, onClose }) => {
  const [index, setIndex] = useState(currentIndex);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const startX = useRef(0); // For touch swipe

  useEffect(() => {
    startProgress();

    // Close on ESC key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalRef.current);
    };
  }, [index]);

  const startProgress = () => {
    clearInterval(intervalRef.current);
    setProgress(0);

    if (stories[index]?.type === "image") {
      let duration = 3000; // 3 seconds for images
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            nextStory();
          }
          return prev + 5;
        });
      }, duration / 20);
    } else {
      videoRef.current?.play();
    }
  };

  const nextStory = () => {
    if (index < stories.length - 1) {
      setIndex(index + 1);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    if (diff > 50) nextStory(); // Swipe Left
    else if (diff < -50) prevStory(); // Swipe Right
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Story Container */}
      <div className="relative w-full max-w-md h-[90vh] flex flex-col items-center justify-center">
        {/* Progress Bar */}
        <div className="absolute top-2 left-4 right-4 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-gray-500 rounded-full">
              <div
                className="h-1 bg-white rounded-full transition-all duration-300"
                style={{
                  width: i === index ? `${progress}%` : i < index ? "100%" : "0%",
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Story Media */}
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          {stories[index].type === "image" ? (
            <img
              src={stories[index]?.url}
              alt="Story"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              src={stories[index]?.url}
              className="max-h-full max-w-full object-contain"
              onEnded={nextStory}
              autoPlay
              controls
            ></video>
          )}

          {/* Navigation Buttons */}
          <button className="absolute left-2 h-full w-1/3" onClick={prevStory}></button>
          <button className="absolute right-2 h-full w-1/3" onClick={nextStory}></button>

          {/* Close Button */}
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Username & Time */}
        <div className="absolute top-4 left-4 text-white flex items-center space-x-2">
          <img
            src={stories[index]?.profile}
            className="w-8 h-8 rounded-full"
            alt="User"
          />
          <span className="text-sm font-semibold">{stories[index]?.username}</span>
          <span className="text-xs text-gray-300">• {stories[index]?.time}m</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StoryViewer;
