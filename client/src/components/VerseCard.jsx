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
import { getAllVerse, getVerseById, likeVerse, deleteVerse } from "../redux/Slices/verse.slice";
import DisplayVerse from "./DisplayVerse";

function VerseCard (verse, bottom) {
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const { _id, likes, comments, interests, createdAt, userId, text } = verse?.verse;

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [countLike, setCountLike] = useState(likes.length);

    // Delete related
    const [deleting, setDeleting] = useState(false);

    const [date, setDate] = useState("");
    const [check, setCheck] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState (false);

    const [commentDescription, setDescription] = useState("");
    const [countComment, setCountComment] = useState(comments?.length);
    const [creator, setCreator] = useState({
        image: "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png",
        name: "",
        username: "",
        password: "",
        email: "",
        birth: ""
    });

    const tempText = check ? text : text?.toString().slice(0, 1000);

    async function onDelete () {
        setDeleting(true);
        const resp = {
            verseId: _id,
            userId: {
                id: userId
            }
        }
        const response = await dispatch(deleteVerse (resp));
        console.log (response);
        if (response.payload) {
            await dispatch(getAllVerse());
            toast.success("Deleted successfully");
        } else {
            toast.error("Something went wrong");
        }
        setDeleting(false);
    }

    const toggleBookmark = async () => {
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
        const response = await dispatch (likeVerse ({
            _id,
            id: authState.data?._id
        }));
        if (!response.payload) return;

        if (liked) {
            setCountLike(countLike - 1);
        } else {
            setCountLike(countLike + 1);
        }

        setLiked(!liked);
        await dispatch (getVerseById(_id));
    };

    async function getUser(userId) {
        if (!userId) return;
        const response = await dispatch(getUserById (userId));
        if (!response) {
            toast.error("Something went Wrong!");
        }

        setCreator(response.payload?.data?.userdetails);
    }

    const getComments = async () => {
        await dispatch(getCommentByPostId(_id));
    }

    useEffect(() => {
        getUser(userId);
        setDate(getTimeDifference(createdAt));
        if (likes.includes(authState.data?._id)) {
            setLiked(true);
        } else setLiked(false);
        setCountComment(comments.length);
        setCountLike(likes.length);
    }, [verse?.verse]);

    return (
        <div className={`bg-[${_COLOR.card}] shadow-xl rounded-xl relative mt-4`} >
            <DisplayVerse open={isDialogOpen} setOpen={setDialogOpen} verse={verse?.verse}/>
            <div className="flex justify-between bg-[#B9D9EB] rounded-t-xl p-[0.3rem]">
                <div className="flex items-center gap-3">
                    <div className="flex items-center">
                        <Link to={`/profile/${creator?.username}`}>
                            <span className="cursor-pointer">
                                <Avatar url={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} size={'sm'} />
                            </span>
                        </Link>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div>
                            <Link to={`/profile/${creator?.username}`}>
                                <span className={`mr-1 text-sm font-semibold cursor-pointer hover:underline hover:text-[${_COLOR.buttons}] text-[${_COLOR.text}]`}>
                                    {creator?.username}
                                </span>
                            </Link>
                        </div>
                        <p className={`flex text-[${_COLOR.text}] text-xs font-extralight gap-2`}>
                            <span>•</span>{date}
                        </p>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="m-1">
                        <i className={`text-[${_COLOR.text}] fa-solid fa-ellipsis`}></i>
                    </div>
                    <ul tabIndex={0} className={`dropdown-content menu bg-[${_COLOR.dropdown}] text-[${_COLOR.text}] rounded-md z-[1] w-52 p-4 gap-4 shadow-sm shadow-[${_COLOR.text}]`}>
                        <li className="hover:cursor-pointer"><span>Not Intrested</span></li>
                        {(authState.data?._id === userId) && <li
                            className="hover:cursor-pointer text-red-400 flex flex-row justify-between"
                            onClick={onDelete}>
                            <span>Delete Verse </span>
                            {deleting && (
                                <i className={`fa-solid fa-spinner animate-spin text-lg text-[${_COLOR.text}]`}></i>
                            )}
                        </li>
                        }
                    </ul>
                </div>
            </div>
            <p className={`text-sm mt-4 text-[${_COLOR.text}] px-4`}>
                {tempText} {text?.toString().length > 1000 && (
                    <span onClick={() => setCheck(!check)} className={`text-[${_COLOR.buttons}] font-bold hover:cursor-pointer`}>
                        {check ? ' Show Less' : '... Read More'}
                    </span>)}
            </p>
            {(countLike - liked > 0 || countComment > 0) && <div className="mt-2 flex gap-2 w-full px-4 text-xs">
                {countLike - liked > 0 && <h2>
                    Liked by {countLike - liked} others
                </h2>}
                {countComment > 0 && <h2>
                    {countComment} Comments
                </h2>}
            </div>}
            <div className="mt-2 flex w-full justify-between p-4 border-t">
                <div className="flex gap-4">
                    <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleLike}>
                        {liked ? (<i className={`text-red-600 fa-solid fa-heart`}></i>) : <i className={`text-[${_COLOR.text}] fa-regular fa-heart`}></i>}
                        {liked ? (<h2 className="text-sm text-red-600 font-semibold">Liked</h2>) : (<h2 className="text-sm font-semibold">Like</h2>)}
                    </button>
                    <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={() => {
                        getComments;
                        setDialogOpen(true);
                    }}>
                        <i className={`text-[${_COLOR.text}] fa-regular fa-comment`}></i>
                        <h2 className="text-sm font-semibold">Comment</h2>
                    </button>
                </div>
                <div className="flex">
                    <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleBookmark}>
                        {saved ? <i className={`text-[${_COLOR.buttons}] fa-solid fa-bookmark`}></i> : <i className={`text-[${_COLOR.lightest}] fa-regular fa-bookmark`}></i>}
                        {saved ? (<h2 className={`text-sm text-[${_COLOR.buttons}] font-semibold`}>Saved</h2>) : (<h2 className="text-sm font-semibold">Save</h2>)}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerseCard;