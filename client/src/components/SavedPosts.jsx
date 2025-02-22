import { useSelector } from "react-redux";
import { useState } from "react";
import { BsCameraReels } from "react-icons/bs";
import DisplayPost from "./DsiplayPost";

const SavedPost = () => {
  const saved = useSelector((state) => state.auth.data.saved);

  const [activeTab, setActiveTab] = useState("images");
  const [isDialogOpen, setDialogOpen] = useState (false);
  const [selectedPost, setSelectedPost] = useState ();

  return (
    <>
      <DisplayPost open={isDialogOpen} setOpen={setDialogOpen} post={selectedPost}/>
    <div className="fixed top-[10rem] md:top-[1rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%]">
      {/* Tabs for Images and Reels */}
      <div className="flex justify-center space-x-4 border-b pb-2">
        <button
          className={`px-4 py-2 font-semibold flex items-center space-x-2 ${
            activeTab === "images" ? `text-[${_COLOR.lightest}] border-b-2 border-[${_COLOR.lightest}]` : "text-gray-500"
          }`}
          onClick={() => setActiveTab("images")}
        >
          <i className="fa-regular fa-images"></i>
          <span>Posts</span>
        </button>
        <button
          className={`px-4 py-2 font-semibold flex items-center space-x-2 ${
            activeTab === "reels" ? `text-[${_COLOR.lightest}] border-b-2 border-[${_COLOR.lightest}]` : "text-gray-500"
          }`}
          onClick={() => setActiveTab("reels")}
        >
          <BsCameraReels />
          <span>Reels</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {(activeTab === "images" ? saved : savedvideos)?.map((post, index) => (
            <div key={index} className="relative group hover:cursor-pointer overflow-hidden rounded-lg" onClick={() => {
              setDialogOpen(true);
              setSelectedPost (post);
            }}>
              {activeTab === "images" && (
                <img
                  className="object-center w-[25rem] h-[10rem] object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                  src={post.image}
                  alt="Post cannot be loaded"
                />
              )}
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

export default SavedPost;
