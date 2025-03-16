import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import PostCard from './PostCard';
import usePosts from '../hooks/usePosts';
import { followUser, getUserByUsername } from '../redux/Slices/auth.slice';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
import SkeletonPostCard from './SkeletonPostCard';
import ProfileInfo from './ProfileInfo';
import { IoMdPulse } from "react-icons/io";

const Profile = () => {
  const authState = useSelector ((state) => state.auth);
  const [creator, setCreator] = useState (null);
  const [follow, setFollow] = useState(false);
  const [countFollowers, setCountFollowers] = useState(0);
  const [countFollowing, setCountFollowing] = useState(0);
  const [check,setCheck] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  const [selected, setSelected] = useState ('Posts');
  const [joining, setJoining] = useState ("");

  const dispatch = useDispatch ();
  const { username } = useParams();
  const [postState] = usePosts ();

  useEffect(() => {
    setIsLoading(true); 
    dispatch(getUserByUsername(username))
      .then((user) => {
        if (!user.payload) {
          toast.error("Something went wrong");
        } else {
          const userData = user.payload?.data?.userDetails;
          setCreator(userData);
          setFollow(authState?.data?.following?.includes(userData?._id));
          setCountFollowers(userData?.follower?.length || 0);
          setCountFollowing(userData?.following?.length || 0);
          setCheck(userData._id === authState.data._id);

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
  


  const toggleFollow = async () => {
    if (!creator) return;
    const response = await dispatch(followUser({
      id1: authState?.data?._id,
      id: creator._id,
    }));
    if (response.payload) {
      setFollow((prev) => !prev);
      setCountFollowers((prev) => (follow ? prev - 1 : prev + 1));
    }
  };

  return (
      <div className={`fixed top-[1rem] md:left-[20rem] left-[4rem] w-[85%] md:w-[50%] h-[97vh] flex flex-col flex-grow overflow-y-auto`}>
        {isLoading && <ProfileInfo />}
        {!isLoading && <div className={`mb-4 w-full bg-black/20`}>
          <div className={`flex flex-col items-center gap-4 w-full border-b pb-4`}>
            <div className='w-full relative'>
              <img src={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} className='w-full h-[12rem] object-cover'/>
                <div className='flex justify-between items-end w-full absolute bottom-[-4rem] px-4'>
                <Avatar url={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} size={'lg'} border={"true"}/>
                <div className='flex gap-4'>
                  {!check && (
                    <button className={`mt-2 px-4 py-2 bg-transparent border text-white rounded-full hover:bg-[${_COLOR.lightest}] hover:text-black`} onClick={toggleFollow}>
                      {follow ? "Following" : "Follow"}
                    </button>
                  )}
                  {check && (
                    <Link to={"/settings"} className={`mt-2 px-4 py-2 bg-transparent border hover:bg-[${_COLOR.lightest}] hover:text-black text-white rounded-full`}>
                      Edit profile
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className='w-full mt-16 px-4'>
              <h2 className={`font-bold text-xl text-[${_COLOR.lightest}]`}>{creator?.name}</h2>
              <h2 className={`font-extralight text-sm text-[${_COLOR.more_light}] mb-2`}>@{creator?.username}</h2>
              {creator?.about && <h2 className={`font-extralight text-md text-[${_COLOR.lightest}] mb-4 cursive`}>{creator?.about}</h2>}
              <div className={`flex justify-between gap-4`}>
                <div className='flex gap-4'>
                  <h2 className={`text-sm font-bold text-[${_COLOR.lightest}]`}>{countFollowers} <span className='font-extralight'>Followers</span></h2>
                  <h2 className={`text-sm font-bold text-[${_COLOR.lightest}]`}>{countFollowing} <span className='font-extralight'>Following</span></h2>
                </div>
                <div className='flex gap-2 items-center'>
                  <i className="fa-regular fa-calendar-days text-white"></i>
                  <h2 className={`text-sm font-bold text-[${_COLOR.lightest}]`}><span className='font-extralight'>Joined</span> {joining}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className={`w-full flex justify-evenly mt-4 pb-4`}>
            <div className={`flex gap-2 pb-4 px-4 items-center hover:cursor-pointer text-[${_COLOR.lightest}] ${selected === 'Posts' ? 'border-b-[2px]' : ''}`} onClick={() => setSelected ('Posts')}>
              <i className="fa-solid fa-image"></i>
              <h2>Posts</h2>
            </div>
            <div className={`flex gap-2 pb-4 px-4 items-center hover:cursor-pointer text-[${_COLOR.lightest}] ${selected === 'Pulse' ? 'border-b-[2px]' : ''}`} onClick={() => setSelected ('Pulse')}>
              <IoMdPulse className='mr-2'/>
              <h2>Pulse</h2>
            </div>
          </div>
        </div>}

        {selected === 'Posts' && 
        <div>
          {isLoading && <SkeletonPostCard />}
          <div className="w-full h-screen">
            {!isLoading && postState?.postList?.map((post, key) => (
                <PostCard post={post} key={key}/>
              ))}
          </div>
        )
        </div>}

        {selected === 'About' && 
        <div className={`border border-[${_COLOR.medium}] p-4 bg-transparent rounded-md`}>
          <p className={`text-[${_COLOR.more_light}]`}>
            {creator?.about}
          </p>
        </div>}
      </div>
  )
};

export default Profile;
