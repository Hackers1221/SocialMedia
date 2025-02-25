import { IoMdPhotos } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { MdVideoCameraBack } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux'
import PostCard from "../../components/PostCard";
import { useEffect, useState } from "react";
import { getAllPosts, getSavedPost } from "../../redux/Slices/post.slice";
import Avatar from "../../components/Avatar";
import toast from "react-hot-toast";
import SkeletonPostCard from "../../components/SkeletonPostCard";

function PostPage() {
    const authState = useSelector ((state) => state.auth);
    const postState = useSelector ((state) => state.post);
    const dispatch = useDispatch ();

    const [isLoading, setIsLoading] = useState (false);

    const image = authState?.data?.image || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"

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
            await dispatch (getAllPosts());
        } catch {
            toast.error ("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect (() => {
        getPosts ();
        getSavedPosts ();
    }, [])

    return (
        <>
            <div className="fixed top-[9rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[82vh] md:h-[97vh] flex flex-col flex-grow overflow-y-auto">
                {/* Header */}
                <h2 className={`text-[${_COLOR.lightest}] heading text-[2rem]`}>Activity Feed</h2>
                
                {/* Input Box */}
                <div className={`w-full mb-4 bg-[${_COLOR.less_light}] rounded-md p-4`}>
                    <div className={`flex gap-2 items-center border-b py-2 border-[${_COLOR.more_light}]`}>
                        <Avatar url={image}/>
                        <input className={`w-full bg-transparent px-2 focus:outline-none text-[${_COLOR.lightest}]`} placeholder="What's your mood"/>
                    </div>
                    <div className="flex justify-between mt-4 h-5">
                        <div className="flex gap-2 h-5">
                            <MdAddAPhoto className="text-white h-[100%] w-[100%] hover:cursor-pointer" />
                            <IoMdPhotos className="text-white h-[100%] w-[100%] hover:cursor-pointer"/>
                            <MdVideoCameraBack className="text-white h-[100%] w-[100%] hover:cursor-pointer"/>
                        </div>
                        <i className={`text-white fa-solid fa-paper-plane text-[${_COLOR.lightest}] hover:cursor-pointer`}></i>
                    </div>
                </div>

                {/* Scrollable Post List */}
                {isLoading && <SkeletonPostCard />}
                {!isLoading && <div className="w-full h-screen">
                    {postState?.downloadedPosts?.map((post, key) => (
                        <PostCard post={post} key={key}/>
                    ))}
                </div>}
            </div>
        </>
    )
}
export default PostPage;