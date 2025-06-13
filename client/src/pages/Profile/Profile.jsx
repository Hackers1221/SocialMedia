import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../../components/Avatar';
import PostCard from '../../components/PostCard';
import usePosts from '../../hooks/usePosts';
import { followRequest, followUser, getFollowerDetails, getUserByUsername } from '../../redux/Slices/auth.slice';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
import SkeletonPostCard from '../../components/SkeletonPostCard';
import ProfileInfo from '../../components/ProfileInfo';
import { IoMdPulse } from "react-icons/io";
import { filterPostsByUser } from '../../redux/Slices/post.slice';
import ImagePreview from '../../components/ImagePreview';
import { getPulseByUserId } from '../../redux/Slices/pulse.slice';
import usePulse from '../../hooks/usePulse';

const Profile = () => {
  const authState = useSelector ((state) => state.auth);
  const [postState] = usePosts ();
  const [pulseState] = usePulse ();

  const navigate = useNavigate ();

  const [creator, setCreator] = useState (null);
  const [pending, setPending] = useState(false);
  const [follow, setFollow] = useState(false);
  const [countFollowers, setCountFollowers] = useState(0);
  const [countFollowing, setCountFollowing] = useState(0);
  const [check,setCheck] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  const [selected, setSelected] = useState ('Posts');
  const [joining, setJoining] = useState ("");
  const [isOpen, setOpen] = useState (false);
  const [image, setImage] = useState ();
  const [followers, setFollowers] = useState ([]);
  const [pulseThumbnails, setPulseThumbnails] = useState({});


  const dispatch = useDispatch ();
  const { username } = useParams();

  async function getPosts (userId) {
    const res = await dispatch (filterPostsByUser ({id: userId}));
    await dispatch (getPulseByUserId (userId));
  }

  const getDetails = async() => {
        const response = await dispatch(getFollowerDetails (authState.data._id));
        setFollowers(response.payload?.data?.userdata);
    }

    const toggleFollow = async () => {
        if (!creator) return;
        const response = await dispatch(followUser({
          id1: authState?.data?._id,
          id: creator._id,
        }));
    
        if (response.payload) {
          setFollow(!follow);
          setCountFollowers(follow ? countFollowers - 1 : countFollowers + 1);
        }
      };
    
      const toggleFollowRequest = async () => {
        if (!creator) return;
        const response = await dispatch(followRequest({
          id1: authState?.data?._id,
          id: creator._id,
        }));
    
        if (response.payload) {
          setPending(!pending);
        }
      };

    const extractPulseThumbnail = (videoURL, index) => {
        const video = document.createElement("video");
        video.src = videoURL;
        video.crossOrigin = "anonymous"; // Prevents CORS issues
        video.preload = "metadata"; // Load only metadata, not the full video
        video.muted = true; // Prevents autoplay issues in some browsers

        video.addEventListener("loadedmetadata", () => {
            video.currentTime = Math.min(20, video.duration / 2); // Seek to a valid frame
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Use full resolution
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            setPulseThumbnails((prev) => ({
                ...prev,
                [index]: canvas.toDataURL("image/png"),
            }));
        });

        video.load(); // Ensures metadata loads before seeking
    };

    useEffect (() => {
        pulseState.pulseList?.forEach ((pulse, index) => {
            if (pulse?.video) {
                extractPulseThumbnail(pulse?.video, index);
            }
        })
    }, [pulseState.pulseList, username]);

    function handlePulseClick (index) {
        navigate ('/pulse', {state : { start: index, source: 'pulseList'}});
    }

  useEffect(() => {
    getDetails ();

    setIsLoading(true);
    dispatch(getUserByUsername(username))
      .then((user) => {
        if (!user.payload) {
          toast.error("Something went wrong");
        } else {
          const userData = user.payload?.data?.userDetails;
          getPosts(userData?._id);
          setCreator(userData);
          setCountFollowers(userData?.follower?.length || 0);
          setCountFollowing(userData?.following?.length || 0);
          setCheck(userData._id === authState.data._id);
          setImage(userData?.image?.url);

          const dateObj = new Date(userData?.createdAt);
          const date = dateObj.getDate();
          const monthName = dateObj.toLocaleString('default', { month: 'long' });
          setJoining(`${date} ${monthName}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [username]);

  useEffect(() => {
    if (creator && authState?.data?.following) {
      setFollow(authState.data.following.includes(creator._id));
      setPending(creator?.requests?.includes(authState?.data?._id));
    }
  }, [authState.data.following, creator]);

  return (
      <div className={`fixed top-[4rem] md:top-[1rem] md:left-[20rem] left-[1rem] w-[92%] md:w-[50%] h-[97vh] flex flex-col flex-grow overflow-y-auto`}>
        {isLoading && <ProfileInfo />}
        <ImagePreview isOpen={isOpen} setOpen={setOpen} url={image}/>
        {!isLoading && <div className={`mb-4 w-full bg-[var(--card)] border border-[var(--border)]`}>
          <div className={`flex flex-col items-center gap-4 w-full border-b border-[var(--border)] pb-4`}>
            <div className='w-full relative'>
              <img src={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} className='w-full h-[12rem] object-cover'/>
                <div className='flex justify-between items-end w-full absolute bottom-[-4rem] px-4'>
                <div onClick={() => setOpen (!isOpen)}>
                  <Avatar url={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} size={'lg'} border={"true"}/>
                </div>

                {/* Follow Button */}
                <div className="flex gap-4">
                  {!check ? (
                    follow ? (
                      <button
                        className="mt-2 px-4 py-2 rounded-full bg-[var(--buttons)] text-[var(--buttonText)]"
                        onClick={toggleFollow}
                      >
                        Following
                      </button>
                    ) : creator?.isPrivate ? (
                      <button
                        className={`mt-2 px-4 py-2 rounded-full bg-[var(--buttons)] text-[var(--buttonText)] ${pending ? "text-blue-500" : ""}`}
                        onClick={toggleFollowRequest}
                      >
                        {pending ? "Requested" : "Follow"}
                      </button>
                    ) : (
                      <button
                        className="mt-2 px-4 py-2 rounded-full bg-[var(--buttons)] text-[var(--buttonText)]"
                        onClick={toggleFollow}
                      >
                        Follow
                      </button>
                    )
                  ) : (
                    <Link
                      to="/settings"
                      className="mt-2 px-4 py-2 border bg-[var(--buttons)] text-[var(--card)] rounded-full"
                    >
                      Edit profile
                    </Link>
                  )}
                </div>

              </div>
            </div>
            <div className='w-full mt-16 px-4'>
              <h2 className={`font-bold text-xl text-[var(--text)]`}>{creator?.name}</h2>
              <h2 className={`font-semibold text-sm text-[var(--buttons)] mb-2`}>@{creator?.username}</h2>
              {creator?.about && <h2 className={` text-md text-[var(--text)] mb-4 cursive`}>{creator?.about}</h2>}
              <div className={`flex justify-between gap-4`}>
                <div className='flex gap-4'>
                  <h2 className={`text-sm font-bold text-[var(--text)]`}>{countFollowers} <span className='font-extralight'>Followers</span></h2>
                  <h2 className={`text-sm font-bold text-[var(--text)]`}>{countFollowing} <span className='font-extralight'>Following</span></h2>
                </div>
                {(!creator?.isPrivate || creator?._id === authState.data?._id) && <div className='flex gap-2 items-center'>
                  <i className="fa-regular fa-calendar-days text-white"></i>
                  <h2 className={`text-sm font-bold text-[var(--text)]`}><span className='font-extralight'>Joined</span> {joining}</h2>
                </div>}
              </div>
            </div>
          </div>
          <div className={`w-full flex justify-evenly`}>
          <div
              className={`flex gap-2 w-full justify-center py-4 px-4 items-center hover:cursor-pointer ${selected === 'Posts' ? `text-[var(--buttons)] bg-[var(--topic)]` : `text-[var(--text)]`}`}
              onClick={() => setSelected('Posts')}
            >
              <i className="fa-solid fa-image"></i>
              <h2 className='font-bold'>Posts</h2>
            </div>

            <div
              className={`flex gap-2 w-full justify-center py-4 px-4 items-center hover:cursor-pointer 
                          ${selected === 'Pulse' ? `text-[var(--buttons)] bg-[var(--topic)]` : `text-[var(--text)]`}`}
              onClick={() => setSelected('Pulse')}
            >
              <IoMdPulse className="mr-2" />
              <h2 className='font-bold'>Pulse</h2>
            </div>

            {/* <div
              className={`flex gap-2 w-full justify-center py-4 px-4 items-center hover:cursor-pointer 
                          ${selected === 'Verse' ? `text-[var(--buttons)] bg-[var(--topic)]` : `text-[var(--text)]`}`}
              onClick={() => setSelected('Verse')}
            >
              <IoMdPulse className="mr-2" />
              <h2 className='font-bold'>Verse</h2>
            </div> */}
          </div>
        </div>}

        {(creator?.isPrivate  && creator?._id !== authState.data?._id && !authState.data.following.includes (creator?._id)) && <h2 className='w-full text-center text-[var(--buttons)]'>This account is private</h2>}

        {(!creator?.isPrivate  || creator?._id === authState.data?._id || authState.data.following.includes (creator?._id)) && (
          <>
            {selected === "Posts" &&
              (postState?.postList?.length > 0 ? (
                <div>
                  {isLoading && <SkeletonPostCard />}
                  <div className="w-full h-screen">
                    {!isLoading &&
                      postState?.postList?.map((post, key) => (
                        <PostCard post={post} key={key} index={key + 1} list={"postList"} followers={followers} />
                      ))}
                  </div>
                </div>
              ) : (
                <h2 className="w-full text-center font-extralight text-[var(--text)]">
                  No posts to show
                </h2>
              ))}

            {selected === "Pulse" &&
              (pulseState?.pulseList?.length > 0 ? (
                <div>
                  {isLoading && <SkeletonPostCard />}
                  <div className="w-full h-screen columns-2 sm:columns-3 md:columns-4">
                    {!isLoading &&
                      pulseState?.pulseList?.map((pulse, index) => (
                        <div key={index} className="h-[20rem] flex flex-col justify-center rounded-lg hover:cursor-pointer" onClick={() => handlePulseClick (index)}>
                            <img
                                src={pulseThumbnails[index]}
                                className="rounded-lg shadow-md h-full w-full"
                            ></img>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <h2 className="w-full text-center font-extralight text-[var(--text)]">
                  No posts to show
                </h2>
              ))}

            {/* {selected === "Verse" &&
              (verseState?.verseList?.length > 0 ? (
                <div>
                  {isLoading && <SkeletonPostCard />}
                  <div className="w-full h-screen">
                    {!isLoading &&
                      verseState?.verseList?.map((verse, key) => (
                        <VerseCard verse={verse} key={key} />
                      ))}
                  </div>
                </div>
              ) : (
                <h2 className="w-full text-center font-extralight text-[var(--text)]">
                  No verse to show
                </h2>
              ))} */}
          </>
        )}

      </div>
  )
};

export default Profile;
