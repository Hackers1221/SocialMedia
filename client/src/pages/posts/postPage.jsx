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

    // allposts = [
    //     {
    //         "image": [
    //             "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    //             "https://images.unsplash.com/photo-1519682337058-a94d519337bc"
    //         ],
    //         "video": [
    //             "https://www.shutterstock.com/video/clip-1094136931-audio-podcast-online-show-video-moving-male"
    //         ],
    //         "likes": [],
    //         "comments": "Beautiful shot!",
    //         "interests": ["travel", "landscape"],
    //         "userId": ""
    //     },
    //     {
    //         "image": [
    //             "https://images.unsplash.com/photo-1496346651079-6ca5cb67f42f",
    //             "https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2"
    //         ],
    //         "video": [
    //             "https://www.shutterstock.com/video/clip-1094136931-audio-podcast-online-show-video-moving-male"
    //         ],
    //         "likes": [],
    //         "comments": "Such an inspiring post!",
    //         "interests": ["motivation", "fitness"],
    //         "userId": ""
    //     },
    //     {
    //         "image": [
    //             "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    //             "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
    //         ],
    //         "video": [
    //             "https://www.shutterstock.com/video/clip-1094136931-audio-podcast-online-show-video-moving-male"
    //         ],
    //         "likes": [],
    //         "comments": "Nature is truly amazing!",
    //         "interests": ["nature", "wildlife"],
    //         "userId": ""
    //     },
    //     {
    //         "image": [
    //             "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
    //             "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8"
    //         ],
    //         "video": [
    //             "https://www.shutterstock.com/video/clip-1094136931-audio-podcast-online-show-video-moving-male"
    //         ],
    //         "likes": [],
    //         "comments": "Delicious-looking meal!",
    //         "interests": ["food", "cooking"],
    //         "userId": ""
    //     },
    //     {
    //         "image": [
    //             "https://images.unsplash.com/photo-1503341733017-1901578f9f2b",
    //             "https://images.unsplash.com/photo-1483137140003-ae073b395549"
    //         ],
    //         "video": [
    //             "https://www.shutterstock.com/video/clip-1094136931-audio-podcast-online-show-video-moving-male"
    //         ],
    //         "likes": [],
    //         "comments": "Such a powerful moment!",
    //         "interests": ["technology", "coding"],
    //         "userId": ""
    //     }
    // ]


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