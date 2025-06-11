import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";
import { useEffect, useRef, useState } from "react";
import { DeletePost, getAllPosts, getPostById, likePost, updateSavedPost } from "../redux/Slices/post.slice";
import DisplayPost from "./DisplayPost";
import { CreateComment, getCommentByPostId } from "../redux/Slices/comment.slice";
import usePosts from "../hooks/usePosts";
import LinkDetector from '../components/LinkDetector'
import SelectedUser from "./SelectedUser";
import { FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Comment from "./Comment";

function PostCard ({ post, index, list, followers }) {
    const authState = useSelector((state) => state.auth.data);
    const [postState] = usePosts();

    const videoRefs = useRef ([]);

    const dispatch = useDispatch();

    const { _id, likes, interests, createdAt, userId, caption } = post;
    const imageData = post.image;
    const videoData = post.video;

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

    // Delete related
    const [deleting, setDeleting] = useState(false);

    const [date, setDate] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [countComment, setCountComment] = useState(post?.comments?.length);
    const [title, setTitle] = useState ();
    const [isShare, setShare] = useState (false);
    const [creator, setCreator] = useState({
        image: "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png",
        name: "",
        username: "",
        password: "",
        email: "",
        birth: ""
    });
    const [hashtags, setHashtags] = useState ([]);

    const totalItems = (post.image?.length || 0) + (post.video?.length || 0);

    function sharePost () {
        setShare (true)

        // if (navigator.share) {
        //     navigator.share({
        //     title: post.title,
        //     text: post.description,
        //     url: `${window.location.origin}/post/${post._id}`,
        //     })
        //     .then(() => console.log('Post shared successfully'))
        //     .catch((err) => console.error('Error sharing', err));
        // } else {
        //     // fallback for unsupported browsers
        //     navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
        //     alert("Link copied to clipboard!");
        // }

    }

    function goForward () {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    };

    function goBack () {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
    };

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

    const toggleBookmark = async () => {
        const response = await dispatch(updateSavedPost({
            _id1: authState._id,
            id: _id
        }));

        if (!response?.payload) {
            toast.error('Post not added to saved posts');
            return;
        }

        toast.success('Post added to saved posts');
        setSaved((prev) => !prev);
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
            return `${diffInSeconds}s`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes}min`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours}h`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays}d`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths}m`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears}y`;
    }

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

    async function getUser(userId) {
        if (!userId) return;
        const response = await dispatch(getUserById(userId));
        if (!response) {
            toast.error("Something went Wrong!");
        }

        setCreator(response.payload?.data?.userdetails);
    }

    const Deletepost = async () => {
        setDeleting(true);
        const resp = {
            postId: _id,
            userId: {
                id: userId
            }
        }
        const response = await dispatch(DeletePost(resp));
        if (response.payload) {
            await dispatch(getAllPosts());
            toast.success("Deleted successfully");
        } else {
            toast.error("Something went wrong");
        }
        setDeleting(false);
    }

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

    function getHashtags () {
        if (!interests[0]) return;
        
        let temp = interests[0]?.split (" ");
        
        temp = temp?.map((hashtag) => hashtag.trim());
        temp = temp?.map((hashtag) => (hashtag.length > 0 ? "#" : "") + hashtag);
        setHashtags (temp);
    }

    const postCommentHandler = async () => {
        const data = {
            description: commentDescription,
            userId: authState._id,
            postId: _id,
            type: "post"
        };
        const response = await dispatch (CreateComment (data));
        if (response.payload) {
            setCommentDescription ("");
            getComments ();
            setCountComment (prev => prev + 1);
        }
    };

    async function getComments() {
        const res = await dispatch(getCommentByPostId (_id));
        setComments (res.payload.data.commentDetails);
    }

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setTitle (caption);

        setImages([]);

        if (imageData) setImages(imageData);

        if (videoData?.length) {
            videoData?.forEach((vid) => {
                if (vid?.url) {
                    extractThumbnail(vid?.url);
                }
            });
        }

        getHashtags ();
    }, [_id]);

    useEffect(() => {
        setSaved(postState?.savedList?.find((post) => post._id === _id));
    }, [postState?.savedList]);

    useEffect(() => {
        getUser(userId);
        setDate(getTimeDifference(createdAt));
        if (likes.includes(authState._id)) {
            setLiked(true);
        } else setLiked(false);
        setCountComment(post?.comments.length);
        setCountLike(likes.length);
    }, [post]);


    return (
        <div className={`mb-4 bg-[var(--card)] relative shadow-xl rounded-xl`} >
            <DisplayPost open={isDialogOpen} setOpen={setDialogOpen} index={index} list={list} />
            <SelectedUser isOpen={isShare} setOpen={setShare} followers={followers} post={post}/>

            <div className="flex justify-between bg-[var(--topic)] rounded-t-xl p-[0.3rem] px-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <Link to={`/profile/${creator?.username}`}>
                            <span className="cursor-pointer">
                                <Avatar url={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} size={'sm'} />
                            </span>
                        </Link>
                    </div>
                    <div className="flex gap-1 items-center">
                        <div>
                            <Link to={`/profile/${creator?.username}`}>
                                <span className={`mr-1 text-sm font-semibold cursor-pointer hover:underline hover:text-[var(--buttons)] text-[var(--heading)]`}>
                                    {creator?.username}
                                </span>
                            </Link>
                        </div>
                        <p className={`flex text-[var(--heading)] text-xs font-extralight gap-1`}>
                            <span>•</span>{date}
                        </p>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="m-1">
                        <i className={`text-[var(--text)] fa-solid fa-ellipsis`}></i>
                    </div>
                    <ul tabIndex={0} className={`dropdown-content menu bg-[var(--card)] rounded-md z-[1] w-52 p-4 gap-4 shadow-sm shadow-[var(--text)] text-[var(--buttons)]`}>
                        <li className="hover:cursor-pointer"><span>Not Intrested</span></li>
                        {(authState._id === userId) && <li
                            className="hover:cursor-pointer text-red-400 flex flex-row justify-between"
                            onClick={Deletepost}>
                            <span>Delete</span>
                            {deleting && (
                                <i className={`fa-solid fa-spinner animate-spin text-lg text-[var(--text)]`}></i>
                            )}
                        </li>
                        }
                    </ul>
                </div>
            </div>
            {title?.length > 0 && <LinkDetector title={title} type={'post'}></LinkDetector>}
            <div className="flex gap-2 m-4">
                {hashtags.length > 0 && hashtags.map ((hashtag) => (
                    <p className="text-[var(--buttons)] text-xs rounded-full bg-[var(--background)] py-1 px-2">{hashtag}</p>
                ))}
            </div>

            {width > 530 ? <div className="flex justify-start gap-3 h-[25rem] my-4 px-4">
                {images?.length > 0 && <div className={`relative ${images.length > 3 ? `w-[35%]` : images?.length > 2 ? `w-[33%]` : images?.length > 1 ? `w-[50%]` : `w-full`} rounded-lg h-full flex justify-center hover:cursor-pointer bg-black`} onClick={() => setDialogOpen(true)}>
                    <img
                        src={images[0]?.url}
                        alt="Main Image"
                        className="object-cover h-full rounded-2xl"
                    />
                    {images[0].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                    {images[0].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                </div>}
                {images?.length > 1 && <div className={`relative ${images?.length > 3 ? `w-[35%]` : images?.length > 2 ? `w-[33%]` : `w-[50%]`} rounded-lg h-full flex items-center flex justify-center hover:cursor-pointer bg-black`} onClick={() => setDialogOpen(true)}>
                    <img
                        src={images[1]?.url}
                        alt="Image 2"
                        className="object-cover h-full rounded-2xl"
                    />
                    {images[1].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                    {images[1].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                </div>}

                {images?.length > 2 && <div className={`flex flex-col gap-2 ${images?.length > 3 ? `w-[25%]` : `w-[33%]`}`}>
                    <div className={` relative ${images?.length == 3 ? `h-full` : `h-[49%]`} rounded-lg flex justify-center hover:cursor-pointer`} onClick={() => setDialogOpen(true)}>
                        <img
                            src={images[2]?.url}
                            alt="Image 3"
                            className="object-cover h-full rounded-2xl"
                        />
                        {images[2].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                        {images[2].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                    </div>
                    {images?.length > 3 && <div className="relative h-[49%] hover:cursor-pointer" onClick={() => setDialogOpen(true)}>
                        <div className="relative h-full w-full flex justify-center">
                            <img
                                src={images[3]?.url}
                                alt="Image 4"
                                className="object-cover h-full rounded-2xl"
                            />
                            {images[3].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                            {images[3].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-[var(--heading)] text-2xl"></i>}
                        </div>
                        {images?.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl">
                                <span className="text-white text-xl font-bold">
                                    +{images?.length - 4}
                                </span>
                            </div>
                        )}
                    </div>}
                </div>}
            </div> :
            <div className="relative flex justify-center items-center w-full h-[20rem] py-4 bg-black my-2">
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
          </div>}
            
            {(countLike - liked > 0 || countComment > 0) && <div className="mt-2 flex gap-2 w-full px-4 text-xs text-[var(--text)]">
                {countLike - liked > 0 && <h2>
                    Liked by {countLike - liked} other{countLike - liked > 1 ? 's' : ''}
                </h2>}
                {countLike - liked > 0 && countComment > 0 && <h2>•</h2>}
                {countComment > 0 && <h2>
                    {countComment} Comment{countComment > 1 ? 's' : ''}
                </h2>}
            </div>}
            <div className="mt-2 flex w-full justify-between p-4 border-t border-[var(--border)] text-[var(--text)]">
                <div className="flex gap-4">
                    <button className={`flex gap-2 items-center`} onClick={toggleLike}>
                        {liked ? (<i className={`text-red-600 fa-solid fa-heart`}></i>) : <i className={`text-[var(--text)] fa-regular fa-heart`}></i>}
                        {liked ? (<h2 className="text-sm text-red-600 font-semibold">Liked</h2>) : (<h2 className="text-sm font-semibold">Like</h2>)}
                    </button>
                    <button className={`flex gap-2 items-center`} onClick={() => {
                        getComments ();
                        if (width >= 530) setDialogOpen(true);
                        else setShowComment(true);
                    }}>
                        <i className={`text-[var(--text)] fa-regular fa-comment`}></i>
                        <h2 className="text-sm font-semibold">Comment</h2>
                    </button>
                    <button className={`flex gap-2 items-center`} onClick={sharePost}>
                        <i className={`text-[var(--text)] fa-regular fa-paper-plane`}></i>
                        <h2 className="text-sm font-semibold">Share</h2>
                    </button>
                </div>
                <div className="flex">
                    <button className={`flex gap-2 items-center`} onClick={toggleBookmark}>
                        {saved ? <i className={`text-[var(--buttons)] fa-solid fa-bookmark`}></i> : <i className={`fa-regular fa-bookmark`}></i>}
                        {saved ? (<h2 className={`text-sm text-[var(--buttons)] font-semibold`}>Saved</h2>) : (<h2 className="text-sm font-semibold">Save</h2>)}
                    </button>
                </div>
            </div>

            {/* Comment View */}
            <AnimatePresence>
                {showComment && (
                    <motion.div
                        className="w-full h-full flex flex-col p-4 text-white absolute top-0 left-0 bg-[var(--card)]"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className="w-full flex justify-start items-center gap-4">
                            <i className="fa-solid fa-arrow-left hover:cursor-pointer" onClick={() => setShowComment(false)}></i>
                            <h2>Comments</h2>
                        </div>

                        <div className="flex-1 flex flex-col w-full mt-4 overflow-y-auto scroll-smooth overscroll-contain max-h-[65vh]">
                            {comments.length > 0 ? (
                                comments.map((comment, idx) => (
                                    <div key={idx}>
                                        <Comment commentId={comment._id} avatar={comment.user?.image?.url} username={comment.user?.username} text={comment.description} time={comment.createdAt} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-gray-500">No comments yet</div>
                            )}
                        </div>

                        <div className="mt-auto flex items-center gap-2 relative">
                            <Avatar url={authState?.image?.url} size={'md'}/>
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