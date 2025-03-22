import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../../components/Avatar';
import PostCard from '../../components/PostCard';
import usePosts from '../../hooks/usePosts';
import { followUser, getUserByUsername } from '../../redux/Slices/auth.slice';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
import SkeletonPostCard from '../../components/SkeletonPostCard';
import ProfileInfo from '../../components/ProfileInfo';
import { IoMdPulse } from "react-icons/io";
import useVerse from '../../hooks/useVerse';
import VerseCard from '../../components/VerseCard'

const Profile = () => {
  const authState = useSelector ((state) => state.auth);
  const [postState] = usePosts ();
  const [verseState] = useVerse ();

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
        {!isLoading && <div className={`mb-4 w-full bg-[var(--card)] border border-[var(--border)]`}>
          <div className={`flex flex-col items-center gap-4 w-full border-b border-[var(--border)] pb-4`}>
            <div className='w-full relative'>
              <img src={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} className='w-full h-[12rem] object-cover'/>
                <div className='flex justify-between items-end w-full absolute bottom-[-4rem] px-4'>
                <Avatar url={creator?.image?.url || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} size={'lg'} border={"true"}/>
                <div className='flex gap-4'>
                  {!check && (
                    <button className={`mt-2 px-4 py-2 border rounded-full bg-[var(--buttons)] text-[var(--card)]`} onClick={toggleFollow}>
                      {follow ? "Following" : "Follow"}
                    </button>
                  )}
                  {check && (
                    <Link to={"/settings"} className={`mt-2 px-4 py-2 border bg-[var(--buttons)] text-[var(--card)] rounded-full`}>
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
                <div className='flex gap-2 items-center'>
                  <i className="fa-regular fa-calendar-days text-white"></i>
                  <h2 className={`text-sm font-bold text-[var(--text)]`}><span className='font-extralight'>Joined</span> {joining}</h2>
                </div>
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

            <div
              className={`flex gap-2 w-full justify-center py-4 px-4 items-center hover:cursor-pointer 
                          ${selected === 'Verse' ? `text-[var(--buttons)] bg-[var(--topic)]` : `text-[var(--text)]`}`}
              onClick={() => setSelected('Verse')}
            >
              <IoMdPulse className="mr-2" />
              <h2 className='font-bold'>Verse</h2>
            </div>
          </div>
        </div>}

        {selected === 'Posts' && (postState?.postList?.length > 0 ?
        <div>
          {isLoading && <SkeletonPostCard />}
          <div className="w-full h-screen">
            {!isLoading && postState?.postList?.map((post, key) => (
                <PostCard post={post} key={key}/>
              ))}
          </div>
        )
        </div> :
        <h2 className={`w-full text-center font-extralight text-[var(--text)]`}>No posts to show</h2>)}

        {selected === 'Verse' && (verseState?.verseList?.length > 0 ? 
        <div>
          {isLoading && <SkeletonPostCard />}
          <div className="w-full h-screen">
            {!isLoading && verseState?.verseList?.map((verse, key) => (
                <VerseCard verse={verse} key={key}/>
              ))}
          </div>
        )
        </div> : 
        <h2 className={`w-full text-center font-extralight text-[var(--text)]`}>No verse to show</h2>)}
      </div>
  )
};

export default Profile;
