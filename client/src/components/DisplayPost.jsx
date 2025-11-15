// Importing React hooks and necessary modules
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// Importing UI components and icons
import Avatar from "./Avatar";
import { FaPaperPlane } from "react-icons/fa";
import Comment from "./Comment";
import Loader from "./Loader";

// Importing Redux actions for comments and posts
import { CreateComment, getCommentByPostId } from "../redux/Slices/comment.slice";
import {
    clearRelatedPosts,
    getPostById,
    getRelatedPosts,
    getSavedPost,
    likePost,
    updateSavedPost
} from "../redux/Slices/post.slice";

// Custom hook to fetch post-related state
import usePosts from "../hooks/usePosts";

// Routing utilities from React Router
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// Utilities and share modal
import LinkDetector from '../components/LinkDetector';
import SelectedUser from "./SelectedUser";

// Toast for notifications
import { showToast } from "../redux/Slices/toast.slice";

import { getTimeDifference } from "../utils/time";

// Main DisplayPost component
const DisplayPost = () => {
    // Get postId from URL parameters
    const { postId } = useParams();
    if (!postId) return;

    // Setup
    const dispatch = useDispatch();
    const dialogRef = useRef(null);             // Modal reference
    const videoRefs = useRef([]);               // References to video DOM elements
    const timeoutRef = useRef([]);              // Timeout trackers for play button UI
    const navigate = useNavigate();
    const location = useLocation();

    // Redux state access
    const authState = useSelector((state) => state.auth);
    const commentState = useSelector((state) => state.comment);
    const [postState] = usePosts();
    const postList = postState.relatedPosts;

    // Component state variables
    const [date, setDate] = useState("");
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [commentDescription, setDescription] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [postIndex, setPostIndex] = useState();
    const [isPlaying, setIsPlaying] = useState({});
    const [showButton, setShowButton] = useState({});
    const [hashtags, setHashtags] = useState("");
    const [isShare, setShare] = useState(false);
    const [videoThumbnail, setVideoThumbnail] = useState("");
    const [post, setPost] = useState({});

    // Total media items (images + videos)
    const totalItems = (post?.image?.length || 0) + (post?.video?.length || 0);

    // Background location for navigation
    const backgroundLocation = location.state?.backgroundLocation || '/';

    // --- UI/Playback Interaction Functions ---

    // Navigate carousel forward
    function goForward() {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }

    // Navigate carousel backward
    function goBack() {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
    }

    // Create a comment on the post
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
            await dispatch(getCommentByPostId(post?._id));
        }
    }

    // Handle comment input change
    function handleChange(e) {
        const { value } = e.target;
        setDescription(value);
    }

    // Play/pause video logic
    const togglePlay = (index) => {
        videoRefs.current.forEach((video, i) => {
            if (video && i !== index) {
                video.pause();
                setIsPlaying((prev) => ({ ...prev, [i]: false }));
            }
        });

        const video = videoRefs.current[index];
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying((prev) => ({ ...prev, [index]: true }));
        } else {
            video.pause();
            setIsPlaying((prev) => ({ ...prev, [index]: false }));
        }

        setShowButton((prev) => ({ ...prev, [index]: true }));
        resetHideButtonTimer(index);
    };

    // Timer to hide play button UI
    const resetHideButtonTimer = (index) => {
        if (timeoutRef.current[index]) clearTimeout(timeoutRef.current[index]);
        timeoutRef.current[index] = setTimeout(() => {
            setShowButton((prev) => ({ ...prev, [index]: false }));
        }, 500);
    };

    // Extract thumbnail from video
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
            setVideoThumbnail(element);
        });

        video.addEventListener("error", (e) => {
            console.error("Error loading video:", e);
        });

        video.load();
    };

    // Close the modal dialog
    const closeDialog = () => {
        navigate(backgroundLocation);
        dispatch(clearRelatedPosts());
        videoRefs?.current?.pause();
    };

    // Toggle like on post
    const toggleLike = async () => {
        const response = await dispatch(likePost({
            _id: post?._id,
            id: authState.data?._id
        }));

        if (!response.payload) return;
        setLiked(!liked);
    };

    // Toggle save/bookmark on post
    const toggleBookmark = async () => {
        if (post.video[0]?.url) extractThumbnail(post.video[0]?.url);

        const response = await dispatch(updateSavedPost({
            _id1: authState.data?._id,
            id: post?._id
        }));

        if (!response?.payload) return;

        if (!saved) {
            dispatch(showToast({
                message: 'Saved successfully!',
                type: 'save',
                image: post.image[0]?.url || videoThumbnail?.url
            }));
        }

        setSaved((prev) => !prev);
        await dispatch(getSavedPost(authState.data?._id));
    };

    // Navigate to next/prev related post
    function postForward() {
        setPostIndex((prev) => (prev + 1) % postList.length);
    }

    function postBackward() {
        setPostIndex((prev) => (prev - 1 + postList.length) % postList.length);
    }

    // Generate hashtags from interests
    function getHashtags() {
        if (!post?.interests) return;
        if (!post?.interests[0]) return setHashtags([]);

        let temp = post.interests[0].split(" ").map(tag => tag.trim()).map(tag => (tag.length > 0 ? "#" : "") + tag);
        setHashtags(temp);
    }

    // Load the full post details
    async function loadPost() {
        let res;
        setLoading(true);
        try {
            res = await dispatch(getPostById(postId));
            setPost(res.payload.data.postDetails);
        } catch (error) {
            navigate(-1);
            dispatch(showToast({ message: "Could not load post", type: "error" }));
        } finally {
            setLoading(false);
        }
    }

    // useEffects below handle post navigation, setup, lifecycle, and keyboard events
    useEffect(() => {
        if (postList?.length > 0 && postList[postIndex] && postList[postIndex] !== postId) {
            navigate(`/post/${postList[postIndex]}`, { state: { backgroundLocation } });
        }
    }, [postIndex]);

    useEffect(() => {
        if (postList?.length) return setPostIndex(postList.indexOf(postId));
        if (!postId) return;
        dispatch(getRelatedPosts(postId));
    }, [postList]);

    useEffect(() => {
        if (postId) loadPost();
    }, [postId]);

    useEffect(() => {
        if (!post) return;
        setDate(getTimeDifference(post.createdAt));
        setLiked(post.likes?.includes(authState.data?._id));
        setSaved(postState.savedList?.some((p) => p._id === post._id));
        dispatch(getCommentByPostId(post._id));
        getHashtags();
    }, [post, postState.savedList]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "ArrowRight") postForward();
            if (event.key === "ArrowLeft") postBackward();
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [postList.length]);

    useEffect(() => {
        if (postId && dialogRef.current) {
            if (!dialogRef.current.open) {
                dialogRef.current.showModal();
            }
        }
    }, [postId]);


    return (
        <>
            {/* Overlay background when post is open */}
            {post && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[2]"></div>}

            {/* Modal dialog for displaying the post */}
            <dialog ref={dialogRef} className="w-[60%] h-[90vh] bg-[var(--card)] rounded-lg shadow-xl p-2">
                {/* Share modal for selecting users */}
                <SelectedUser isOpen={isShare} setOpen={setShare} post={post} target="post" />

                {/* Right arrow to navigate to next post */}
                <div
                    className="fixed right-8 top-1/2 bottom-1/2 z-[50] hover:cursor-pointer"
                    onClick={postForward}
                    title="Next post"
                >
                    <i className="fa-solid fa-circle-chevron-right text-[var(--dropdown)] text-[2rem]"></i>
                </div>

                {/* Left arrow to navigate to previous post */}
                <div
                    className="fixed left-8 top-1/2 bottom-1/2 z-[50] hover:cursor-pointer"
                    onClick={postBackward}
                    title="Previous post"
                >
                    <i className="fa-solid fa-circle-chevron-left text-[var(--dropdown)] text-[2rem]"></i>
                </div>

                {/* Close button */}
                <button
                    onClick={closeDialog}
                    className="fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[500]"
                >
                    ✕
                </button>

                {/* Show loader while loading */}
                {loading ? (
                    <Loader />
                ) : (
                    <div className="flex h-full border border-[var(--border)] bg-[var(--card)]">
                        {/* ---------- Left Half: Media Content (images/videos) ---------- */}
                        <div className="w-1/2 px-4 flex relative items-center bg-black">
                            {/* User info bar */}
                            <div className="absolute top-0 left-0 flex items-center gap-3 mb-4 z-[100] bg-[var(--card)] px-4 py-2">
                                <Avatar url={post.userId?.image?.url} id={post.userId?._id} size="md" />
                                <div>
                                    <Link to={`/profile/${post.userId?.username}`}>
                                        <span className="mr-1 text-sm font-semibold cursor-pointer hover:underline hover:text-[var(--buttons)] text-[var(--text)]">
                                            {post.userId?.username}
                                        </span>
                                    </Link>
                                    <p className="text-[var(--text)] text-xs">{date}</p>
                                </div>
                            </div>

                            {/* Carousel for image/video content */}
                            <div className="flex justify-center items-center w-full h-full">
                                <div className="carousel w-full h-full relative">
                                    {/* Render images */}
                                    {post?.image?.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`carousel-item w-full flex justify-center items-center relative ${idx === currentIndex ? 'block' : 'hidden'}`}
                                        >
                                            <img
                                                src={img.url}
                                                className="w-full h-full object-contain"
                                                alt="Post"
                                            />
                                        </div>
                                    ))}

                                    {/* Render videos */}
                                    {post?.video?.map((video, idx) => (
                                        <div
                                            key={idx + (post.image?.length || 0)}
                                            className={`carousel-item w-full flex justify-center relative ${idx + (post.image?.length || 0) === currentIndex ? 'block' : 'hidden'}`}
                                            onClick={() => togglePlay(idx)}
                                        >
                                            <video
                                                ref={(el) => (videoRefs.current[idx] = el)}
                                                loop
                                                className="w-full max-h-[40rem]"
                                            >
                                                <source src={video.url} type="video/mp4" />
                                            </video>

                                            {/* Play/Pause overlay button */}
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

                            {/* Carousel navigation buttons */}
                            {currentIndex > 0 && (
                                <button
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 h-full w-[2rem] bg-transparent hover:bg-black/20"
                                    onClick={goBack}
                                />
                            )}
                            {currentIndex < totalItems - 1 && (
                                <button
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 h-full w-[2rem] bg-transparent hover:bg-black/20"
                                    onClick={goForward}
                                />
                            )}

                            {/* Current image/video counter */}
                            {totalItems > 1 && (
                                <div className="absolute bottom-8 left-1/2 right-1/2 bg-black/70 text-white rounded-full text-xs w-max">
                                    {currentIndex + 1} / {totalItems}
                                </div>
                            )}
                        </div>

                        {/* ---------- Right Half: Caption, Comments, Actions ---------- */}
                        <div className="w-1/2 flex flex-col p-4 border-l border-[var(--border)]">
                            {/* Caption with link detection */}
                            {(post?.caption?.length > 0 || hashtags?.length > 0) && (
                                <LinkDetector title={post?.caption} type="displayePost" />
                            )}

                            {/* Hashtags */}
                            <div className="pb-2">
                                <div className={`w-full flex flex-wrap gap-1 ${post?.caption?.length > 0 ? "mt-4" : ""}`}>
                                    {hashtags.length > 0 &&
                                        hashtags.map((hashtag, index) => (
                                            <p
                                                className="text-[var(--buttons)] text-xs rounded-full bg-[var(--background)] py-1 px-2"
                                                key={index}
                                            >
                                                {hashtag}
                                            </p>
                                        ))}
                                </div>
                            </div>

                            {/* Comments section */}
                            <div className={`flex-1 overflow-y-auto space-y-1 pt-2 ${(post?.caption?.length > 0 || hashtags?.length > 0) ? 'border-t' : ''} border-[var(--border)]`}>
                                {commentState.comments.length > 0 ? (
                                    commentState.comments.map((comment, idx) => (
                                        <div key={idx}>
                                            <Comment
                                                commentId={comment._id}
                                                avatar={comment.user.image?.url}
                                                username={comment.user.username}
                                                text={comment.description}
                                                time={comment.createdAt}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-sm text-gray-500">No comments yet</div>
                                )}
                            </div>

                            {/* Total comment count */}
                            {commentState.comments.length > 0 && (
                                <div className="text-white text-xs">
                                    {commentState.comments.length}{" "}
                                    {commentState.comments.length === 1 ? "comment" : "comments"}
                                </div>
                            )}

                            {/* Like, Share, Save actions */}
                            <div className="mt-2 flex w-full justify-between p-2 border-t">
                                <div className="flex gap-4">
                                    {/* Like button */}
                                    <button className="flex gap-2 items-center text-[var(--text)]" onClick={toggleLike}>
                                        {liked ? (
                                            <i className="text-red-600 fa-solid fa-heart"></i>
                                        ) : (
                                            <i className="text-[var(--text)] fa-regular fa-heart"></i>
                                        )}
                                        <h2 className={`text-sm font-semibold ${liked ? "text-red-600" : ""}`}>
                                            {liked ? "Liked" : "Like"}
                                        </h2>
                                    </button>

                                    {/* Share button */}
                                    <button className="flex gap-2 items-center" onClick={() => setShare(true)}>
                                        <i className="text-[var(--text)] fa-regular fa-paper-plane"></i>
                                        <h2 className="text-sm font-semibold">Share</h2>
                                    </button>
                                </div>

                                {/* Save/Bookmark button */}
                                <div className="flex">
                                    <button className="flex gap-2 items-center text-[var(--text)]" onClick={toggleBookmark}>
                                        {saved ? (
                                            <i className="text-[var(--buttons)] fa-solid fa-bookmark"></i>
                                        ) : (
                                            <i className="text-[var(--text)] fa-regular fa-bookmark"></i>
                                        )}
                                        <h2 className={`text-sm font-semibold ${saved ? "text-[var(--buttons)]" : ""}`}>
                                            {saved ? "Saved" : "Save"}
                                        </h2>
                                    </button>
                                </div>
                            </div>

                            {/* Add Comment Input */}
                            <div className="mt-auto flex items-center gap-3 p-2 relative">
                                <Avatar url={authState?.data?.image?.url} id={authState.data?._id} />
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={commentDescription}
                                        className="w-full p-2 px-4 pr-10 rounded-full text-[var(--text)] border border-[var(--input)] bg-transparent font-normal outline-none focus:shadow-md"
                                        placeholder="Write a comment..."
                                        onChange={handleChange}
                                    />
                                    <FaPaperPlane
                                        onClick={postCommentHandler}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text)] cursor-pointer"
                                    />
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
