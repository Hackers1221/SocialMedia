import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link, useNavigate } from "react-router-dom";
import DisplayStory from "./DisplayStory";
import { useEffect, useState } from "react";

function Stories () {

    const authState = useSelector ((state) => state.auth);
    const storyState = useSelector ((state) => state.story);

     const [isDialogOpen, setDialogOpen] = useState (false);
     const [idx, setIdx] = useState (-1);

    const image = authState.data?.image || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"

    const videoUrls = [
        "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740330241/socialMedia/videos/1740330232651-videoplayback%20%284%29.mp4.mp4",
        "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740333146/socialMedia/videos/1740333139819-MAX%20QUALITY%20FILE%20IN%20BIO%20From%20the%20magnetic%20presence%20of%20Nayanthara%2C%20the%20versatile%20performances%20of%20Samantha%20Akkineni%2C%20and%20the%20powerful%20portrayals%20of%20Anushka%20Shetty%20to%20the%20graceful%20charm%20of%20Trisha%20Krishnan%2C%20these%20l%20%281%29.mp4.mp4"
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
        videoUrls?.forEach((story, index) => {
          if (story) {
            extractThumbnail(story, index);
          }
        });
      }, [storyState]);

    return (
        <section className="fixed top-[4rem] md:top-[0rem] left-0 md:left-auto right-full md:right-0 w-full md:w-auto h-max md:min-h-screen flex flex-row md:flex-col items-center md:pt-5 px-4">
            <DisplayStory open={isDialogOpen} setOpen={setDialogOpen} index={idx}/>
            <ul className="flex flex-row md:flex-col items-center justify-center gap-4">
                <li className="flex justify-end">
                    <Link to={`/profile/${authState?.data?.username}`}>
                        <Avatar url={image} />
                    </Link>
                </li>
                {videoUrls?.map((story, index) => (
                    <li key={index} className="flex flex-col items-center space-y-2" onClick={() => {
                        setIdx(index); setDialogOpen(true)}}>
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