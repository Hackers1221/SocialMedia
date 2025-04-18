import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BsCameraReels } from "react-icons/bs";
import DisplayPost from "../../components/DisplayPost";
import usePosts from "../../hooks/usePosts";
import ExploreCard from "../../components/ExploreCard";

const SavedPost = () => {
  const [postState] = usePosts ();
  
  const savedArray = postState?.savedList;

  const [activeTab, setActiveTab] = useState("images");

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

    savedArray?.forEach((post, index) => {
        if (post?.video[0]?.url) {
          extractThumbnail(post?.video[0].url, index);
        }
      });
    }, []);

  return (
    <>
    <div className="fixed top-[4rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh] overflow-y-auto">
      {/* Tabs for Images and Reels */}
      <div className={`flex justify-center space-x-4 border-b pb-2 bg-[var(--card)] border border-[var(--border)]`}>
        <button
          className={`px-4 py-2 font-semibold flex items-center space-x-2 ${
            activeTab === "images" ? `text-[var(--buttons)]` : "text-gray-400"
          }`}
          onClick={() => setActiveTab("images")}
        >
          <i className="fa-regular fa-images"></i>
          <span>Posts</span>
        </button>
        <button
          className={`px-4 py-2 font-semibold flex items-center space-x-2 ${
            activeTab === "reels" ? `text-[var(--buttons)]` : "text-gray-400"
          }`}
          onClick={() => setActiveTab("reels")}
        >
          <BsCameraReels />
          <span>Pulse</span>
        </button>
      </div>

      {/* Main Content */}
      {activeTab == "images" && (savedArray?.length > 0 ? <div className="w-full mt-4">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 overflow-y-auto">
          {savedArray?.map((post, index) => (
            // <div key={index} className="relative h-[10rem] group hover:cursor-pointer overflow-hidden rounded-lg" onClick={() => {
            //   setDialogOpen(true);
            //   setSelectedPost (post);
            // }}>
            //   {activeTab === "images" && <img
            //     src={post?.image[0]?.url || thumbnails[index]}
            //     alt="Explore"
            //     className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
            //   />}
            //   <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-semibold">
            //     View
            //   </div>
            // </div>
              <ExploreCard 
              post={post} 
              key={index + 1} 
              index={index + 1}
              postThumbnail={post?.image[0]?.url || thumbnails[index]} 
              video={post?.image[0]?.url ? false : true}
              list={'savedList'}/>
          ))}
        </div>
      </div> : <h2 className={`w-full text-center font-extralight text-[var(--text)] mt-4`}>Save a post to keep track of content that matters to you!</h2>)}
    </div>
    </>
  );
};

export default SavedPost;
