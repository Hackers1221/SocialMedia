// Imports for managing component logic, state, and navigation
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Component imports
import Avatar from "./Avatar";
import SelectedUser from "./SelectedUser";
import LinkDetector from '../components/LinkDetector';
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import Comment from "./Comment";

// Hooks imports
import usePosts from "../hooks/usePosts";

// Reducer imports from slices
import { getUserById } from "../redux/Slices/auth.slice";
import { getPostById, likePost, updateSavedPost } from "../redux/Slices/post.slice";
import { CreateComment, getCommentByPostId } from "../redux/Slices/comment.slice";
import { showToast } from "../redux/Slices/toast.slice";

// React icons
import { FaPaperPlane } from "react-icons/fa";

// Import motion components and animation helpers from Framer Motion for animations
import { motion, AnimatePresence } from "framer-motion";

function PostCard({ post }) {
    // Access the user data from the Redux store
    const authState = useSelector((state) => state.auth.data);

    // Destructure and get post state from the custom usePosts hook
    const [postState] = usePosts();

    // Ref to store references to multiple video elements
    const videoRefs = useRef([]);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // Destructure fields from post
    const { _id, likes, interests, createdAt, userId, caption } = post;
    const imageData = post.image;
    const videoData = post.video;

    // Local state management
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [countLike, setCountLike] = useState(likes.length);
    const [images, setImages] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState([false]);
    const [showButton, setShowButton] = useState([true]);
    const [showComment, setShowComment] = useState(false);
    const [commentDescription, setCommentDescription] = useState("");
    const [comments, setComments] = useState([]);
    const [date, setDate] = useState("");
    const [countComment, setCountComment] = useState(post?.comments?.length);
    const [title, setTitle] = useState();
    const [isShare, setShare] = useState(false);
    const [hashtags, setHashtags] = useState([]);
    const [isDeleteDialog, setIsdeleteDialog] = useState(false);

    // Creator info fallback
    const [creator, setCreator] = useState({
        image: {
            url: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png",
            filename: ""
        },
        name: "",
        username: "",
        password: "",
        email: "",
        birth: ""
    });

    const totalItems = (post.image?.length || 0) + (post.video?.length || 0);

    // Move to the next item in a circular manner
    function goForward() {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }

    // Move to the previous item in a circular manner
    function goBack() {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
    }

    // Toggle play/pause for the selected video, pause all others
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

    // Toggle bookmark status for a post
    const toggleBookmark = async () => {
        const response = await dispatch(updateSavedPost({
            _id1: authState._id,
            id: _id
        }));

        if (!response?.payload) {
            if (!saved) dispatch(showToast({ message: 'Post could not be saved!', type: 'error' }));
            else dispatch(showToast({ message: 'Post could not be removed from saved!', type: 'error' }));
            return;
        }

        if (!saved) dispatch(showToast({ message: 'Saved successfully!', type: 'save', image: images[0].url }));
        setSaved((prev) => !prev);
    };

    // Get relative time from date
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
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}min ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d ago`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths}m ago`;

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears}y ago`;
    }

    // Toggle like and update Redux
    const toggleLike = async () => {
        const response = await dispatch(likePost({
            _id,
            id: authState._id
        }));
        if (!response.payload) return;

        if (liked) {
            setCountLike(countLike - 1);
        } else {
            setCountLike(countLike + 1);
        }

        setLiked(!liked);
        await dispatch(getPostById(_id));
    };

    // Fetch creator info if not in post
    async function getUser(userId) {
        if (!userId) return;
        const response = await dispatch(getUserById(userId));
        if (!response) {
            dispatch(showToast({ message: 'Something went wrong!', type: 'error' }));
        }
        setCreator(response.payload?.data?.userdetails);
    }

    // Extract thumbnail from video file
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
            setImages((prev) => [...prev, element]);
        });

        video.addEventListener("error", (e) => {
            console.error("Error loading video:", e);
        });

        video.load();
    };

    // Extract hashtags from interest string
    function getHashtags() {
        if (!interests[0]) return;

        let temp = interests[0]?.split(" ")
            .map((hashtag) => hashtag.trim())
            .map((hashtag) => (hashtag.length > 0 ? "#" : "") + hashtag);

        setHashtags(temp);
    }

    // Post a comment
    const postCommentHandler = async () => {
        const data = {
            description: commentDescription,
            userId: authState._id,
            postId: _id,
            type: "post"
        };
        const response = await dispatch(CreateComment(data));
        if (response.payload) {
            setCommentDescription("");
            getComments();
            setCountComment(prev => prev + 1);
        }
    };

    // Get comments for the post
    async function getComments() {
        const res = await dispatch(getCommentByPostId(_id));
        setComments(res.payload.data.commentDetails);
    }

    // Copy link to clipboard
    const handleCopy = async () => {
        try {
            const postLink = `${window.location.origin}/post/${post._id}`;
            await navigator.clipboard.writeText(postLink);
            dispatch(showToast({ message: "Link copied to clipboard!", type: "success" }));
        } catch (error) {
            dispatch(showToast({ message: "Failed to copy link", type: "error" }));
        }
    };

    // Event: screen width
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Setup media content and hashtags
    useEffect(() => {
        setTitle(caption);
        setImages([]);
        if (imageData) setImages(imageData);
        if (videoData?.length) {
            videoData.forEach((vid) => {
                if (vid?.url) extractThumbnail(vid?.url);
            });
        }
        getHashtags();
    }, [_id]);

    // Update saved status
    useEffect(() => {
        setSaved(postState?.savedList?.find((post) => post._id === _id));
    }, [postState?.savedList]);

    // Update creator and post info
    useEffect(() => {
        if (userId?._id) setCreator(userId);
        else getUser(userId);

        setDate(getTimeDifference(createdAt));
        if (likes.includes(authState._id)) {
            setLiked(true);
        } else {
            setLiked(false);
        }

        setCountComment(post?.comments.length);
        setCountLike(likes.length);
    }, [post]);

        return (
        <div className={`mb-4 bg-[var(--card)] relative shadow-xl rounded-md`}>
            {/* Share modal */}
            <SelectedUser isOpen={isShare} setOpen={setShare} target={"post"} post={post} />

            {/* Delete confirmation dialog */}
            <ConfirmDeleteDialog
                open={isDeleteDialog}
                setOpen={setIsdeleteDialog}
                type={"postDelete"}
                data={{
                    postId: _id,
                    userId: {
                        id: userId
                    }
                }}
            />

            {/* Top user info section */}
            <div className="flex justify-between bg-[var(--topic)] rounded-t-xl p-[0.5rem] px-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <Link to={`/profile/${creator?.username}`}>
                            <span className="cursor-pointer">
                                <Avatar
                                    id={creator?._id}
                                    url={creator?.image?.url}
                                    size={'md'}
                                />
                            </span>
                        </Link>
                    </div>
                    <Link to={`/profile/${creator?.username}`} className="flex gap-4 items-end">
                        <div className="flex flex-col gap-0">
                            <div className="text-sm font-semibold text-[var(--heading)]">
                                {creator?.name}
                            </div>
                            <div className="flex gap-1 text-xs font-extralight text-[var(--heading)]">
                                @{creator?.username}
                                <p className="flex text-[var(--heading)] text-xs font-extralight gap-1 italic">
                                    <span>•</span> {date}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Dropdown for copy/delete */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="m-1">
                        <i className="text-[var(--text)] fa-solid fa-ellipsis"></i>
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-[var(--background)] rounded-md z-[1] w-52 p-4 gap-4 text-[var(--buttons)]"
                    >
                        <li onClick={handleCopy} className="hover:cursor-pointer">
                            <span>Copy Link</span>
                        </li>
                        {authState._id === userId && (
                            <li
                                className="hover:cursor-pointer text-red-400"
                                onClick={() => setIsdeleteDialog(true)}
                            >
                                <span>Delete</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Caption and Hashtags */}
            <div className="mt-4 px-4">
                {title?.length > 0 && <LinkDetector title={title} type={'post'} />}
            </div>
            <div className="px-4">
                <div className="w-full flex flex-wrap gap-1 mt-4">
                    {hashtags.length > 0 &&
                        hashtags.map((hashtag, index) => (
                            <p
                                key={index}
                                className="text-[var(--buttons)] text-xs rounded-full bg-[var(--background)] py-1 px-2"
                            >
                                {hashtag}
                            </p>
                        ))}
                </div>
            </div>

            {/* Media Content */}
            {/* This part renders either the grid layout or carousel based on screen width */}
            {width > 530 ? <Link to={`/post/${post._id}`} state={{ backgroundLocation: location }} className="flex justify-start gap-3 h-[25rem] my-4 px-4">
                {images?.length > 0 && <div className={`relative ${images.length > 3 ? `w-[35%]` : images?.length > 2 ? `w-[33%]` : images?.length > 1 ? `w-[50%]` : `w-full`} h-full flex justify-center hover:cursor-pointer bg-black`}>
                    <img
                        src={images[0]?.url}
                        alt="Main Image"
                        className="object-cover h-full"
                    />
                    {images[0].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                    {images[0].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                </div>}
                {images?.length > 1 && <div className={`relative ${images?.length > 3 ? `w-[35%]` : images?.length > 2 ? `w-[33%]` : `w-[50%]`} h-full flex items-center flex justify-center hover:cursor-pointer bg-black`}>
                    <img
                        src={images[1]?.url}
                        alt="Image 2"
                        className="object-cover h-full"
                    />
                    {images[1].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                    {images[1].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                </div>}

                {images?.length > 2 && <div className={`flex flex-col gap-2 ${images?.length > 3 ? `w-[25%]` : `w-[33%]`}`}>
                    <div className={` relative ${images?.length == 3 ? `h-full` : `h-[49%]`} flex justify-center hover:cursor-pointer`}>
                        <img
                            src={images[2]?.url}
                            alt="Image 3"
                            className="object-cover h-full"
                        />
                        {images[2].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                        {images[2].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                    </div>
                    {images?.length > 3 && <div className="relative h-[49%] hover:cursor-pointer">
                        <div className="relative h-full w-full flex justify-center">
                            <img
                                src={images[3]?.url}
                                alt="Image 4"
                                className="object-cover h-full"
                            />
                            {images[3].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                            {images[3].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                        </div>
                        {images?.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    +{images?.length - 4}
                                </span>
                            </div>
                        )}
                    </div>}
                </div>}
            </Link> :
            <Link to={`/post/${post._id}`} state={{ backgroundLocation: location }} className="relative flex justify-center items-center w-full h-[20rem] py-4 bg-black my-2">
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
                {currentIndex > 0 && (
                    <div className="absolute left-2 top-[50%] bottom-[50%]">
                        <i className="fa-solid fa-circle-chevron-left text-[var(--dropdown)] text-[1.5rem]" onClick={goBack}></i>
                    </div>
                )}
                {currentIndex < totalItems - 1 && (
                    <div className="absolute right-2 top-[50%] bottom-[50%]">
                        <i className="fa-solid fa-circle-chevron-right text-[var(--dropdown)] text-[1.5rem]" onClick={goForward}></i>
                    </div>
                )}
                {totalItems > 1 && <div className="absolute top-2 right-2 bg-black/70 text-white rounded-md text-xs w-max p-1">{currentIndex + 1} / {totalItems}</div>}
            </Link>}
            
            {/* Like/Comment Count Section */}
            {(countLike - liked > 0 || countComment > 0) && (
                <div className="mt-2 flex gap-2 w-full px-4 text-xs text-[var(--text)]">
                    {countLike - liked > 0 && (
                        <h2>
                            Liked by {countLike - liked} other{countLike - liked > 1 ? 's' : ''}
                        </h2>
                    )}
                    {countLike - liked > 0 && countComment > 0 && <h2>•</h2>}
                    {countComment > 0 && (
                        <h2>
                            {countComment} Comment{countComment > 1 ? 's' : ''}
                        </h2>
                    )}
                </div>
            )}

            {/* Action Buttons (Like, Comment, Share, Save) */}
            <div className="mt-2 flex w-full justify-between p-4 border-t border-[var(--border)] text-[var(--text)]">
                <div className="flex gap-4">
                    {/* Like */}
                    <button className="flex gap-2 items-center" onClick={toggleLike}>
                        {liked ? (
                            <i className="text-red-600 fa-solid fa-heart"></i>
                        ) : (
                            <i className="text-[var(--text)] fa-regular fa-heart"></i>
                        )}
                        {width > 440 && (
                            <h2 className={`text-sm font-semibold ${liked ? 'text-red-600' : ''}`}>
                                {liked ? 'Liked' : 'Like'}
                            </h2>
                        )}
                    </button>

                    {/* Comment */}
                    <button
                        className="flex gap-2 items-center"
                        onClick={() => {
                            getComments();
                            if (width >= 530) navigate(`/post/${post._id}`, { state: { backgroundLocation: location.pathname } });
                            else setShowComment(true);
                        }}
                    >
                        <i className="text-[var(--text)] fa-regular fa-comment"></i>
                        {width > 440 && <h2 className="text-sm font-semibold">Comment</h2>}
                    </button>

                    {/* Share */}
                    <button className="flex gap-2 items-center" onClick={() => setShare(!isShare)}>
                        <i className="text-[var(--text)] fa-regular fa-paper-plane"></i>
                        {width > 440 && <h2 className="text-sm font-semibold">Share</h2>}
                    </button>
                </div>

                {/* Save */}
                <div className="flex">
                    <button className="flex gap-2 items-center" onClick={toggleBookmark}>
                        {saved ? (
                            <i className="text-[var(--buttons)] fa-solid fa-bookmark"></i>
                        ) : (
                            <i className="fa-regular fa-bookmark"></i>
                        )}
                        {width > 440 && (
                            <h2 className={`text-sm font-semibold ${saved ? 'text-[var(--buttons)]' : ''}`}>
                                {saved ? 'Saved' : 'Save'}
                            </h2>
                        )}
                    </button>
                </div>
            </div>

            {/* Animated Comment Section */}
            <AnimatePresence>
                {showComment && (
                    <motion.div
                        className="w-full h-full flex flex-col p-4 text-white absolute top-0 left-0 bg-[var(--card)]"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {/* Header */}
                        <div className="w-full flex justify-start items-center gap-4">
                            <i
                                className="fa-solid fa-arrow-left hover:cursor-pointer"
                                onClick={() => setShowComment(false)}
                            ></i>
                            <h2>Comments</h2>
                        </div>

                        {/* Comment List */}
                        <div className="flex-1 flex flex-col w-full mt-4 overflow-y-auto scroll-smooth overscroll-contain max-h-[65vh]">
                            {comments.length > 0 ? (
                                comments.map((comment, idx) => (
                                    <div key={idx}>
                                        <Comment
                                            commentId={comment._id}
                                            avatar={comment.user?.image?.url}
                                            username={comment.user?.username}
                                            text={comment.description}
                                            time={comment.createdAt}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-gray-500">No comments yet</div>
                            )}
                        </div>

                        {/* Add Comment Input */}
                        <div className="mt-auto flex items-center gap-2 relative">
                            <Avatar id={authState?._id} url={authState?.image?.url} size={'md'} />
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={commentDescription}
                                    className="w-full p-2 px-4 pr-10 rounded-full text-[var(--text)] border border-[var(--input)] bg-transparent font-normal outline-none focus:shadow-md"
                                    placeholder="Write a comment..."
                                    onChange={(e) => setCommentDescription(e.target.value)}
                                />
                                <FaPaperPlane
                                    onClick={postCommentHandler}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text)] cursor-pointer"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default PostCard;