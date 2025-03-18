import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePulse } from "../redux/Slices/pulse.slice";

export default function PulseCard({ pulse }) {
  if (!pulse) return null;
  console.log(pulse);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [countLike,setCountLike] = useState(pulse?.likes?.length);
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

  const handleLike = async(event) => {
    event.stopPropagation();
      const response = await dispatch(likePulse({
        _id : pulse._id,
        id : authState.data?._id
      }));
      if(!response.payload){
        return;
      }
      if(liked){
        setCountLike(countLike - 1);
      }else{
        setCountLike(countLike + 1);
      }
      setLiked(!liked);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().then(() => {
            setIsPlaying(true);
            resetHideButtonTimer();
          }).catch(() => {
            console.warn("Autoplay blocked by browser.");
            setIsPlaying(false);
          });
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
      className="reel-container w-80 h-[65vh] md:w-96 md:h-[78vh] overflow-hidden rounded-xl shadow-lg flex justify-center relative bg-black"
      onClick={togglePlay}
    >
      <video ref={videoRef} className="w-max bg-black" src={pulse.video} loop></video>

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
      <button
          className="flex flex-col items-center justify-center gap-1 text-white p-3 w-10 h-10"
          onClick = {handleLike}
        >
          {liked ? (
            <i className="text-red-600 fa-solid fa-heart text-4xl"></i>
          ) : (
            <i className={`text-white fa-regular fa-heart text-4xl`}></i>
          )}
          <span className="text-base font-medium">{countLike}</span>
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
