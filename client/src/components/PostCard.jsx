import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";
import { useEffect, useRef, useState } from "react";
import { DeletePost, getAllPosts, likePost, updatePost, updateSavedPost } from "../redux/Slices/post.slice";
import DisplayPost from "./DisplayPost";
import { CreateComment, getCommentByPostId } from "../redux/Slices/comment.slice";

function PostCard(post) {

    const authState = useSelector((state) => state.auth.data);
    const currUser = useSelector((state) => state.auth);
    const postState = useSelector ((state) => state.post);
    const videoRefs = useRef([]);
    const timeoutRef = useRef({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {_id, image, video, likes, comments, interests, createdAt, userId, caption} = post?.post;

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [countLike,setcountLike] = useState(likes.length);

    const photo = currUser.data?.image || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"
    const hashtags = interests[0].split(" ");
    

    const [date, setDate] = useState (0);
    const [check, setCheck] = useState (false);
    const [isDialogOpen, setDialogOpen] = useState (false);
    const [commentDescription , setDescription] = useState("");
    const [countComment,setCountComment] = useState(comments?.length);
    const [creator, setCreator] = useState ({
      image: "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png",
      name: "",
      username: "",
      password: "",
      email: "",
      birth: ""
    });
    const [isPlaying, setIsPlaying] = useState([false]);
    const [showButton, setShowButton] = useState([true]);

    const tempCaption = check ? caption : caption?.toString().slice(0, 100);
    
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

    function getDate() {
      let date = createdAt?.toString()?.split('T')[0].split('-').reverse().join("/");
      setDate(date);
    }
    const toggleBookmark = async() => {
      const response = await dispatch(updateSavedPost({
        _id1  : authState._id,
        id : _id
      }))

      if (!response?.payload) return;
      setSaved ((prev) => !prev);
    }

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

    async function getUser(userId) {
        const response = await dispatch(getUserById (userId));
        if(!response){
            toast.error("Something went Wrong!");
        }
        
        setCreator(response.payload?.data?.userdetails);
    }   


    function handleChange (e) {
      const {name, value} = e.target;
      setDescription(value);
    }


    const postComment = async() => {
      const data = {
          description : commentDescription ,
          userId : authState._id,
          postId : _id
      };
      const response = await dispatch(CreateComment(data));
      if(response.payload){
        setCountComment(countComment + 1);
        setDescription("");
      }
    }
 
     
    const getComments = async() => {
      const response = await dispatch(getCommentByPostId(_id));
    }

    const Deletepost = async() => {
      const resp = {
          postId: _id,
          userId: {
            id: userId
          }
        }
      const response = await dispatch(DeletePost(resp));
      if(response.payload){
        await dispatch(getAllPosts());
        toast.success("Deleted successfully");
      }
    }

    useEffect (() => {
      setSaved (postState?.savedList?.find ((post) => post._id === _id));
    }, [postState])

    useEffect (() => {
        getUser (userId);
        getDate ();
        if(likes.includes(authState._id)){
          setLiked(true);
        }
        else setLiked(false);
        setCountComment(comments.length);
        setcountLike(likes.length);
    }, [post])


  return (
    <div className={`rounded-md mb-4 bg-[${_COLOR.darkest}] p-4 border border-[${_COLOR.medium}] relative`} >
      <DisplayPost open={isDialogOpen} setOpen={setDialogOpen} post={post?.post}/>
    <div className="flex justify-between">
      <div className="flex gap-3">
              <div>
                <Link href={'/profile'}>
                  <span className="cursor-pointer">
                    <Avatar url={creator?.image || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} />
                  </span>
                </Link>
              </div>
              <div className="grow">
                <div>
                  <Link to={`/profile/${creator?.username}`}>
                    <span className={`mr-1 font-semibold cursor-pointer hover:underline text-white`}>
                      {creator?.username}
                    </span>
                  </Link>
                </div>
                <p className={`text-[${_COLOR.more_light}] text-sm`}>
                {date}
                </p>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="m-1">
                <i className="text-white fa-solid fa-ellipsis"></i>
              </div>
              <ul tabIndex={0} className={`dropdown-content menu bg-[${_COLOR.medium}] text-[${_COLOR.lightest}] rounded-box z-[1] w-52 p-4 gap-4 shadow-2xl shadow-[${_COLOR.medium}]`}>
                <li onClick={() => setDialogOpen(true)} className="hover:cursor-pointer">View Post</li>
                <li className="hover:cursor-pointer">Not Intrested</li>
                {(authState._id === userId)  && <li className="hover:cursor-pointer bg-red" onClick={Deletepost}>Delete Post</li>}
              </ul>
            </div>
      </div>
      <div>
      {(video?.length > 0 || image?.length > 0) && (
        <div className="my-5 h-[28rem] carousel rounded-sm w-full bg-black" >
          {image?.map((photo, key) => (
            <div key={`image-${key}`} className="carousel-item flex justify-center bg-transparent w-full relative">
              <img src={photo} className="w-max" alt="Image not found" />
            </div>
          ))}
          {video?.map((ele, key) => (
                  <div 
                  key={`video-${key}`} 
                  className="carousel-item h-full flex justify-center focus:outline-none bg-transparent w-full relative hover:cursor-pointer"
                  onClick={() => togglePlay (key)}
                >
                  <video 
                    ref={(el) => (videoRefs.current[key] = el)}
                    src={ele}
                    className="w-max h-[min(40rem,max-content)]" 
                  >
                    Your browser does not support the video tag.
                  </video>
            
                  {showButton[key] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-30 rounded-full w-16 h-16 flex items-center justify-center">
                        {isPlaying[key] ? (
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
      )}
      </div>
      <div className="mt-5 flex w-full justify-between px-2">
        <div className="flex gap-4">
          <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleLike}>
            {liked ? (<i className="text-white fa-solid fa-heart"></i>) : <i className="text-white fa-regular fa-heart"></i>}
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
      <p className={`text-md mt-4 text-[${_COLOR.more_light}]`}>
        {tempCaption} {caption?.toString().length > 1000 && (
        <span onClick={() => setCheck(!check)} className={`text-pink-400 font-extralight hover:cursor-pointer`}>
            {check ? ' Show Less' : '... Read More'}
        </span>)}
      </p>
      <p>
        {interests[0].length > 0 && hashtags?.map ((interest, index) => (
          <span key={index} className={`text-[${_COLOR.more_light}] font-extralight text-xs`}>#{interest} &nbsp;</span>
        ))}
      </p>
      <div className="flex mt-4 gap-3">
        <div>
          <Avatar url={photo} />
        </div>
        <div className="grow rounded-full relative">
          <div >
            <input
              className=
              {`block w-full p-2 px-4 overflow-hidden h-12 focus:outline-none rounded-full bg-[${_COLOR.less_light}] text-white`} 
              placeholder="Leave a comment"
              name="description"
              value={commentDescription}
              onChange={handleChange}/>
          </div>
          <button className={`absolute top-3 right-4`} onClick={postComment}>
            <i className={`text-white fa-solid fa-paper-plane text-[${_COLOR.lightest}]`}></i>
          </button>
        </div>
      </div>
      <div> 
      </div>
    </div>
  );
}

export default PostCard;