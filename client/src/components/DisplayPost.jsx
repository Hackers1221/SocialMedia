import React, { useEffect, useState, useRef, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";
import { FaPaperPlane, FaPlay, FaPause } from "react-icons/fa";
import Comment from "./Comment";
import Loader from "./Loader";
import { CreateComment, getCommentByPostId } from "../redux/Slices/comment.slice";
import { getAllPosts } from "../redux/Slices/post.slice";
import usePosts from "../hooks/usePosts";


const DisplayPost = ({ open, setOpen, post }) => {
  if (!post || !open) return null;

  const authState = useSelector((state) => state.auth);
  const commentState = useSelector((state) => state.comment);
  const postState = usePosts ();

  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const videoRefs = useRef([]);
  const timeoutRef = useRef(null);
  const defaultImage = "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png";

  const [date, setDate] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState({ image: "", name: "Anonymous" });
  const [isPlaying, setIsPlaying] = useState([false]);
  const [showButton, setShowButton] = useState([true]);
  const [commentDescription , setDescription] = useState("");
  const [countLike,setcountLike] = useState(post?.likes.length);
  const [countComment,setCountComment] = useState(post?.comments?.length);

  async function postCommentHandler() {
    const data = {
          description : commentDescription ,
          userId : authState.data?._id,
          postId : post?._id
      };
      const response = await dispatch(CreateComment(data));
      if(response.payload){
        setDescription("");
        await dispatch (getAllPosts ());
        await dispatch(getCommentByPostId(post?._id));
      }
  }

  function handleChange (e) {
    const {name, value} = e.target;
    setDescription(value);
  }

  const togglePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
        setIsPlaying((prev) => ({
          ...prev,
          [i]: false,
        }));
      }
    });
  
    const video = videoRefs.current[index];
    if (!video) return;
  
    if (video.paused) {
      video.play();
      setIsPlaying((prev) => ({
        ...prev,
        [index]: true,
      }));
    } else {
      video.pause();
      setIsPlaying((prev) => ({
        ...prev,
        [index]: false,
      }));
    }
  
    setShowButton((prev) => ({
      ...prev,
      [index]: true,
    }));
  
    resetHideButtonTimer(index);
  };
  

  const resetHideButtonTimer = (index) => {
    if (timeoutRef.current[index]) clearTimeout(timeoutRef.current[index]);
    timeoutRef.current[index] = setTimeout(() => {
      setShowButton((prev) => ({
        ...prev,
        [index]: false,
      }));
    }, 500);
  };
  

  const closeDialog = () => {
    setOpen(false);
    videoRefs.current?.pause();
    dialogRef.current?.close();
  };

  const toggleLike = async () => {
    const response = await dispatch(likePost({
      _id, 
      id: authState._id 
    }));
    if(!response.payload)return;
  
    if (liked) {
      setcountLike(countLike - 1);
    } else {
      setcountLike(countLike + 1);
    }
    
    setLiked(!liked);
  }; 

    const toggleBookmark = async() => {
      const response = await dispatch(updateSavedPost({
        _id1  : authState._id,
        id : _id
      }))

      if (!response?.payload) return;
      setSaved ((prev) => !prev);
    }

  // fetching data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
  
      try {
        if (post?.createdAt) {
          setDate(post.createdAt.split("T")[0].split("-").reverse().join("/"));
        }
  
        if (post?.userId) {
          const userResponse = await dispatch(getUserById(post.userId));
          setCreator(userResponse.payload?.data?.userdetails || {});
  
          await dispatch(getCommentByPostId(post._id)); // Fetch comments only after user data is received
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (post) {
      fetchData();
    }  
    
  }, []);

  useEffect (() => {
    setSaved (postState?.savedList?.find ((savedPost) => savedPost._id === post?._id));
    if(post?.likes.includes(authState?.data?._id)){
      setLiked(true);
    }
    else setLiked(false);
    setCountComment(post?.comments.length);
    setcountLike(post?.likes.length);
  }, [post])

  // open close dialog
  useEffect(() => {  
    if (open && !loading) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open, loading]);  


  return loading ? <Loader /> : (
    <dialog ref={dialogRef} className="w-[60%] h-[90vh] bg-black rounded-lg shadow-xl p-4">
      <button onClick={closeDialog} className="absolute top-5 right-6 text-white text-xl focus:outline-none">✕</button>
      <div className="flex h-full">
        {/* Left Half */}
        <div className="w-1/2 p-4 flex flex-col relative">
          <div className="absolute top-0 left-0 flex items-center gap-3 mb-4 z-[100] bg-black bg-opacity-50 px-4 py-2">
            <Avatar url={creator.image || defaultImage} />
            <div>
              <p className="text-white font-semibold">{creator.name}</p>
              <p className="text-gray-400 text-sm">{date}</p>
            </div>
          </div>
          <div className="flex justify-center items-center relative w-full h-full">
            <div className="carousel w-full">
              {post.image?.map((img, idx) => (
                <div key={idx} className="carousel-item w-full flex justify-center relative">
                  <img src={img.url} className="h-auto w-full" alt="Post" />
                </div>
              ))}
              {post.video?.map((video, idx) => (
                <div key={idx} className="carousel-item w-full flex justify-center relative" onClick={() => togglePlay (idx)}>
                  <video ref={(el) => (videoRefs.current[idx] = el)} loop className="w-full max-h-[40rem]">
                    <source src={video.url} type="video/mp4" />
                  </video>
                  {/* Play/Pause Button */}
                  {showButton[idx] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-30 rounded-full w-16 h-16 flex items-center justify-center">
                        {isPlaying[idx] ? (
                          <i className="fa-solid fa-pause text-white"></i>
                        ) : (
                          <i className="fa-solid fa-play text-white"></i>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="absolute bottom-0 left-0 text-white mt-2 z-[100] bg-black bg-opacity-50 px-4 py-2 h-[1rem]">{post.caption}</p>
        </div>

        {/* Right Half */}
        <div className="w-1/2 flex flex-col bg-gray-900 bg-opacity-50 p-4 rounded-lg">
          <div className="flex-1 overflow-y-auto space-y-3 pt-2">
            {commentState.comments.map((comment, idx) => (
              <div key={idx}>
                <Comment avatar={comment.user.image} username={comment.user.username} text={comment.description} time={"10 h"} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex w-full justify-between p-2 border-t border-gray-700">
            <div className="flex gap-4">
              <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleLike}>
                {liked ? (<i className="text-red-600 fa-solid fa-heart"></i>) : <i className="text-white fa-regular fa-heart"></i>}
                {countLike}
              </button>
              <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={() => {
                getComments;
                setDialogOpen(true);
              }}>
              {/* <i className="text-white fa-solid fa-comment"></i> */}
                <i className="text-white fa-regular fa-comment"></i>
                {countComment}
              </button>
            </div>
            <div className="flex">
            <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleBookmark}>
                {saved? <i className="text-white fa-solid fa-bookmark"></i> : <i className="text-white fa-regular fa-bookmark"></i>}
              </button>
            </div>
          </div>
          <div className="mt-auto flex items-center gap-3 p-2 relative">
            <Avatar url={authState?.data?.image || defaultImage} />
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentDescription}
                className="w-full p-2 px-4 pr-10 rounded-full bg-gray-700 text-white font-normal outline-none"
                placeholder="Write a comment..."
                onChange={handleChange}
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