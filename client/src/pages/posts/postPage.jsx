import { FiSend } from "react-icons/fi";
import { IoMdPhotos } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { MdVideoCameraBack } from "react-icons/md";
import { MdGif } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux'
import PostCard from "../../components/PostCard";
import { useEffect } from "react";
import { getAllPosts } from "../../redux/Slices/post.slice";

function PostPage() {

    const postState = useSelector ((state) => state.post);
    const dispatch = useDispatch ();

    async function getPosts () {
        const res = await dispatch (getAllPosts());
        if (!res) toast.error ("Something went wrong");
    }

    useEffect (() => {
        getPosts ();
    }, [])

    return (
        // <div className="fixed top-[5rem] md:top-[4rem] md:left-[20rem] left-[1rem] w-full md:w-[50%] h-max bg-red-400">
        //     <h2 className={`text-[${_COLOR.lightest}] heading text-[2rem]`}>Activity Feed</h2>
        //     <div className={`w-full m-2 bg-[${_COLOR.less_light}] rounded-md p-4`}>
        //         <div className={`flex gap-2 items-center border-b py-2 border-[${_COLOR.more_light}]`}>
        //             <BsPersonCircle className="h-5 w-5"/>
        //             <input className={`w-full bg-transparent px-2 focus:outline-none`} placeholder="What's your mood"/>
        //         </div>
        //         <div className="flex justify-between mt-4 h-5">
        //             <div className="flex gap-2 h-5">
        //                 <MdAddAPhoto className="h-[100%] w-[100%] hover:cursor-pointer" />
        //                 <IoMdPhotos className="h-[100%] w-[100%] hover:cursor-pointer"/>
        //                 <MdVideoCameraBack className="h-[100%] w-[100%] hover:cursor-pointer"/>
        //                 <MdGif className="h-[100%] w-[100%] hover:cursor-pointer"/>
        //             </div>
        //             <FiSend className="h-[100%] hover:cursor-pointer"/>
        //         </div>
        //     </div>
        //     <div className=" flex-col h-max">
        //         {postState?.downloadedPosts?.map((post, key) => {
        //             return (<PostCard post={post} key={key}/>)
        //         })}
        //     </div>
        // </div>
        <>
            <div className="fixed top-[5rem] md:top-[4rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-screen flex flex-col">
                {/* Header */}
                <h2 className={`text-[${_COLOR.lightest}] heading text-[2rem]`}>Activity Feed</h2>
                
                {/* Input Box */}
                <div className={`w-full m-2 bg-[${_COLOR.less_light}] rounded-md p-4`}>
                    <div className={`flex gap-2 items-center border-b py-2 border-[${_COLOR.more_light}]`}>
                        <BsPersonCircle className="h-5 w-5"/>
                        <input className={`w-full bg-transparent px-2 focus:outline-none`} placeholder="What's your mood"/>
                    </div>
                    <div className="flex justify-between mt-4 h-5">
                        <div className="flex gap-2 h-5">
                            <MdAddAPhoto className="h-[100%] w-[100%] hover:cursor-pointer" />
                            <IoMdPhotos className="h-[100%] w-[100%] hover:cursor-pointer"/>
                            <MdVideoCameraBack className="h-[100%] w-[100%] hover:cursor-pointer"/>
                            <MdGif className="h-[100%] w-[100%] hover:cursor-pointer"/>
                        </div>
                        <FiSend className="h-[100%] hover:cursor-pointer"/>
                    </div>
                </div>

                {/* Scrollable Post List */}
                <div className="m-2 w-full h-[100vh] overflow-y-auto">
                    {postState?.downloadedPosts?.map((post, key) => (
                        <PostCard post={post} key={key}/>
                    ))}
                </div>
            </div>
        </>
    )
}
export default PostPage;