import { useEffect, useState } from "react";
import { BsCameraReels } from "react-icons/bs";
import usePosts from "../../hooks/usePosts";
import ExploreCard from "../../components/ExploreCard";

const SavedPost = () => {
  const [postState] = usePosts ();
  const [pulseState] = usePulse ();

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
    postState.savedList?.forEach((post, index) => {
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
          onClick={() => setActiveTab("pulse")}
        >
          <BsCameraReels />
          <span>Pulse</span>
        </button>
      </div>

      {/* Post Content */}
      {activeTab == "images" && (postState.savedList?.length > 0 ? <div className="w-full mt-4">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 overflow-y-auto">
          {postState.savedList?.map((post, index) => (
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

      {activeTab == "pulse" && (pulseState.savedList?.length > 0 ? <div className="w-full mt-4">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 overflow-y-auto">
          {pulseState.savedList?.map((post, index) => (
              <ExploreCard 
              post={post} 
              key={index + 1} 
              index={index + 1}
              postThumbnail={post?.image[0]?.url || thumbnails[index]} 
              video={post?.image[0]?.url ? false : true}
              list={'savedList'}/>
          ))}
        </div>
      </div> : <h2 className={`w-full text-center font-extralight text-[var(--text)] mt-4`}>Save a pulse to keep track of content that matters to you!</h2>)}
    </div>
    </>
  );
};

export default SavedPost;
