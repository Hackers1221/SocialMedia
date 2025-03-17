import React, { useEffect, useState, useRef, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";
import { FaPaperPlane } from "react-icons/fa";
import Comment from "./Comment";
import Loader from "./Loader";
import { CreateComment, getCommentByPostId } from "../redux/Slices/comment.slice";
import { getAllVerse, getVerseById, likeVerse, updateVerse } from "../redux/Slices/verse.slice";


const DisplayVerse = ({ open, setOpen, verse }) => {

  if (!verse || !open) return null;

  const authState = useSelector((state) => state.auth);
  const commentState = useSelector((state) => state.comment);
  const verseState = useSelector ((state) => state.verse);

  const dispatch = useDispatch();
  const dialogRef = useRef(null);

  const defaultImage = "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png";

  const [date, setDate] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState({ image: "", name: "Anonymous" });
  const [commentDescription , setDescription] = useState("");
  const [countLike,setcountLike] = useState(verse?.likes?.length);
  const [countComment,setCountComment] = useState(verse?.comments?.length);
  const [text, setText] = useState (verse?.text || "");
  const [interest, setInterest] = useState ("");

  async function postCommentHandler() {
    const data = {
          description : commentDescription ,
          userId : authState.data?._id,
          postId : verse?._id,
          type : "verse"
      };
      const response = await dispatch(CreateComment(data));

      if(response.payload){
        setDescription("");
        await dispatch (getAllVerse ());
        await dispatch(getCommentByPostId(verse?._id));
      }
  }

  function handleChange (e) {
    const {name, value} = e.target;
    setDescription(value);
  } 

  const toggleLike = async () => {
    const response = await dispatch(likeVerse ({
      _id: verse?._id, 
      id: authState.data?._id 
    }));

    if(!response.payload) return;
  
    if (liked) {
      setcountLike(countLike - 1);
    } else {
      setcountLike(countLike + 1);
    }
    setLiked(!liked);
    dispatch (getVerseById (verse?._id));
  }; 

    const toggleBookmark = async() => {
    //   const response = await dispatch(updateSavedPost({
    //     _id1  : authState.data?._id,
    //     id : post?._id
    //   }))

    //   if (!response?.payload) return;
    //   setSaved ((prev) => !prev);
    //   await dispatch (getSavedPost(authState.data?._id));
    }

    function getTimeDifference(dateString) {
        console.log (dateString);
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

  function updateText () {
    let hashtags = verse?.interests ? verse?.interests[0]?.split(" ") : [];
    hashtags = hashtags?.map((hashtag) => hashtag.trim());
    hashtags = hashtags?.map((hashtag) => (hashtag.length > 0 ? "#" : "") + hashtag);
    hashtags = hashtags?.join(" ");
    setInterest (hashtags);
    setText ((prev) => prev + " " + hashtags);
  }

  // fetching data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
  
      try {  
        if (verse?.userId) {
          const userResponse = await dispatch(getUserById(verse.userId));
          setCreator(userResponse.payload?.data?.userdetails || {});
  
          await dispatch(getCommentByPostId(verse._id)); // Fetch comments only after user data is received
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (verse) {
      fetchData();
    }  
    
  }, []);

  useEffect (() => {
    updateText ();
    if(verse?.likes?.includes(authState?.data?._id)){
      setLiked(true);
    }
    else setLiked(false);
    setDate (getTimeDifference (verse?.createdAt));
    setCountComment(verse?.comments?.length);
    setcountLike(verse?.likes?.length);
  }, [verse]);

  // open close dialog
  useEffect(() => {  
    if (open && !loading) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open, loading]);  

//   useEffect(() => {  
//     setSaved (verseState.savedList?.find ((savedPost) => savedPost._id === post?._id));
//     }, [verseState.savedList]); 



  return loading ? <Loader /> : (
    <dialog ref={dialogRef} className={`w-[60%] h-[90vh] bg-[${_COLOR.card}] rounded-lg shadow-xl p-4`}>
      <button onClick={() => setOpen (false)} className={`absolute top-5 right-6 text-[${_COLOR.text}] font-bold text-xl focus:outline-none`}>✕</button>
      <div className="flex h-full">
        {/* Left Half */}
        <div className="w-1/2 p-4 flex flex-col h-full">
        <div className={`absolute top-0 left-0 flex items-center gap-3 mb-4 z-[100] bg-[${_COLOR.card}] px-4 py-2`}>
            <Avatar url={creator?.image?.url || defaultImage} size={"md"}/>
            <div>
            <p className={`text-[${_COLOR.text}] font-semibold text-sm`}>{creator?.username}</p>
            <p className={`text-[${_COLOR.text}] text-xs`}>{date}</p>
            </div>
          </div>
          <div className="h-[85vh] overflow-y-auto">
            {(verse?.text?.length > 0 || interest?.length > 0) && (
                <div className={`text-[${_COLOR.text}] text-sm pb-4 mt-4`}>
                {verse?.text}
                {interest?.length > 0 && (
                    <h2 className={`text-[${_COLOR.text}] font-extralight mt-8 text-xs`}>
                    {interest}
                    </h2>
                )}
                </div>
            )}
        </div>
        </div>

        {/* Right Half */}
        <div className="w-1/2 flex flex-col p-4 rounded-lg border">
          <div className="flex-1 overflow-y-auto space-y-3 pt-2">
            {commentState.comments.map((comment, idx) => (
              <div key={idx}>
                <Comment avatar={comment.user.image?.url} username={comment.user.username} text={comment.description} time={"10 h"} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex w-full justify-between p-2 border-t">
            <div className="flex gap-4">
              <button className={`flex gap-2 items-center text-[${_COLOR.text}]`} onClick={toggleLike}>
                {liked ? (<i className="text-red-600 fa-solid fa-heart"></i>) : <i className={`text-[${_COLOR.text}] fa-regular fa-heart`}></i>}
                {countLike}
              </button>
              <button className={`flex gap-2 items-center text-[${_COLOR.text}]`}>
              {/* <i className="text-white fa-solid fa-comment"></i> */}
                <i className={`text-[${_COLOR.text}] fa-regular fa-comment`}></i>
                {countComment}
              </button>
            </div>
            <div className="flex">
            <button className={`flex gap-2 items-center text-[${_COLOR.text}]`} onClick={toggleBookmark}>
                {saved? <i className="text-white fa-solid fa-bookmark"></i> : <i className="text-white fa-regular fa-bookmark"></i>}
              </button>
            </div>
          </div>
          <div className="mt-auto flex items-center gap-3 p-2 relative">
            <Avatar url={authState?.data?.image?.url || defaultImage} />
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentDescription}
                className={`w-full p-2 px-4 pr-10 rounded-full text-[${_COLOR.text}] border-2 bg-transparent font-normal outline-none focus:shadow-md`}
                placeholder="Write a comment..."
                onChange={handleChange}
              />
              <FaPaperPlane onClick={postCommentHandler} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[${_COLOR.text}] cursor-pointer`} />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DisplayVerse;