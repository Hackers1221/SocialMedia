import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePulse, updateSavedPulse } from "../redux/Slices/pulse.slice";
import Avatar from '../components/Avatar'
import { FaPaperPlane } from "react-icons/fa";
import { CreateComment, getCommentByPostId } from "../redux/Slices/comment.slice";
import Comment from "./Comment";
import { motion, AnimatePresence } from "framer-motion";
import SelectedUser from "./SelectedUser";
import usePulse from "../hooks/usePulse";
import { showToast } from "../redux/Slices/toast.slice";

export default function PulseCard({ pulse, followers }) {
    const authState = useSelector((state) => state.auth);
    const [pulseState] = usePulse();

    const dispatch = useDispatch();

    const [isPlaying, setIsPlaying] = useState(true);
    const [liked, setLiked] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [countLike, setCountLike] = useState(pulse?.likes?.length);
    const [showComment, setShowComment] = useState(false);
    const [commentDescription, setCommentDescription] = useState("");
    const [comments, setComments] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const [saved, setSaved] = useState();

    const videoRef = useRef(null);
    const timeoutRef = useRef(null);

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

    const handleLike = async (event) => {
        event.stopPropagation();
        const response = await dispatch(likePulse({
            _id: pulse._id,
            id: authState.data?._id
        }));
        if (!response.payload) return;

        setCountLike(liked ? countLike - 1 : countLike + 1);
        setLiked(!liked);
    };

    const pulseCommentHandler = async () => {
        const data = {
            description: commentDescription,
            userId: authState.data?._id,
            postId: pulse?._id,
            type: "pulse"
        };
        const response = await dispatch(CreateComment(data));
        if (response.payload) {
            setCommentDescription("");
            getComments();
        }
    };

    async function getComments() {
        const res = await dispatch(getCommentByPostId(pulse?._id));
        setComments(res.payload.data.commentDetails);
    }

    const toggleBookmark = async () => {
        const response = await dispatch(updateSavedPulse({
            _id1: authState.data._id,
            id: pulse._id
        }));

        if (!response?.payload) {
            dispatch (showToast ({ message: 'Something went wrong!', type: 'error' }));
            return;
        }

        setSaved((prev) => !prev);
    };

    useEffect(() => {
        setSaved(pulseState?.savedList?.find((item) => pulse._id === item._id));
    }, [pulseState?.savedList]);

    useEffect(() => {
        getComments();
    }, [pulse._id]);

    useEffect(() => {
        if (pulse?.likes.includes(authState.data?._id)) {
            setLiked(true);
        } else {
            setLiked(false);
        }

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

        if (videoRef.current) observer.observe(videoRef.current);

        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className="reel-container w-full h-[95%] sm:w-96 md:h-[78vh] sm:h-[70vh] overflow-hidden rounded-xl shadow-lg flex-col justify-center relative bg-black">
            <SelectedUser isOpen={isOpen} setOpen={setOpen} followers={followers} post={pulse} />

            {!showComment && (
                <div onClick={togglePlay}>
                    <video ref={videoRef} className="w-max bg-black" src={pulse.video} loop></video>

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

                    <div className="absolute right-4 bottom-[1.5rem] flex flex-col gap-2">
                        <button className="flex flex-col items-center justify-center gap-1 text-white px-2" onClick={handleLike}>
                            {liked ? (
                                <i className="text-red-600 fa-solid fa-heart text-2xl"></i>
                            ) : (
                                <i className="text-white fa-regular fa-heart text-2xl"></i>
                            )}
                            <span className="text-base font-medium">{countLike}</span>
                        </button>

                        <button className="flex flex-col items-center justify-center gap-1 text-white px-2">
                            <i className="fa-regular fa-comment text-white text-2xl" onClick={() => setShowComment(true)}></i>
                            <span className="text-base font-medium">{comments?.filter(comment => comment.postId === pulse._id)?.length}</span>
                        </button>

                        <div className="flex flex-col items-center justify-center gap-1 text-white px-2 hover:cursor-pointer" onClick={toggleBookmark}>
                            {saved ? <i className="fa-solid fa-bookmark text-xl p-3"></i> : <i className="fa-regular fa-bookmark text-xl p-3"></i>}
                        </div>

                        <div className="flex flex-col items-center justify-center text-white px-2">
                            <i className="fa-regular fa-paper-plane text-white text-xl p-3 hover:cursor-pointer" onClick={() => setOpen(true)}></i>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 w-[80%] flex flex-col gap-2">
                        <div className="flex items-end gap-2">
                            <Avatar url={pulse.user?.image?.url} size={'sm'} />
                            <span className="text-white font-semibold text-sm">{pulse.user?.username}</span>
                        </div>
                        <h2 className="text-white text-xs">
                            {pulse?.caption?.length > 75 ? `${pulse.caption.slice(0, 75)}...` : pulse?.caption}
                        </h2>
                    </div>
                </div>
            )}

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
                            <Avatar url={authState?.data?.image?.url} />
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={commentDescription}
                                    className="w-full p-2 px-4 pr-10 rounded-full text-[var(--text)] border border-[var(--input)] bg-transparent font-normal outline-none focus:shadow-md"
                                    placeholder="Write a comment..."
                                    onChange={(e) => setCommentDescription(e.target.value)}
                                />
                                <FaPaperPlane
                                    onClick={pulseCommentHandler}
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
