import { useEffect, useState } from "react";
import StoryViewer from "./StoryViewer";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

function Stories () {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [showStories, setShowStories] = useState(false);
  const [idx, setIdx] = useState(-1);
  const [thumbnails, setThumbnails] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);


    const stories = [
              {
                type: "video",
                url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742454895/socialMedia/videos/1742454883283-videoplayback.mp4.mp4",
                profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                username: "Alice",
                time: "10",
              },
              {
                  type: "video",
                  url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742020247/socialMedia/videos/1742020225596-videoplayback%20%287%29.mp4.mp4",
                  profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                  username: "Alice",
                  time: "10",
                },
                {
                  type: "video",
                  url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742454895/socialMedia/videos/1742454883283-videoplayback.mp4.mp4",
                  profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                  username: "Alice",
                  time: "10",
                },
                {
                    type: "video",
                    url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742020247/socialMedia/videos/1742020225596-videoplayback%20%287%29.mp4.mp4",
                    profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                    username: "Alice",
                    time: "10",
                  },
                  {
                    type: "video",
                    url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742454895/socialMedia/videos/1742454883283-videoplayback.mp4.mp4",
                    profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                    username: "Alice",
                    time: "10",
                  },
                  {
                      type: "video",
                      url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742020247/socialMedia/videos/1742020225596-videoplayback%20%287%29.mp4.mp4",
                      profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                      username: "Alice",
                      time: "10",
                    },
                    {
                      type: "video",
                      url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742454895/socialMedia/videos/1742454883283-videoplayback.mp4.mp4",
                      profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                      username: "Alice",
                      time: "10",
                    },
                    {
                        type: "video",
                        url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742020247/socialMedia/videos/1742020225596-videoplayback%20%287%29.mp4.mp4",
                        profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                        username: "Alice",
                        time: "10",
                      },
                      {
                        type: "video",
                        url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742454895/socialMedia/videos/1742454883283-videoplayback.mp4.mp4",
                        profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                        username: "Alice",
                        time: "10",
                      },
                      {
                          type: "video",
                          url: "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1742020247/socialMedia/videos/1742020225596-videoplayback%20%287%29.mp4.mp4",
                          profile: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741965647/socialMedia/images/1741965642876-profile.webp.webp",
                          username: "Alice",
                          time: "10",
                        }
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
      
                  setThumbnails((prev) => {
                      const newThumbnails = { ...prev, [index]: canvas.toDataURL("image/png") };
                      if (Object.keys(newThumbnails).length === stories.length) {
                          setLoading(false);
                      }
                      return newThumbnails;
                  });
              });
      
              video.load();
          };
      
          useEffect(() => {
              stories.forEach((story, index) => {
                  if (story) {
                      extractThumbnail(story.url, index);
                  }
              });
          }, []);
      
          const storiesPerPage = 6;
          const paginatedStories = stories.slice(page * storiesPerPage, (page + 1) * storiesPerPage);
      
          return (
              <>
                  {showStories && (
                      <StoryViewer 
                          stories={stories} 
                          currentIndex={idx} 
                          onClose={() => setShowStories(false)} 
                      />
                  )}
      
                  <div className="flex items-center gap-2">
                      {page > 0 && (
                          <IoIosArrowBack 
                              className={`w-[1rem] h-[1rem] text-[var(--text)] rounded-md hover:cursor-pointer`} 
                              onClick={() => setPage(page - 1)} 
                          />
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
                                  {loading || !thumbnails[index + page * storiesPerPage] ? (
                                      <div className="w-[7rem] h-[10rem] bg-gray-500 animate-pulse rounded-lg"></div>
                                  ) : (
                                      <img 
                                          className="w-[7rem] h-[10rem] rounded-lg object-cover" 
                                          src={thumbnails[index + page * storiesPerPage]} 
                                          alt="thumbnail" 
                                      />
                                  )}
                                  <div className="absolute bottom-1 left-2 flex items-center gap-[0.5rem]">
                                      <img 
                                          src={story.profile} 
                                          className="rounded-full w-4 h-4 border-2 border-white" 
                                          alt="user" 
                                      />
                                      <h2 className="text-white text-xs font-bold">{story.username}</h2>
                                  </div>
                              </li>
                          ))}
                      </ul>
      
                      {stories.length > (page + 1) * storiesPerPage && (
                          <IoIosArrowForward 
                              className={`w-[1rem] h-[1rem] text-[var(--text)] rounded-md hover:cursor-pointer`}
                              onClick={() => setPage(page + 1)} 
                          />
                      )}
                  </div>
              </>
          );
      }
      
      export default Stories;
      