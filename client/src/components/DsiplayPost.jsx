import React, { useEffect, useState, useRef, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";
import { FaPaperPlane, FaPlay, FaPause } from "react-icons/fa";
import Comment from "./Comment";

const DisplayPost = ({ open, setOpen, post }) => {
  if (!post || !open) return null;

  const currUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const defaultImage = "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png";

  const [date, setDate] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [creator, setCreator] = useState({ image: "", name: "Anonymous" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const SampleComments = [
    "Nice post !",
    "ye sab hatao lauda e sab hatao lauda e sab hatao lauda",
    "randi sai",
    "Nice post !",
    "ye sab hatao lauda e sab hatao lauda e sab hatao lauda",
    "randi sai",
    "Nice post !",
    "ye sab hatao lauda e sab hatao lauda e sab hatao lauda",
    "randi sai",
  ];

  function postCommentHandler() { }

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
    timeoutRef.current = setTimeout(() => setShowButton(false), 500);
  };

  const closeDialog = () => {
    setOpen(false);
    videoRef.current?.pause();
    dialogRef.current?.close();
  };

  useEffect(() => {
    if (post?.createdAt) {
      setDate(post.createdAt.split("T")[0].split("-").reverse().join("/"));
    }
    if (post?.userId) {
      dispatch(getUserById(post.userId)).then((response) => {
        setCreator(response.payload?.data?.userdetails || {});
      });
    }
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [post, open]);

  return (
    <dialog ref={dialogRef} className="w-[60%] h-[90vh] bg-black rounded-lg shadow-xl p-4">
      <button onClick={closeDialog} className="absolute top-5 right-6 text-white text-xl">✕</button>
      <div className="flex h-full">
        {/* Left Half */}
        <div className="w-1/2 p-4 flex flex-col relative">
          <div className="flex items-center gap-3 mb-4">
            <Avatar url={creator.image || defaultImage} />
            <div>
              <p className="text-white font-semibold">{creator.name}</p>
              <p className="text-gray-400 text-sm">{date}</p>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="carousel w-full h-[90%]">
              {post.image?.map((img, idx) => (
                <div key={idx} className="carousel-item w-full flex justify-center relative">
                  <img src={img} className="h-auto max-w-full" alt="Post" />
                </div>
              ))}
              {post.video && (
                <div className="carousel-item w-full flex justify-center relative" onClick={togglePlay}>
                  <video ref={videoRef} className="w-full max-h-[40rem]">
                    <source src={post.video} type="video/mp4" />
                  </video>
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
                </div>
              )}
            </div>
          </div>
          <p className="text-white mt-2">{post.caption}</p>
        </div>

        {/* Right Half */}
        <div className="w-1/2 flex flex-col bg-gray-900 bg-opacity-50 p-4 rounded-lg">
          <div className="flex-1 overflow-y-auto space-y-3 pt-2">
            {SampleComments?.map((comment, idx) => (
              <div key={idx}>
                <Comment avatar={defaultImage} username={"Rounak kumar"} text={comment} time={"10 h"} />
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-3 border-t border-gray-700 p-2 relative">
            <Avatar url={currUser?.data?.image || defaultImage} />
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full p-2 pr-10 rounded-full bg-gray-700 text-white font-normal outline-none"
                placeholder="Write a comment..."
              />
              <FaPaperPlane onClick={postCommentHandler} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DisplayPost;
