import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserById } from "../redux/Slices/auth.slice";
const DisplayPost = ({ open, setOpen, post }) => {

    if (!post) return <></>;

    const dispatch = useDispatch ();

    const [creator, setCreator] = useState ({
        image: "A",
        name: "Anonymous",
        username: "",
        password: "",
        email: "",
        birth: ""
    });

  async function getUser(userId) {
    const response = await dispatch (getUserById (userId));
    if(!response){
        toast.error("Something went Wrong!");
    }
    
    setCreator(response.payload?.data?.userdetails);
    }

    useEffect (() => {
        console.log (post);
        getUser (post?.userId);
    }, [post?.userId])

  return (
        <dialog open={open} onClose={setOpen} className={`relative w-[60%] mx-auto p-2 py-4 bg-[${_COLOR.darkest}] shadow-[${_COLOR.less_light}] shadow-xl rounded-lg z-[100]`}>
          <div className="relative w-max">
            {post?.image?.map((photo, key) => (
                <div key={`image-${key}`} className="carousel-item flex justify-center bg-transparent w-full relative">
                    <img src={photo} className="w-max" alt="Image not found" />
                </div>
            ))}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded">
            <p className="font-semibold">{creator?.name}</p>
            <p className="text-xs">{new Date(post?.createdAt).toLocaleString()}</p>
            </div>
          </div>
    </dialog>
  );
};

export default DisplayPost;