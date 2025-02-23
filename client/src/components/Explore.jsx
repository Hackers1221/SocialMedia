import { useState } from "react";
import usePosts from '../hooks/usePosts';
import DisplayPost from "./DsiplayPost";

const Explore = () => {

  const [postState] = usePosts();

  const [selectedPost, setSelectedPost] = useState ();
  const [isDialogOpen, setDialogOpen] = useState (false);

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
          {postState?.postList?.map((post, index) => (
            <div key={index} className="relative h-[10rem] group overflow-hidden rounded-lg shadow-lg hover:cursor-pointer" onClick={() => {
              setDialogOpen(true);
              setSelectedPost (post);
            }}>
              <img
                src={post?.image[0]}
                alt="Explore"
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
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
