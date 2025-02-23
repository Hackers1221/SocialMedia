import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import { likePost, updatePost } from "../redux/Slices/post.slice";

function PostCard(post) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const {_id,image, video, likes, comments, interests, createdAt, userId, caption} = post?.post;
    const currUser = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth.data);
    const [countLike,setcountLike] = useState(likes.length);

    const photo = currUser.data?.image || "Empty Source"

    const [date, setDate] = useState (0);
    const [newLikes, setNewLikes] = useState([]);
    const [count, setCount] = useState (0);
    const [imageLength, setImageLength] = useState (0);
    const [creator, setCreator] = useState ({
      image: "Empty Source",
      name: "",
      username: "",
      password: "",
      email: "",
      birth: ""
    });

    function getDate() {
      let date = createdAt?.toString()?.split('T')[0].split('-').reverse().join("/");
      setDate(date);
    }
    function toggleBookmark() {
      setSaved(!saved);
    }

    const toggleLike = async () => {
      const response = await dispatch(likePost({
        _id, 
        id: authState._id 
      }));
      
      console.log(response);
    
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

    useEffect (() => {
        getUser (userId);
        getDate ();
        setImageLength (image.length);
        if(likes.includes(authState._id)){
          setLiked(true);
        }
    }, [])




  return (
    <div className={`rounded-md mb-4 bg-[${_COLOR.less_light}] p-4 border border-16 border-[${_COLOR.darkest}]`} >
    <div className="flex justify-between">
      <div className="flex gap-3">
              <div>
                <Link href={'/profile'}>
                  <span className="cursor-pointer">
                    <Avatar url={creator?.image} />
                  </span>
                </Link>
              </div>
              <div className="grow">
                <p>
                  <Link href={'/profile/'+creator?._id}>
                    <span className={`mr-1 font-semibold cursor-pointer hover:underline text-white`}>
                      {creator?.name}
                    </span>
                  </Link>
                </p>
                <p className={`text-[${_COLOR.more_light}] text-sm`}>
                {date}
                </p>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="m-1">
                <i className="text-white fa-solid fa-ellipsis"></i>
              </div>
              <ul tabIndex={0} className={`dropdown-content menu bg-[${_COLOR.medium}] text-[${_COLOR.lightest}] rounded-box z-[1] w-52 p-2 shadow-2xl shadow-[${_COLOR.medium}]`}>
                <li><a>Follow</a></li>
                <li><a>Unfollow</a></li>
                <li><a>Not Intrested</a></li>
              </ul>
            </div>
      </div>
      <div>
      {(video?.length > 0 || image?.length > 0) && (
    <div className="my-5 h-[28rem] carousel rounded-sm w-full bg-transparent">
      {/* Render videos first */}
      {/* Render images next */}
      {image?.map((photo, key) => (
        <div key={`image-${key}`} className="carousel-item flex justify-center bg-transparent w-full relative">
          <img src={photo} className="w-max" alt="Image not found" />
        </div>
      ))}
      {video?.map((ele, key) => (
        <div key={`video-${key}`} className="carousel-item  flex justify-center bg-transparent w-full relative">
          <video className="w-max" controls>
            <source src={ele} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  )}
        <p className={`text-sm text-[${_COLOR.more_light}]`}>{caption}</p>
      </div>
      <div className="mt-5 flex w-full justify-between px-2">
        <div className="flex gap-4">
          <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleLike}>
            {liked ? (<i className="text-white fa-solid fa-heart"></i>) : <i className="text-white fa-regular fa-heart"></i>}
            {countLike}
          </button>
          <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`}>
          {/* <i className="text-white fa-solid fa-comment"></i> */}
            <i className="text-white fa-regular fa-comment"></i>
            {comments?.length}
          </button>
        </div>
        <div className="flex">
        <button className={`flex gap-2 items-center text-[${_COLOR.more_light}]`} onClick={toggleBookmark}>
            {saved? <i className="text-white fa-solid fa-bookmark"></i> : <i className="text-white fa-regular fa-bookmark"></i>}
            {comments?.length}
          </button>
        </div>
      </div>
      <div className="flex mt-4 gap-3">
        <div>
          <Avatar url={photo} />
        </div>
        <div className="border grow rounded-full relative">
          <form >
            <input
              className={`block w-full p-2 px-4 overflow-hidden h-12 focus:outline-none rounded-full bg-[${_COLOR.lightest}]`} placeholder="Leave a comment"/>
          </form>
          <button className={`absolute top-3 right-4`}>
            <i className={`text-white fa-solid fa-paper-plane text-[${_COLOR.darkest}]`}></i>
          </button>
        </div>
      </div>
      <div> 
        {/* {comments.length > 0 && comments.map(comment => (
          <div key={comment.id} className="mt-2 flex gap-2 items-center">
            <Avatar url={comment.profiles.avatar} />
            <div className="bg-gray-200 py-2 px-4 rounded-3xl">
              <div>
                <Link href={'/profile/'+comment.profiles.id}>
                  <span className="hover:underline font-semibold mr-1">
                    {comment.profiles.name}
                  </span>
                </Link>
                <span className="text-sm text-gray-400">
                  <ReactTimeAgo timeStyle={'twitter'} date={(new Date(comment.created_at)).getTime()} />
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default PostCard;