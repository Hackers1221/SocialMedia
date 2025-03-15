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

function PostCard(post) {

    const authState = useSelector((state) => state.auth.data);
    const currUser = useSelector((state) => state.auth);
    const [postState] = usePosts ();
    const videoRefs = useRef([]);
    const timeoutRef = useRef({});

    const dispatch = useDispatch();

    const {_id, likes, comments, interests, createdAt, userId, caption, image, video} = post?.post;
    const imageData = post?.post.image;
    const videoData = post?.post.video;

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [countLike,setcountLike] = useState(likes.length);
    const [images, setImages] = useState ();

    // Delete related
    const [deleting, setDeleting] = useState(false);

    const photo = currUser.data?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"
    const hashtags = interests[0].split(" ");
    

    const [date, setDate] = useState ("");
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
      await dispatch (getPostById (_id));
    };    

    async function getUser (userId) {
        if (!userId) return;
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
      await dispatch(getCommentByPostId(_id));
    }

    const Deletepost = async() => {
      setDeleting(true);
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
      else {
        toast.error("Something went wrong");
      }
      setDeleting(false);
    }

  const extractThumbnail = (videoURL) => {
    const video = document.createElement("video");
    video.src = videoURL;
    video.crossOrigin = "anonymous"; // Prevents CORS issues
    video.preload = "metadata"; // Load only metadata, not the full video
    video.muted = true; // Prevents autoplay issues in some browsers
  
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = Math.min(5, video.duration / 2); // Seek to a valid frame
    });
  
    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      // Use full resolution
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const element = { url: canvas.toDataURL("image/png"), filename: "video" };
      
      setImages((prevImages) => [...prevImages, element]);

    });
  
    video.load(); // Ensures metadata loads before seeking
  };


  useEffect(() => { 
    if (image) {
      setImages(image);
    }
    else setImages ([]);
    video?.forEach((vid) => {
      if (vid?.url) {
        extractThumbnail(vid?.url);
      }
    });
  }, [_id]);

    useEffect (() => {
      setSaved (postState?.savedList?.find ((post) => post._id === _id));
    }, [postState?.savedList])

    useEffect (() => {
        getUser (userId);
        setDate(getTimeDifference (createdAt));
        if(likes.includes(authState._id)){
          setLiked(true);
        }
        else setLiked(false);
        setCountComment(comments.length);
        setcountLike(likes.length);
    }, [post])


  return (
    <div className={`rounded-md mb-4 bg-black p-4 relative bg-opacity-[20%] box-shadow`} >
      <DisplayPost open={isDialogOpen} setOpen={setDialogOpen} post={post?.post}/>
    <div className="flex justify-between">
      <div className="flex gap-3">
              <div className="flex items-center">
                <Link href={'/profile'}>
                  <span className="cursor-pointer">
                    <Avatar url={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} size={'md'}/>
                  </span>
                </Link>
              </div>
              <div className="grow">
                <div>
                  <Link to={`/profile/${creator?.username}`}>
                    <span className={`mr-1 text-sm font-semibold cursor-pointer hover:underline text-white`}>
                      {creator?.username}
                    </span>
                  </Link>
                </div>
                <p className={`text-[${_COLOR.more_light}] text-xs font-extralight`}>
                  {date}
                </p>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="m-1">
                <i className="text-white fa-solid fa-ellipsis"></i>
              </div>
              <ul tabIndex={0} className={`dropdown-content menu bg-[${_COLOR.medium}] text-[${_COLOR.lightest}] rounded-box z-[1] w-52 p-4 gap-4 shadow-2xl shadow-[${_COLOR.medium}]`}>
                <li onClick={() => setDialogOpen(true)} className="hover:cursor-pointer"><span>View Post</span></li>
                <li className="hover:cursor-pointer"><span>Not Intrested</span></li>
                {(authState._id === userId)  && <li 
                  className="hover:cursor-pointer text-red-300 flex flex-row justify-between" 
                  onClick={Deletepost}>
                    <span>Delete Post </span> 
                    {deleting && (
                        <i className="fa-solid fa-spinner animate-spin text-lg text-white"></i>
                      )}
                  </li>
                }
              </ul>
            </div>
      </div>
      {/* <div className="px-4">
      {(videoData?.length > 0 || imageData?.length > 0) && (
        <div className="mt-5 h-[28rem] carousel rounded-[2rem] w-full bg-black" >
          {imageData?.map((photo, key) => (
            <div key={`image-${key}`} className="carousel-item flex justify-center bg-transparent w-full relative">
              <img src={photo.url} className="w-max" alt="Image not found" />
            </div>
          ))}
          {videoData?.map((ele, key) => (
                  <div 
                  key={`video-${key}`} 
                  className="carousel-item h-full flex justify-center focus:outline-none bg-transparent w-full relative hover:cursor-pointer"
                  onClick={() => togglePlay (key)}
                >
                  <video 
                    ref={(el) => (videoRefs.current[key] = el)}
                    src={ele.url}
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
      </div> */}
      <div className="flex gap-3 h-[25rem] my-4">
            {/* Large First Image */}
            {images?.length > 0 && <div className={`relative ${image.length > 3 ? `w-[35%]` : images?.length > 2 ? `w-[33%]` : images?.length > 1 ? `w-[50%]` : `w-full`} rounded-lg h-full flex justify-center bg-black/30 hover:cursor-pointer`} onClick={() => setDialogOpen(true)}>
              <img 
                  src={images[0]?.url} 
                  alt="Main Image" 
                  className="object-cover h-full rounded-lg"
              />
              {images[0].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-white text-2xl"></i>}
              {images[0].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-white text-2xl"></i>}
            </div>}
            {images?.length > 1 && <div className={`relative ${images?.length > 3 ? `w-[35%]` : images?.length > 2 ? `w-[33%]` : `w-[50%]`} rounded-lg h-full flex items-center flex justify-center bg-black/30 hover:cursor-pointer`} onClick={() => setDialogOpen(true)}>
              <img 
                  src={images[1]?.url} 
                  alt="Image 2" 
                  className= "object-cover h-full rounded-lg"
              />
              {images[1].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-white text-2xl"></i>}
              {images[1].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-white text-2xl"></i>}
            </div>}

            {/* Next Two image + Grid for Remaining */}
            {images?.length > 2 && <div className={`flex flex-col gap-2 ${images?.length > 3 ? `w-[25%]` : `w-[33%]`}`}>
              <div className={` relative ${images?.length == 3 ? `h-full` : `h-[50%]`} rounded-lg flex justify-center bg-black/30 hover:cursor-pointer`} onClick={() => setDialogOpen(true)}>
                <img 
                    src={images[2]?.url} 
                    alt="Image 3" 
                    className="object-cover h-full rounded-lg"
                />
                {images[2].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-white text-2xl"></i>}
                {images[2].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-white text-2xl"></i>}
              </div>
              {images?.length > 3 && <div className="relative h-[50%] hover:cursor-pointer" onClick={() => setDialogOpen(true)}>
                  <div className="relative h-full w-full rounded-lg flex justify-center bg-black/30">
                    <img 
                        src={images[3]?.url} 
                        alt="Image 4" 
                        className="object-cover h-full rounded-lg"
                    />
                    {images[3].filename === "video" && <i className="fa-solid fa-video absolute top-4 left-4 text-white text-2xl"></i>}
                    {images[3].filename !== "video" && <i className="fa-solid fa-image absolute top-4 left-4 text-white text-2xl"></i>}
                  </div>
                  {images?.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <span className="text-white text-xl font-bold">
                              +{images?.length - 4}
                          </span>
                      </div>
                  )}
              </div>}
            </div>}
      </div>
      <div className="mt-2 flex w-full justify-between px-2">
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
            {saved? <i className={`text-[${_COLOR.buttons}] fa-solid fa-bookmark`}></i> : <i className={`text-[${_COLOR.lightest}] fa-regular fa-bookmark`}></i>}
          </button>
        </div>
      </div>
      <p className={`text-sm mt-2 ml-2 text-[${_COLOR.more_light}]`}>
        {tempCaption} {caption?.toString().length > 1000 && (
        <span onClick={() => setCheck(!check)} className={`text-blue-300 font-extralight hover:cursor-pointer`}>
            {check ? ' Show Less' : '... Read More'}
        </span>)}
      </p>
      {/* <p>
        {interests[0].length > 0 && hashtags?.map ((interest, index) => (
          <span key={index} className={`text-[${_COLOR.more_light}] font-extralight text-xs`}>#{interest} &nbsp;</span>
        ))}
      </p> */}
      {/* <div className="flex mt-4 gap-3">
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
      </div> */}
      <div> 
      </div>
    </div>
  );
}

export default PostCard;