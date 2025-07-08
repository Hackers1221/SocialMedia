import { useState } from "react";
import DisplayPost from "./DisplayPost";
import { useLocation, useNavigate } from "react-router-dom";

function ExploreCard ({ post, postThumbnail, video, index, list, followers }) {
    const location = useLocation ();
    const navigate = useNavigate ();

    const [isOpen, setOpen] = useState (false);

    const tempCaption = post?.caption?.length < 100 ? post?.caption : post?.caption?.toString().slice(0, 100) + " ...";

    function openPost () {
        navigate(`/post/${post._id}`, { state: { backgroundLocation: location.pathname } });
    }


    return (
        <>
            {/* <DisplayPost open={isOpen} setOpen={setOpen} index={index} list={list} followers={followers}/> */}
            <div onClick={openPost} className="relative w-full h-max rounded-xl bg-[var(--card)] mb-4 break-inside-avoid shadow-xl hover:shadow-2xl hover:cursor-pointer">
                <img 
                    src={postThumbnail}
                    className={`w-full rounded-t-xl object-cover`}
                />
                {post?.image?.length > 1 && <i className="fa-solid fa-images absolute top-2 right-2 text-white"></i>}
                {video && <i className="fa-solid fa-video absolute top-2 right-2 text-white"></i>}
                {tempCaption?.length > 0 && <p className={`text-sm mt-4 text-[var(--text)] px-4 pb-4 w-full text-ellipsis break-words`}>
                    {tempCaption}
                </p>}
                <div className="w-full flex justify-end items-center text-xs px-4 py-2 gap-2 text-[var(--buttons)] border-t border-[var(--border)] font-semibold" onClick={() => setOpen(true)}>
                    <h2>View Post</h2>
                    <i className="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        </>
    )
}

export default ExploreCard;