import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserById } from "../redux/Slices/auth.slice";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";

function PostCard(post) {
    const {image, video, likes, comments, interests, createdAt, userId, caption} = post.post;
    const currUser = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [date, setDate] = useState (0);
    const [creator, setCreator] = useState ({
      image: "A",
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
    }, [])

  return (
    <div className={`rounded-md mb-4 bg-[${_COLOR.less_light}] p-4 border border-16 border-[${_COLOR.darkest}]`} >
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
              <span className="mr-1 font-semibold cursor-pointer hover:underline">
                {creator?.name}
              </span>
            </Link>
          </p>
          <p className="text-gray-500 text-sm">
          {date}
          </p>
        </div>
        <div className="relative">
        </div>
      </div>
      <div>
        {image?.length > 0 && (
          <div className={`my-5 h-[28rem] carousel rounded-md w-full shadow-box shadow-md shadow-[${_COLOR.medium}]`}>
            {image.map((photo, key) => (
              <div key={key} className={`carousel-item w-full`}>
                <img src={photo} className="w-full" alt="Image not found"/>
              </div>
            ))}
          </div>
        )}
        <p className="text-sm">{caption}</p>
      </div>
      <div className="mt-5 flex w-full justify-between px-2">
        <div className="flex gap-4">
          <button className="flex gap-2 items-center" >
          {/* <i className="fa-solid fa-heart"></i> */}
          <i className="fa-regular fa-heart"></i>
            {likes?.length}
          </button>
          <button className="flex gap-2 items-center">
          {/* <i class="fa-solid fa-comment"></i> */}
            <i class="fa-regular fa-comment"></i>
            {comments?.length}
          </button>
        </div>
        <div className="flex">
        <button className="flex gap-2 items-center">
            <i class="fa-regular fa-bookmark"></i>
            {/* <i class="fa-solid fa-bookmark"></i> */}
            {comments?.length}
          </button>
        </div>
      </div>
      <div className="flex mt-4 gap-3">
        <div>
          <Avatar url={currUser?.data?.image} />
        </div>
        <div className="border grow rounded-full relative">
          <form >
            <input
              className={`block w-full p-2 px-4 overflow-hidden h-12 focus:outline-none rounded-full bg-[${_COLOR.lightest}]`} placeholder="Leave a comment"/>
          </form>
          <button className={`absolute top-3 right-4 text-[${_COLOR.medium}]`}>
            <i className="fa-solid fa-paper-plane"></i>
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