import { useEffect, useRef, useState } from "react";
import usePosts from '../hooks/usePosts';
import DisplayPost from "./DisplayPost";
import { useDispatch } from "react-redux";

const Explore = () => {

  const [postState] = usePosts();
  const dispatch = useDispatch();
  const [selectedPost, setSelectedPost] = useState ();
  const [isDialogOpen, setDialogOpen] = useState (false);
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
    postState?.downloadedPosts?.forEach((post, index) => {
      if (post?.video) {
        extractThumbnail(post.video[0], index);
      }
    });
  }, []);

  return (
    <>
    <DisplayPost open={isDialogOpen} setOpen={setDialogOpen} post={selectedPost}/>
    <div className="fixed top-[8rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[49%] h-[97vh] flex flex-col flex-grow overflow-y-auto">
      <div className="max-w-5xl w-full">
      <h2 className={`text-[${_COLOR.lightest}] heading text-[2rem] mb-4`}>Explore</h2>
        <div className="relative w-full mb-6">
          <input
            type="text"
            placeholder="Search for ideas..."
            className={`w-full p-3 border border-gray-300 rounded-md shadow-md focus:outline-none text-[${_COLOR.lightest}]`}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {postState?.downloadedPosts?.map((post, index) => (
            <div key={index} className="relative h-[10rem] group overflow-hidden rounded-lg shadow-lg hover:cursor-pointer" onClick={() => {              setDialogOpen(true);
              setSelectedPost (post);
            }}>
              {<img
                src={post?.image[0] || thumbnails[index]}
                alt="Explore"
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
              />}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-semibold">
                View
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Explore;