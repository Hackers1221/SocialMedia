import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";
import { FaPaperPlane } from "react-icons/fa";
import Comment from "./Comment";
import Loader from "./Loader";
import { CreateComment, getCommentByPostId } from "../redux/Slices/comment.slice";
import { getPostById, getSavedPost, likePost, updateSavedPost } from "../redux/Slices/post.slice";
import usePosts from "../hooks/usePosts";
import { Link } from "react-router-dom";
import LinkDetector from '../components/LinkDetector'
import SelectedUser from "./SelectedUser";
import { showToast } from "../redux/Slices/toast.slice";


const DisplayPost = ({ open, setOpen, index, list, followers }) => {
  if (!index || !open) return null;

  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const videoRefs = useRef([]);
  const timeoutRef = useRef([]);

  const authState = useSelector((state) => state.auth);
  const commentState = useSelector((state) => state.comment);
  const [postState] = usePosts();

  const postLists = {
    downloadedPosts: postState.downloadedPosts,
    postList: postState.postList,
    savedList: postState.savedList,
  };

  const postsArray = postLists[list] || [];
  const [postIndex, setPostIndex] = useState(index ? index - 1 : 0);
  const post = postsArray[postIndex];

  const [creator, setCreator] = useState(null);
  const [date, setDate] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentDescription, setDescription] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState({});
  const [showButton, setShowButton] = useState({});
  const [hashtags, setHashtags] = useState("");
  const [isShare, setShare] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState ("");

  const totalItems = (post?.image?.length || 0) + (post?.video?.length || 0);

  function goForward() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  function goBack() {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  async function postCommentHandler() {
    const data = {
      description: commentDescription,
      userId: authState.data?._id,
      postId: post?._id,
      type: "post"
    };
    const response = await dispatch(CreateComment(data));

    if (response.payload) {
      setDescription("");
      // await dispatch (getAllPosts ());
      await dispatch(getCommentByPostId(post?._id));
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
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

  const extractThumbnail = (videoURL) => {
        const video = document.createElement("video");
        video.src = videoURL;
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true;

        video.addEventListener("loadedmetadata", () => {
            video.currentTime = Math.min(5, video.duration / 2);
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const element = { url: canvas.toDataURL("image/png"), filename: "video" };

            setVideoThumbnail (element);
        });

        video.addEventListener("error", (e) => {
            console.error("Error loading video:", e);
        });

        video.load();
    };


  const closeDialog = () => {
    setOpen(false);
    videoRefs.current?.pause();
    dialogRef.current?.close();
  };

  const toggleLike = async () => {
    const response = await dispatch(likePost({
      _id: post?._id,
      id: authState.data?._id
    }));

    if (!response.payload) return;

    setLiked(!liked);
  };

  const toggleBookmark = async () => {
    if (post.video[0]?.url) extractThumbnail (post.video[0]?.url);

    const response = await dispatch(updateSavedPost({
      _id1: authState.data?._id,
      id: post?._id
    }))

    if (!response?.payload) return;

    if (!saved) dispatch (showToast ({ message: 'Saved successfully!', type: 'save', image: post.image[0]?.url || videoThumbnail?.url }));
    setSaved((prev) => !prev);
    await dispatch(getSavedPost(authState.data?._id));
  }

  function getTimeDifference(dateString) {
    const now = new Date();
    const targetDate = new Date(dateString);

    const nowUTC = Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()
    );

    const targetDateUTC = Date.UTC(
      targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(),
      targetDate.getUTCHours(), targetDate.getUTCMinutes(), targetDate.getUTCSeconds()
    );

    const diffInSeconds = Math.floor((nowUTC - targetDateUTC) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
  }

  function postForward() {
    setPostIndex((prev) => (prev + 1) % postsArray.length);
  }

  function postBackward() {
    setPostIndex((prev) => (prev - 1 + postsArray.length) % postsArray.length);
  }

  function getHashtags () {
        if (!post.interests[0]) {
            setHashtags ([]); return;
        }
        
        let temp = post.interests[0]?.split (" ");
        
        temp = temp?.map((hashtag) => hashtag.trim());
        temp = temp?.map((hashtag) => (hashtag.length > 0 ? "#" : "") + hashtag);
        setHashtags (temp);
    }

  useEffect(() => {
    if (post?.userId) {
      setLoading(true);
      dispatch(getUserById(post.userId)).then((res) => {
        setCreator(res.payload?.data?.userdetails);
        setLoading(false);
      });
      dispatch(getCommentByPostId(post._id));
    }
  }, [post]);

  useEffect(() => {
    if (post) {
      setDate(getTimeDifference(post.createdAt));
      setLiked(post.likes?.includes(authState.data?._id));
      setSaved(postState.savedList?.some((p) => p._id === post._id));
      
      getHashtags ();
    }
  }, [post?._id, postState.savedList]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") setPostIndex((prev) => (prev + 1) % postsArray.length);
      if (event.key === "ArrowLeft") setPostIndex((prev) => (prev - 1 + postsArray.length) % postsArray.length);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [postsArray.length]);

  useEffect(() => {
    if (open && dialogRef.current) {
      if (!dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <>
      {open && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[2]"></div>}
      <dialog ref={dialogRef} className={`w-[60%] h-[90vh] bg-[var(--card)] rounded-lg shadow-xl p-2`}>
        <SelectedUser isOpen={isShare} setOpen={setShare} followers={followers} post={post} />

        <div className="fixed right-8 top-1/2 bottom-1/2 z-[50] hover:cursor-pointer" onClick={postForward} title="Next post">
          <i className="fa-solid fa-circle-chevron-right text-[var(--dropdown)] text-[2rem]"></i>
        </div>
        <div className="fixed left-8 top-1/2 bottom-1/2 z-[50] hover:cursor-pointer" onClick={postBackward} title="Previous post">
          <i className="fa-solid fa-circle-chevron-left text-[var(--dropdown)] text-[2rem]"></i>
        </div>
        <button onClick={closeDialog} className={`fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[500]`}>✕</button>
        {loading ? <Loader /> : (
          <div className={`flex h-full border border-[var(--border)] bg-[var(--card)]`}>
            {/* Left Half */}
            <div className="w-1/2 px-4 flex relative items-center bg-black">
              <div className={`absolute top-0 left-0 flex items-center gap-3 mb-4 z-[100] bg-[var(--card)] px-4 py-2`}>
                <Avatar url={creator?.image?.url} id={creator?._id} size={"md"} />
                <div>
                  <Link to={`/profile/${creator?.username}`}>
                    <span className={`mr-1 text-sm font-semibold cursor-pointer hover:underline hover:text-[var(--buttons)] text-[var(--text)]`}>
                      {creator?.username}
                    </span>
                  </Link>
                  <p className={`text-[var(--text)] text-xs`}>{date}</p>
                </div>
              </div>
              <div className="flex justify-center items-center w-full h-full">
                <div className="carousel w-full h-full relative">
                  {post.image?.map((img, idx) => (
                    <div
                      key={idx}
                      className={`carousel-item w-full flex justify-center items-center relative ${idx === currentIndex ? 'block' : 'hidden'}`}
                    >
                      <img src={img.url} className="w-full h-full object-contain" alt="Post" />
                    </div>
                  ))}
                  {post.video?.map((video, idx) => (
                    <div
                      key={idx + (post.image?.length || 0)}
                      className={`carousel-item w-full flex justify-center relative ${idx + (post.image?.length || 0) === currentIndex ? 'block' : 'hidden'}`}
                      onClick={() => togglePlay(idx)}
                    >
                      <video ref={(el) => (videoRefs.current[idx] = el)} loop className="w-full max-h-[40rem]">
                        <source src={video.url} type="video/mp4" />
                      </video>
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
              {currentIndex > 0 && (
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 h-full w-[2rem] bg-transparent hover:bg-black/20"
                  onClick={goBack}
                >
                </button>
              )}
              {currentIndex < totalItems - 1 && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 h-full w-[2rem] bg-transparent hover:bg-black/20"
                  onClick={goForward}
                >
                </button>
              )}
              {totalItems > 1 && <div className="absolute bottom-8 left-1/2 right-1/2 bg-black/70 text-white rounded-full text-xs w-max">{currentIndex + 1} / {totalItems}</div>}
            </div>

            {/* Right Half */}
            <div className="w-1/2 flex flex-col p-4 border-l border-[var(--border)]">
              {(post?.caption?.length > 0 || hashtags?.length > 0) && <LinkDetector title={post?.caption} type={'displayePost'} />}
              <div className="px-4">
                <div className={`w-full flex flex-wrap gap-1 ${post?.caption?.length > 0 ? "mt-4" : ""}`}>
                    {hashtags.length > 0 && hashtags.map ((hashtag, index) => (
                        <p className="text-[var(--buttons)] text-xs rounded-full bg-[var(--background)] py-1 px-2" key={index}>{hashtag}</p>
                    ))}
                </div>
            </div>
              <div className={`flex-1 overflow-y-auto space-y-1 pt-2 ${(post?.caption?.length > 0 || hashtags?.length > 0) ? 'border-t' : ''} border-[var(--border)]`}>
                {commentState.comments.length > 0 ? (
                  commentState.comments.map((comment, idx) => (
                    <div key={idx}>
                      <Comment commentId={comment._id} avatar={comment.user.image?.url} username={comment.user.username} text={comment.description} time={comment.createdAt} />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500">No comments yet</div>
                )}
              </div>

              {commentState.comments.length > 0 && <div className={`text-white text-xs`}>
                {commentState.comments.length} {commentState.comments.length === 1 ? "comment" : "comments"}
              </div>}


              <div className="mt-2 flex w-full justify-between p-2 border-t">
                <div className="flex gap-4">
                  <button className={`flex gap-2 items-center text-[var(--text)]`} onClick={toggleLike}>
                    {liked ? (<i className="text-red-600 fa-solid fa-heart"></i>) : <i className={`text-[var(--text)] fa-regular fa-heart`}></i>}
                    {liked ? (<h2 className="text-sm text-red-600 font-semibold">Liked</h2>) : (<h2 className="text-sm font-semibold">Like</h2>)}
                  </button>
                  <button className={`flex gap-2 items-center`} onClick={() => setShare(true)}>
                    <i className={`text-[var(--text)] fa-regular fa-paper-plane`}></i>
                    <h2 className="text-sm font-semibold">Share</h2>
                  </button>
                </div>
                <div className="flex">
                  <button className={`flex gap-2 items-center text-[var(--text)]`} onClick={toggleBookmark}>
                    {saved ? <i className={`text-[var(--buttons)] fa-solid fa-bookmark`}></i> : <i className={`text-[var(--text)] fa-regular fa-bookmark`}></i>}
                    {saved ? (<h2 className={`text-sm text-[var(--buttons)] font-semibold`}>Saved</h2>) : (<h2 className="text-sm font-semibold">Save</h2>)}
                  </button>
                </div>
              </div>
              <div className="mt-auto flex items-center gap-3 p-2 relative">
                <Avatar url={authState?.data?.image?.url} id={authState.data?._id} />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={commentDescription}
                    className={`w-full p-2 px-4 pr-10 rounded-full text-[var(--text)] border border-[var(--input)] bg-transparent font-normal outline-none focus:shadow-md`}
                    placeholder="Write a comment..."
                    onChange={handleChange}
                  />
                  <FaPaperPlane onClick={postCommentHandler} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text)] cursor-pointer`} />
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
};

export default DisplayPost;