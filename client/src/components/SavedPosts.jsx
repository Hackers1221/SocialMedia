import { useSelector } from "react-redux";
import { useState } from "react";

const SavedPost = () => {
  const savedposts = useSelector((state) => state.auth.data.savedImages);
  const [activeTab, setActiveTab] = useState("images"); // "images" or "reels"

  return (
    <div className="fixed top-[10rem] md:top-[5rem] md:top-[4rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%]">
      {/* Tabs for Images and Reels */}
      <div className="flex justify-center space-x-4 mb-4 border-b pb-2">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "images" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("images")}
        >
          Images
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "reels" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("reels")}
        >
          Reels
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
          {savedposts
            ?.filter((post) =>
              activeTab === "images" ? !post.includes("video") : post.includes("video")
            )
            .map((photo, index) => (
              <div key={index}>
                <img
                  className="object-cover object-center w-[25rem] h-[10rem] rounded-sm"
                  src={photo}
                  alt="Post cannot be loaded"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SavedPost;
