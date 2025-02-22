import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import PostCard from './PostCard';
import { getAllPosts } from '../redux/Slices/post.slice';

const Profile = () => {
  const authState = useSelector ((state) => state.auth);
  const postState = useSelector ((state) => state.post);

  const dispatch = useDispatch ();

    async function getPosts () {
        const res = await dispatch (getAllPosts());
        if (!res) toast.error ("Something went wrong");
    }

    useEffect (() => {
        getPosts ();
    }, [])

  return (
    <div className={`fixed top-[10rem] md:top-[5rem] md:top-[4rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[90vh] overflow-y-auto`}>
        <div className={`mb-4 w-full bg-[${_COLOR.less_light}] px-4 pt-4`}>
            <div className={`flex items-center gap-4 `}>
              <Avatar url={authState?.data?.image} size={'lg'}/>
              <div>
                <h2 className={`font-bold text-xl`}>{authState?.data?.name}</h2>
                <h2 className={`text-lg text-[${_COLOR.medium}]`}>{authState?.data?.email}</h2>
                <div className={`flex gap-4`}>
                  <h2 className={`text-sm`}>{authState?.data?.following.length} Followers</h2>
                  <h2 className={`text-sm`}>{authState?.data?.following.length} Following</h2>
                </div>
              </div>
            </div>
            <div className={`w-full flex justify-evenly mt-4 pb-4`}>
              <div className={`flex gap-2 items-center hover:cursor-pointer`}>
                <i class="fa-solid fa-image"></i>
                <h2>Posts</h2>
              </div>
              <div className={`flex gap-2 items-center hover:cursor-pointer`}>
                <i className="fa-solid fa-film text-lg mr-2"></i> 
                <h2>Shorts</h2>
              </div>
              <div className={`flex gap-2 items-center hover:cursor-pointer`}>
                <i class="fa-solid fa-circle-info"></i>
                <h2>About</h2>
              </div>
            </div>
        </div>
        <div className="w-full h-screen">
            {postState?.downloadedPosts?.map((post, key) => (
                <PostCard post={post} key={key}/>
            ))}
        </div>
    </div>
  );
};

export default Profile;
