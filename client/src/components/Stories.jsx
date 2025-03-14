// import { useSelector } from "react-redux";
// import Avatar from "./Avatar";
// import { Link, useNavigate } from "react-router-dom";
// import DisplayStory from "./DisplayStory";
// import { useEffect, useState } from "react";
// import StoryViewer from "./StoryViewer";

// function Stories () {

//     const authState = useSelector ((state) => state.auth);
//     const storyState = useSelector ((state) => state.story);

//      const [isDialogOpen, setDialogOpen] = useState (false);
//      const [showStories, setShowStories] = useState(false);
//      const [idx, setIdx] = useState (-1);

//     const image = authState.data?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"

//     const stories = [
//         {
//           type: "video",
//           url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741969749/socialMedia/videos/1741969744060-videoplayback%20%287%29.mp4.mp4",
//           profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
//           username: "Alice",
//           time: "10",
//         },
//         {
//             type: "video",
//             url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970346/socialMedia/videos/1741970329945-videoplayback%20%286%29.mp4.mp4",
//             profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
//             username: "Alice",
//             time: "10",
//           },
//           {
//             type: "video",
//             url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970445/socialMedia/videos/1741970433641-videoplayback%20%284%29.mp4.mp4",
//             profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
//             username: "Alice",
//             time: "10",
//           },
//           {
//             type: "video",
//             url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741969749/socialMedia/videos/1741969744060-videoplayback%20%287%29.mp4.mp4",
//             profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
//             username: "Alice",
//             time: "10",
//           },
//           {
//               type: "video",
//               url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970346/socialMedia/videos/1741970329945-videoplayback%20%286%29.mp4.mp4",
//               profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
//               username: "Alice",
//               time: "10",
//             },
//             {
//               type: "video",
//               url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970445/socialMedia/videos/1741970433641-videoplayback%20%284%29.mp4.mp4",
//               profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
//               username: "Alice",
//               time: "10",
//             },
            
//       ];

//     const [thumbnails, setThumbnails] = useState({});
    
//     const extractThumbnail = (videoURL, index) => {
//         console.log (videoURL);
//         const video = document.createElement("video");
//         video.src = videoURL;
//         video.crossOrigin = "anonymous"; // Prevents CORS issues
//         video.preload = "metadata"; // Load only metadata, not the full video
//         video.muted = true; // Prevents autoplay issues in some browsers
      
//         video.addEventListener("loadedmetadata", () => {
//           video.currentTime = Math.min(15, video.duration / 2); // Seek to a valid frame
//         });
      
//         video.addEventListener("seeked", () => {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");
      
//           // Use full resolution
//           canvas.width = video.videoWidth;
//           canvas.height = video.videoHeight;
      
//           ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
//           setThumbnails((prev) => ({
//             ...prev,
//             [index]: canvas.toDataURL("image/png"),
//           }));
//         });
      
//         video.load(); // Ensures metadata loads before seeking
//       };
      
    
//       useEffect (() => {
//         stories?.forEach((story, index) => {
//           if (story) {
//             extractThumbnail(story?.url, index);
//           }
//         });
//       }, [storyState]);

//     return (
//         <>
//             {/* <DisplayStory open={isDialogOpen} setOpen={setDialogOpen} index={idx}/> */}
//             {showStories && <StoryViewer stories={stories} currentIndex={0} onClose={() => setShowStories(false)} />}
//             <ul className="flex items-center gap-2">
//                 {stories?.map((story, index) => (
//                     <li key={index} className="relative flex items-center space-y-2 hover:cursor-pointer" onClick={() => {
//                         setIdx(index); setShowStories(true)}}>
//                          <img className="w-[7rem] h-[10rem] rounded-lg object-cover " src={thumbnails[index]} alt="image"/>
//                          <div className="absolute bottom-1 left-2 flex items-center gap-[0.5rem]">
//                             <img src={story.profile} className={` rounded-full w-4 h-4 border-2 border-[${_COLOR.buttons}]`} alt="user" />
//                             <h2 className="text-white text-xs">{story.username}</h2>
//                          </div>
//                     </li>
//                 ))}
//             </ul>
//         </>
//     )
// }

// export default Stories;

import { useEffect, useState } from "react";
import StoryViewer from "./StoryViewer";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

function Stories () {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [showStories, setShowStories] = useState(false);
    const [idx, setIdx] = useState(-1);

    const [thumbnails, setThumbnails] = useState({});
    const [page, setPage] = useState(0); // Track the current page

    const stories = [
              {
                type: "video",
                url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741969749/socialMedia/videos/1741969744060-videoplayback%20%287%29.mp4.mp4",
                profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                username: "Alice",
                time: "10",
              },
              {
                  type: "video",
                  url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970346/socialMedia/videos/1741970329945-videoplayback%20%286%29.mp4.mp4",
                  profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                  username: "Alice",
                  time: "10",
                },
                {
                  type: "video",
                  url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970445/socialMedia/videos/1741970433641-videoplayback%20%284%29.mp4.mp4",
                  profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                  username: "Alice",
                  time: "10",
                },
                {
                  type: "video",
                  url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741969749/socialMedia/videos/1741969744060-videoplayback%20%287%29.mp4.mp4",
                  profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                  username: "Alice",
                  time: "10",
                },
                {
                    type: "video",
                    url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970346/socialMedia/videos/1741970329945-videoplayback%20%286%29.mp4.mp4",
                    profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                    username: "Alice",
                    time: "10",
                  },
                  {
                    type: "video",
                    url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970445/socialMedia/videos/1741970433641-videoplayback%20%284%29.mp4.mp4",
                    profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                    username: "Alice",
                    time: "10",
                  },
                  {
                      type: "video",
                      url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970346/socialMedia/videos/1741970329945-videoplayback%20%286%29.mp4.mp4",
                      profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                      username: "Alice",
                      time: "10",
                    },
                    {
                      type: "video",
                      url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970445/socialMedia/videos/1741970433641-videoplayback%20%284%29.mp4.mp4",
                      profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                      username: "Alice",
                      time: "10",
                    },
                    {
                      type: "video",
                      url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741969749/socialMedia/videos/1741969744060-videoplayback%20%287%29.mp4.mp4",
                      profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                      username: "Alice",
                      time: "10",
                    },
                    {
                        type: "video",
                        url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970346/socialMedia/videos/1741970329945-videoplayback%20%286%29.mp4.mp4",
                        profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                        username: "Alice",
                        time: "10",
                      },
                      {
                        type: "video",
                        url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970445/socialMedia/videos/1741970433641-videoplayback%20%284%29.mp4.mp4",
                        profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                        username: "Alice",
                        time: "10",
                      },{
                        type: "video",
                        url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741969749/socialMedia/videos/1741969744060-videoplayback%20%287%29.mp4.mp4",
                        profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                        username: "Alice",
                        time: "10",
                      },
                      {
                          type: "video",
                          url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970346/socialMedia/videos/1741970329945-videoplayback%20%286%29.mp4.mp4",
                          profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                          username: "Alice",
                          time: "10",
                        },
                        {
                          type: "video",
                          url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970445/socialMedia/videos/1741970433641-videoplayback%20%284%29.mp4.mp4",
                          profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                          username: "Alice",
                          time: "10",
                        },
                        {
                          type: "video",
                          url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741969749/socialMedia/videos/1741969744060-videoplayback%20%287%29.mp4.mp4",
                          profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                          username: "Alice",
                          time: "10",
                        },
                        {
                            type: "video",
                            url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970346/socialMedia/videos/1741970329945-videoplayback%20%286%29.mp4.mp4",
                            profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                            username: "Alice",
                            time: "10",
                          },
                          {
                            type: "video",
                            url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1741970445/socialMedia/videos/1741970433641-videoplayback%20%284%29.mp4.mp4",
                            profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                            username: "Alice",
                            time: "10",
                          },
                  
            ];

    const extractThumbnail = (videoURL, index) => {
        const video = document.createElement("video");
        video.src = videoURL;
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true;

        video.addEventListener("loadedmetadata", () => {
            video.currentTime = Math.min(15, video.duration / 2);
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            setThumbnails((prev) => ({
                ...prev,
                [index]: canvas.toDataURL("image/png"),
            }));
        });

        video.load();
    };

    useEffect(() => {
        stories?.forEach((story, index) => {
            if (story) {
                extractThumbnail(story?.url, index);
            }
        });
    }, []);

    // Paginated Stories
    const storiesPerPage = 6;
    const paginatedStories = stories.slice(page * storiesPerPage, (page + 1) * storiesPerPage);

    return (
        <>
            {showStories && (
                <StoryViewer 
                    stories={stories} 
                    currentIndex={0} 
                    onClose={() => setShowStories(false)} 
                />
            )}

            <div className="flex items-center gap-2">
                {page > 0 && (
                    <IoIosArrowBack
                      className="w-[1rem] h-[1rem] text-white rounded-md hover:cursor-pointer" 
                        onClick={() => setPage(page - 1)} />
                )}

                <ul className="flex items-center gap-2">
                    {paginatedStories.map((story, index) => (
                        <li 
                            key={index} 
                            className="relative flex items-center space-y-2 hover:cursor-pointer"
                            onClick={() => {
                                setIdx(index + page * storiesPerPage); 
                                setShowStories(true);
                            }}
                        >
                            <img 
                                className="w-[7rem] h-[10rem] rounded-lg object-cover" 
                                src={thumbnails[index + page * storiesPerPage]} 
                                alt="image"
                            />
                            <div className="absolute bottom-1 left-2 flex items-center gap-[0.5rem]">
                                <img 
                                    src={story.profile} 
                                    className={`rounded-full w-4 h-4 border-2 border-[${_COLOR.buttons}]`} 
                                    alt="user" 
                                />
                                <h2 className="text-white text-xs font-bold">{story.username}</h2>
                            </div>
                        </li>
                    ))}
                </ul>

                {stories.length > (page + 1) * storiesPerPage && (
                    <IoIosArrowForward 
                        className="w-[1rem] h-[1rem] text-white rounded-md hover:cursor-pointer"
                        onClick={() => setPage(page + 1)} />
                )}
            </div>
        </>
    )
}

export default Stories;
