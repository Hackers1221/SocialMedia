import { useEffect, useRef, useState } from "react";
import DisplayPost from "./DisplayPost";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, searchPost } from "../redux/Slices/post.slice";
import { X } from "lucide-react";

const Explore = () => {

  const dispatch = useDispatch();
  const [selectedPost, setSelectedPost] = useState ();
  const [isDialogOpen, setDialogOpen] = useState (false);
  const [thumbnails, setThumbnails] = useState({});
  const [query,setQuery] = useState("");
  const posts = useSelector((state) => state.post.downloadedPosts);
  const [postState,setpostState] = useState(posts);

  const extractThumbnail = (videoURL, index) => {
    const video = document.createElement("video");
    video.src = videoURL;
    video.crossOrigin = "anonymous"; // Prevents CORS issues
    video.preload = "metadata"; // Load only metadata, not the full video
    video.muted = true; // Prevents autoplay issues in some browsers
  
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = Math.min(5, video.duration / 2); // Seek to a valid frame
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

  const searchHandler = (e) => {
    setQuery(e.target.value);
  }

  useEffect(() => {
    if(query.trim()==""){
      setpostState(posts)
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
        try {
            const response = await dispatch(searchPost(query));
            setpostState(response.payload?.data?.postDetails)
        } catch (error) {
            console.error("Search failed:", error);
        }
    }, 300); // 300ms debounce delay
    return () => clearTimeout(delayDebounceFn);
  },[query])


  useEffect(() => {
    dispatch(getAllPosts()); 
}, [dispatch]);

useEffect(() => {
    setpostState(posts);
    posts?.forEach((post, index) => {
        if (post?.video?.[0]?.url) {
            extractThumbnail(post.video[0]?.url, index);
        }
    });
}, [posts]); 


  return (
    <>
    <DisplayPost open={isDialogOpen} setOpen={setDialogOpen} post={selectedPost}/>
    <div className={`fixed top-[8rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[49%] h-[97vh] flex flex-col flex-grow overflow-y-auto`}>
      <div className="max-w-5xl w-full">
      <h2 className={`text-[var(--text)] heading text-[2rem] mb-4`}>Explore</h2>
      <div className={`flex items-center border border-[var(--input)] rounded-md px-2 shadow-md w-full mb-6`}>
          <input
            type="text"
            placeholder="Search for ideas..."
            onChange={searchHandler}
            value={query}
            className={`w-full p-2 bg-transparent text-[var(--text)] focus:outline-none`}
          />
          {query.length > 0 && <button onClick={() => setQuery("")} className={`text-[var(--text)] text-2xl h-full`}>
              <X />
          </button>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {postState?.map((post, index) => (
            <div key={index} className="relative h-[10rem] group overflow-hidden rounded-lg shadow-lg hover:cursor-pointer" onClick={() => {setDialogOpen(true);
              setSelectedPost (post);
            }}>
              {<img
                src={post?.image[0]?.url || thumbnails[index]}
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