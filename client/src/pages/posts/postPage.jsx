import { FiSend } from "react-icons/fi";
import { IoMdPhotos } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { MdVideoCameraBack } from "react-icons/md";
import { MdGif } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
// import PostCard from "../../components/PostCard";
import { useSelector } from 'react-redux'

function PostPage() {

    const postState = useSelector ((state) => state.post);

    return (
        <div className="fixed top-[5rem] md:top-[4rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[10rem]">
            <h2 className={`text-[${_COLOR.lightest}] heading text-[2rem]`}>Activity Feed</h2>
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

        </div>

        
    )
}
export default PostPage;