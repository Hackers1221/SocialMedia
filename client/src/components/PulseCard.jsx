import { useState, useEffect, useRef } from "react";

export default function PulseCard({ URL }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);

    // User details
    const user = {
        profileImage: "https://i.pravatar.cc/200?img=3",
        username: "Rounak kumar"
    }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowButton(true);
      resetHideButtonTimer();
    }
  };

  const resetHideButtonTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowButton(false), 1000);
  };
  useEffect(() => {
    const handleAutoPlay = () => {
      if (videoRef.current && document.readyState === "complete") {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          resetHideButtonTimer();
        }).catch(() => {
          console.warn("Autoplay blocked by browser.");
          setIsPlaying(false);
        });
      }
    };

    document.addEventListener("readystatechange", handleAutoPlay);
    return () => document.removeEventListener("readystatechange", handleAutoPlay);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().then(() => {
            setIsPlaying(true);
            resetHideButtonTimer();
          })
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="reel-container w-80 h-[28rem] md:w-96 md:h-[33rem] overflow-hidden rounded-xl shadow-lg relative"
      onClick={togglePlay}
    >
      <video ref={videoRef} className="w-full h-full object-cover" src={URL[0]} loop></video>

      {/* Play/Pause Button */}
      {showButton && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-30 rounded-full w-16 h-16 flex items-center justify-center">
            {isPlaying ? (
              <i className="fa-solid fa-pause text-white"></i>
            ) : (
              <i className="fa-solid fa-play text-white"></i>
            )}
          </div>
        </div>
      )}

      {/* Left Side Buttons */}
      <div className="absolute right-4 bottom-[1.5rem] flex flex-col gap-7">
        <button className="text-white text-2xl">
            {isLiked ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
        </button>
        <button className="text-white text-2xl">
            {isSaved ? <i className="fa-solid fa-comment"></i> : <i className="fa-regular fa-comment"></i>}
        </button>
        <button className="text-white text-2xl">
            <i className="fa-solid fa-bookmark"></i>
        </button>
        <button className="text-white text-2xl">
            <i className="fa-solid fa-paper-plane"></i>
        </button>
        <button className="text-white text-2xl">
            <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      {/* User Profile Section */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <img
          src={user.profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-black"
        />
        <span className="text-white font-semibold">{user.username}</span>
        <button
          className="ml-2 px-3 py-1 text-sm font-medium border border-white text-white rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            setIsFollowed(!isFollowed);
          }}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
}
