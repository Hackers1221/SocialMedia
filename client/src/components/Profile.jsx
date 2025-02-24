import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import PostCard from './PostCard';
import usePosts from '../hooks/usePosts';
import { followUser, getUserByUsername } from '../redux/Slices/auth.slice';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const authState = useSelector ((state) => state.auth);

  const [creator, setCreator] = useState (null);
  const [follow, setFollow] = useState(false);
  const [countFollowers, setCountFollowers] = useState(0);
  const [countFollowing, setCountFollowing] = useState(0);

  const dispatch = useDispatch ();
  const { username } = useParams();
  const [postState] = usePosts ();

  useEffect(() => {
    async function getUser() {
      const user = await dispatch(getUserByUsername(username));
      if (!user.payload) {
        toast.error("Something went wrong");
      } else {
        const userData = user.payload?.data?.userDetails;
        setCreator(userData);
        setFollow(authState?.data?.following?.includes(userData?._id));
        console.log(userData)
        setCountFollowers(userData?.follower?.length || 0);
        setCountFollowing(userData?.following?.length || 0);
      }
    }
    getUser();
  }, [username, dispatch, authState]);

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
    <div className={`fixed top-[10rem] md:top-[1rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[97vh] flex flex-col flex-grow overflow-y-auto`}>
        <div className={`mb-4 w-full bg-[${_COLOR.less_light}] px-4 pt-4`}>
            <div className={`flex items-center gap-4 `}>
              <Avatar url={creator?.image || "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"} size={'lg'}/>
              <div>
                <h2 className={`font-bold text-xl text-[${_COLOR.lightest}]`}>{creator?.name}</h2>
                <h2 className={`text-lg  text-[${_COLOR.more_light}]`}>{creator?.email}</h2>
                <div className={`flex gap-4`}>
                  <h2 className={`text-sm text-[${_COLOR.lightest}]`}>{countFollowers} Followers</h2>
                  <h2 className={`text-sm text-[${_COLOR.lightest}]`}>{countFollowing} Following</h2>
                </div>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={toggleFollow}>{follow ? "Unfollow" : "Follow"}</button>
              </div>
            </div>
            <div className={`w-full flex justify-evenly mt-4 pb-4`}>
              <div className={`flex gap-2 items-center hover:cursor-pointer  text-[${_COLOR.lightest}]`}>
                <i className="fa-solid fa-image"></i>
                <h2>Posts</h2>
              </div>
              <div className={`flex gap-2 items-center hover:cursor-pointer  text-[${_COLOR.lightest}]`}>
                <i className="fa-solid fa-film text-lg mr-2"></i> 
                <h2>Shorts</h2>
              </div>
              <div className={`flex gap-2 items-center hover:cursor-pointer text-[${_COLOR.lightest}]`}>
                <i className="fa-solid fa-circle-info"></i>
                <h2>About</h2>
              </div>
            </div>
        </div>
        <div className="w-full h-screen">
            {postState.postList.length > 0 && postState?.postList?.map((post, key) => (
                <PostCard post={post} key={key}/>
            ))}
        </div>
    </div>
  );
};

export default Profile;
