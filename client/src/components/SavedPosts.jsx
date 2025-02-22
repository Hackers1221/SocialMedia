import { useSelector } from "react-redux";
import { useState } from "react";
import { BsCameraReels } from "react-icons/bs";

const SavedPost = () => {
  const savedimages = useSelector((state) => state.auth.data.savedImages);
  const savedvideos = useSelector((state) => state.auth.data.savedVideos);
  const [activeTab, setActiveTab] = useState("images");

  const defaultThumbnail = "https://tse3.mm.bing.net/th?id=OIP.Oc-T0TUXo2iuOBfQfLSbDAHaEo&w=296&h=296&c=7";

  return (
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
          {(activeTab === "images" ? savedimages : savedvideos)?.map((post, index) => (
            <div key={index} className="relative group hover:cursor-pointer overflow-hidden rounded-lg">
              {activeTab === "images" ? (
                <img
                  className="object-center w-[25rem] h-[10rem] object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                  src={post}
                  alt="Post cannot be loaded"
                />
              ) : (
                <video
                  className="object-cover object-center w-[25rem] h-[10rem] rounded-lg"
                  src={post}
                  poster={defaultThumbnail} // Default thumbnail for videos
                  controls
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
  );
};

export default SavedPost;
