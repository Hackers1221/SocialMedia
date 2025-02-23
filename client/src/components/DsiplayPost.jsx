import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";

const DisplayPost = ({ open, setOpen, post }) => {
  if (!post) return <></>;

  const currUser = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const dialogRef = useRef(null); // Reference for the dialog

  const [date, setDate] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [creator, setCreator] = useState({
    image: "A",
    name: "Anonymous",
    username: "",
    password: "",
    email: "",
    birth: "",
  });

  function getDate() {
    let date = post?.createdAt?.toString()?.split("T")[0].split("-").reverse().join("/");
    setDate(date);
  }

  async function getUser(userId) {
    const response = await dispatch(getUserById(userId));
    if (!response) {
      toast.error("Something went wrong!");
    }
    setCreator(response.payload?.data?.userdetails);
  }

  function toggleLike() {
    setLiked(!liked);
  }
  function toggleBookmark() {
    setSaved(!saved);
  }

  useEffect(() => {
    getDate();
    getUser(post?.userId);

    if (open) {
      dialogRef.current?.showModal(); // Open the dialog when `open` is true
    } else {
      dialogRef.current?.close(); // Close the dialog when `open` is false
    }
  }, [post, open]);

  const closeDialog = () => {
    setOpen(false);
    dialogRef.current?.close(); // Ensure the dialog closes properly
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
      {/* Close Button */}
      <div className="flex">
        <div className="relative flex w-[50%] h-[40rem] justify-center">
          <div className="absolute top-2 left-2 bg-black w-[10rem] flex flex-col items-start bg-opacity-80 text-white text-sm px-3 py-1 rounded z-[20]">
            <p className="font-semibold">{creator?.name}</p>
            <p className="text-xs">{date}</p>
          </div>
          <div className="carousel">
            {post?.image?.map((photo, key) => (
              <div key={`image-${key}`} className="carousel-item h-full flex items-center justify-center w-full relative">
                <img src={photo} className="w-max h-max" alt="Image not found" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between w-[50%]">
          <div className="flex bg-transparent text-white text-sm px-8 py-4">
            <p>{post?.caption}</p>
          </div>
          <div>

          </div>
          <div className="flex flex-col">
          <div className="mt-5 flex w-full justify-between px-8">
            <div className="flex gap-4">
              <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleLike}>
                {liked ? (<i className="text-white fa-solid fa-heart"></i>) : <i className="text-white fa-regular fa-heart"></i>}
                {post?.likes?.length}
              </button>
              <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`}>
              {/* <i className="text-white fa-solid fa-comment"></i> */}
                <i className="text-white fa-regular fa-comment"></i>
                {post?.comments?.length}
              </button>
            </div>
            <div className="flex">
            <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleBookmark}>
                {saved? <i className="text-white fa-solid fa-bookmark"></i> : <i className="text-white fa-regular fa-bookmark"></i>}
                {post?.saved?.length}
              </button>
            </div>
          </div>
            <div className="flex mt-4 p-4 gap-3">
              <div>
                <Avatar url={currUser?.data?.image} />
              </div>
              <div className="grow rounded-full relative">
                <form >
                  <input
                    className={`block w-full p-2 px-4 overflow-hidden h-12 focus:outline-none rounded-full bg-[${_COLOR.less_light}]`} placeholder="Leave a comment"/>
                </form>
                <button className={`absolute top-3 right-4`}>
                  <i className={`text-white fa-solid fa-paper-plane`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DisplayPost;
