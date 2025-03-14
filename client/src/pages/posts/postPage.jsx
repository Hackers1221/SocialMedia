import { IoMdPhotos } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { MdVideoCameraBack } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux'
import PostCard from "../../components/PostCard";
import { useEffect, useRef, useState } from "react";
import { filterPostsByFollowing, filterPostsByLiked, getAllPosts, getSavedPost } from "../../redux/Slices/post.slice";
import Avatar from "../../components/Avatar";
import toast from "react-hot-toast";
import SkeletonPostCard from "../../components/SkeletonPostCard";
import Stories from "../../components/Stories";

function PostPage() {
    const authState = useSelector ((state) => state.auth);
    const postState = useSelector ((state) => state.post);

    const dispatch = useDispatch ();

    const [isLoading, setIsLoading] = useState (false);
    const [selected, setSelected] = useState ("All");

    const options = ["All", "Following", "Liked"]

    async function getSavedPosts () {
        setIsLoading(true);
        try {
            await dispatch(getSavedPost (authState?.data?._id));
        } catch {
            toast.error ("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function getPosts () {
        setIsLoading(true);
        try {
            await dispatch (getAllPosts ());
        } catch {
            toast.error ("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function optionChange (option) {
        setSelected (option);
        if (option === "Liked") await dispatch( filterPostsByLiked ({id : authState?.data?._id}));
        if (option === "Following") await dispatch( filterPostsByFollowing ({following : authState?.data?.following}));
        if (option === "All") await dispatch (getAllPosts ());
    }

    useEffect (() => {
        getPosts ();
        getSavedPosts ();
    }, [])

    return (
        <>
            <div className="fixed top-[9rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[82vh] md:h-[97vh] flex flex-col flex-grow overflow-y-auto">
                {/* Header */}
                <h2 className={`text-[${_COLOR.lightest}] font-bold text-[1.5rem]`}>Moments</h2>
                
                {/* Input Box */}
                <div className={`w-full mb-4 rounded-md py-4`}>
                    <Stories />
                </div>

                <div className="flex justify-between items-center">
                    <h2 className={`text-[${_COLOR.lightest}] font-bold text-[1.5rem]`}>Recent Post</h2>
                    <div className="flex gap-4">
                        {options?.map ((option, index) => {
                           return (<h2 
                            key={index} 
                            className={`${ selected === option ? `text-[${_COLOR.lightest}]` : `text-[${_COLOR.less_light}]` // Default color
                            } font-bold text-[1rem] hover:cursor-pointer`} 
                            onClick={() => optionChange(option)}>{option}</h2>)
                        })}
                    </div>
                </div>

                {/* Scrollable Post List */}
                {isLoading && <SkeletonPostCard />}
                {!isLoading && <div className="pt-4 w-full h-screen">
                    {postState?.postList?.map((post, key) => (
                        <PostCard post={post} key={key}/>
                    ))}
                </div>}
            </div>
        </>
    )
}
export default PostPage;