import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link, useNavigate } from "react-router-dom";
import DisplayStory from "./DisplayStory";
import { useEffect, useState } from "react";
import StoryViewer from "./StoryViewer";

function Stories () {

    const authState = useSelector ((state) => state.auth);
    const storyState = useSelector ((state) => state.story);

     const [isDialogOpen, setDialogOpen] = useState (false);
     const [showStories, setShowStories] = useState(false);
     const [idx, setIdx] = useState (-1);

    const image = authState.data?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"

    const stories = [
        {
          type: "video",
          url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741935861/socialMedia/videos/1741935855427-videoplayback%20%287%29.mp4.mp4",
          profile: "https://source.unsplash.com/40x40/?portrait",
          username: "Alice",
          time: "10",
        }
      ];

    const [thumbnails, setThumbnails] = useState({});
    
    const extractThumbnail = (videoURL, index) => {
        const video = document.createElement("video");
        video.src = videoURL;
        video.crossOrigin = "anonymous"; // Prevents CORS issues
        video.preload = "metadata"; // Load only metadata, not the full video
        video.muted = true; // Prevents autoplay issues in some browsers
      
        video.addEventListener("loadedmetadata", () => {
          video.currentTime = Math.min(15, video.duration / 2); // Seek to a valid frame
        });
      
        video.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
      
          // Use full resolution
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
      
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
          setThumbnails((prev) => ({
            ...prev,
            [index]: canvas.toDataURL("image/png"),
          }));
        });
      
        video.load(); // Ensures metadata loads before seeking
      };
      
    
      useEffect (() => {
        stories?.forEach((story, index) => {
          if (story) {
            extractThumbnail(story, index);
          }
        });
      }, [storyState]);

    return (
        <section className="fixed top-[4rem] md:top-[0rem] left-0 md:left-auto right-full md:right-0 w-full md:w-auto h-max md:min-h-screen flex flex-row md:flex-col items-center md:pt-5 px-4">
            {/* <DisplayStory open={isDialogOpen} setOpen={setDialogOpen} index={idx}/> */}
            {showStories && <StoryViewer stories={stories} currentIndex={0} onClose={() => setShowStories(false)} />}
            <ul className="flex flex-row md:flex-col items-center justify-center gap-4">
                <li className="flex justify-end">
                    <Link to={`/profile/${authState?.data?.username}`}>
                        <Avatar url={image} />
                    </Link>
                </li>
                {stories?.map((story, index) => (
                    <li key={index} className="flex flex-col items-center space-y-2 hover:cursor-pointer" onClick={() => {
                        setIdx(index); setShowStories(true)}}>
                        <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                            <div className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                                <img className="h-10 w-10 rounded-full object-cover " src={thumbnails[index]} alt="image"/>
                            </div>
                        </div>
                    </li>
                ))}
                {/* <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image" />
                        </a>
                    </div>
                </li> */}
            </ul>
        </section>
    )
}

export default Stories;