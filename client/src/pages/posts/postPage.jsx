import { useDispatch, useSelector } from 'react-redux'
import PostCard from "../../components/PostCard";
import { useEffect, useState } from "react";
import { filterPostsByFollowing, filterPostsByLiked, getAllPosts, getSavedPost } from "../../redux/Slices/post.slice";
import SkeletonPostCard from "../../components/SkeletonPostCard";
import { getTopUsers } from "../../redux/Slices/auth.slice";
import { Link, useSearchParams } from "react-router-dom";
import { showToast } from '../../redux/Slices/toast.slice';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function PostPage() {
    const authState = useSelector ((state) => state.auth);
    const postState = useSelector ((state) => state.post);

    const dispatch = useDispatch ();

    const [isLoading, setIsLoading] = useState (false);
    const [selected, setSelected] = useState ("All");
    const [searchParams, setSearchParams] = useSearchParams ();

    const options = ["All", "Following", "Liked"]

    async function getSavedPosts () {
        setIsLoading(true);
        try {
            await dispatch(getSavedPost (authState?.data?._id));
        } catch (error) {
            dispatch (showToast ({ message: error.message, type: 'error' }));
        } finally {
            setIsLoading(false);
        }
    }

    async function getPosts () {
        setIsLoading(true);
        try {
            await dispatch (getAllPosts ());
        } catch (error) {
            dispatch (showToast ({ message: error.message, type: 'error' }));
        } finally {
            setIsLoading(false);
        }
    }

    async function getTopUser () {
        setIsLoading (true) ;
        try {
            await dispatch (getTopUsers ());
        } catch (error) {
            dispatch (showToast ({ message: error.message, type: 'error' }));
        } finally {
            setIsLoading (false);
        }
    }

    async function optionChange (option) {
        if (option === "Liked") await dispatch ( filterPostsByLiked ({id : authState?.data?._id}));
        if (option === "Following") await dispatch( filterPostsByFollowing ({following : authState?.data?.following}));
        if (option === "All") await dispatch (getAllPosts ());
    }

    const type = searchParams.get("type") || "All";

    useEffect (() => {
        optionChange (type);
    }, [type])

    useEffect (() => {
        optionChange (type);
        getPosts ();
        getSavedPosts ();
        getTopUser ();
    }, [])

    return (
        <>
            <div className="fixed top-[4rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh] flex flex-col flex-grow overflow-y-auto">
                {/* Header */}
                <h2 className={`text-[var(--heading)] font-bold text-[1.5rem]`}>
                    Top Personalities
                </h2>

                {isLoading && <div className='flex gap-8 my-4'>
                    <Skeleton height={120} width={100}/>
                    <Skeleton height={120} width={100}/>
                </div>}

                {!isLoading && <div className="w-full mb-4 overflow-x-auto flex gap-4 snap-x snap-mandatory px-4 py-2 min-h-[10rem]">
                    {authState.topUsers.map((user, index) => (
                        <Link to={`/profile/${user?.username}`} key={user._id} className="relative flex-shrink-0 snap-start flex items-end gap-2 hover:cursor-pointer">
                            <h2 className="number text-[var(--heading)] text-[3rem] text-end">{index + 1}</h2>
                            <div className="relative w-[7rem] h-[8rem] rounded-lg overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/70 to-transparent rounded-t-lg" />
                                <img
                                    src={user.image?.url}
                                    alt="user avatar"
                                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-150"
                                />

                                {/* Gradient dark overlay at bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg" />
                            </div>

                            <div className='absolute right-1 flex gap-2 items-center'>
                                <h2 className='text-white text-center font-bold text-sm'>{user.username}</h2>
                            </div>
                        </Link>
                    ))}
                </div>}




                <div className="flex justify-between items-center">
                    <h2 className={`text-[var(--heading)] font-bold text-[1.5rem]`}>Recent Post</h2>
                    <div className="flex gap-4">
                        {options?.map ((option, index) => {
                           return (<h2 
                            key={index} 
                            className={`${ type === option ? `text-[var(--heading)]` : `text-gray-400` // Default color
                            } font-bold text-[1rem] hover:cursor-pointer`} 
                            onClick={() => setSearchParams({ type: option })}>{option}</h2>)
                        })}
                    </div>
                </div>

                {/* Scrollable Post List */}
                {isLoading && <SkeletonPostCard />}
                {!isLoading && <div className="pt-4 w-full h-screen">
                    {postState?.postList?.length > 0 ? postState?.postList?.map((post, index) => (
                        <div key={index}>
                            <PostCard post={post} index={index + 1}/>
                        </div>
                    )) : <h2 className={`w-full text-center font-extralight text-[var(--text)]`}>No posts to show</h2>}
                </div>}
            </div>
        </>
    )
}
export default PostPage;