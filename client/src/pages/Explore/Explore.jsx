import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, searchPost } from "../../redux/Slices/post.slice";
import { X } from "lucide-react";
import ExploreCard from "../../components/ExploreCard";
import usePosts from "../../hooks/usePosts";
import { getFollowerDetails } from "../../redux/Slices/auth.slice";

const Explore = () => {
    const authState = useSelector ((state) => state.auth);
  const [postState] = usePosts ();

  const dispatch = useDispatch();
  const [thumbnails, setThumbnails] = useState({});
  const [query,setQuery] = useState("");

  const [postList, setPostList] = useState(postState?.downloadedPosts);
  const [followers, setFollowers] = useState ([]);

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
    let value = e.target.value;
    if (value && value[0] >= 'a' && value[0] <= 'z') {
      value = value[0].toUpperCase() + value.slice(1);
    }
    setQuery(value);
  };  

  const getDetails = async() => {
        const response = await dispatch(getFollowerDetails (authState.data._id));
        setFollowers(response.payload?.data?.userdata);
    }

  useEffect(() => {
    if(query.trim()==""){
      setPostList(postState?.downloadedPosts)
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
        try {
            const response = await dispatch(searchPost(query));
            setPostList(response.payload?.data?.postDetails.reverse())
        } catch (error) {
            console.error("Search failed:", error);
        }
    }, 300); // 300ms debounce delay
    return () => clearTimeout(delayDebounceFn);
  },[query])


  useEffect(() => {
    dispatch(getAllPosts()); 
}, [dispatch]);

useEffect (() => {
  setPostList (postState?.downloadedPosts);
}, [postState?.downloadedPosts])

useEffect(() => {
    getDetails ();
    postList.forEach((post, index) => {
        if (post?.video?.[0]?.url) {
            extractThumbnail(post.video[0]?.url, index);
        }
    });

}, [postList]); 


  return (
    <>
    <div className={`fixed top-[4rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh] flex flex-col flex-grow overflow-y-auto`}>
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
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3">
          {postList?.map((post, index) => (
            <ExploreCard 
              post={post} 
              key={index + 1} 
              index={index + 1}
              postThumbnail={post?.image[0]?.url || thumbnails[index]} 
              video={post?.image[0]?.url ? false : true}
              list={'postList'}
              followers={followers}/>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Explore;