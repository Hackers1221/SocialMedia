import { useDispatch, useSelector } from 'react-redux'
import PostCard from "../../components/PostCard";
import { useEffect, useState, useRef, useCallback } from "react"; // Added useRef, useCallback
import { filterPostsByFollowing, filterPostsByLiked, getAllPosts, getSavedPost } from "../../redux/Slices/post.slice";
import SkeletonPostCard from "../../components/SkeletonPostCard";
import { getTopUsers } from "../../redux/Slices/auth.slice";
import { Link, useSearchParams } from "react-router-dom";
import { showToast } from '../../redux/Slices/toast.slice';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function PostPage() {
    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.post);

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const options = ["All", "Following", "Liked"];
    const type = searchParams.get("type") || "All";

    // 2. The Infinite Scroll "Observer"
    const observer = useRef();
    const lastPostElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            // Only fetch if intersecting AND we know there is more data
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    // Initial Data (Saved Posts & Top Users) - Run once
    useEffect(() => {
        getSavedPosts();
        getTopUser();
    }, []);

    // 3. Reset Page when filter changes (All -> Liked, etc.)
    useEffect(() => {
        setPage(1);
    }, [type]);

    // 4. Fetch Posts whenever 'type' or 'page' changes
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                let actionResult;
                
                // Dispatch the action
                if (type === "Liked") {
                    actionResult = await dispatch(filterPostsByLiked({ id: authState?.data?._id, page, limit: 10 }));
                } else if (type === "Following") {
                    actionResult = await dispatch(filterPostsByFollowing({ following: authState?.data?.following, page, limit: 10 }));
                } else {
                    actionResult = await dispatch(getAllPosts({ page, limit: 10 }));
                }

                // CRITICAL CHECK: Did we get data back?
                const fetchedPosts = actionResult?.payload?.postsdata?.posts;
                
                if (!fetchedPosts || fetchedPosts.length === 0) {
                    setHasMore(false); // STOP THE OBSERVER
                }
                
            } catch (error) {
                dispatch(showToast({ message: error.message, type: 'error' }));
            } finally {
                setIsLoading(false);
            }
        };

        // Reset hasMore when filter changes
        if (page === 1) setHasMore(true);

        fetchPosts();
    }, [type, page, dispatch]); // Dependencies updated

    async function getSavedPosts() {
        try {
            await dispatch(getSavedPost(authState?.data?._id));
        } catch (error) {
            dispatch(showToast({ message: error.message, type: 'error' }));
        }
    }

    async function getTopUser() {
        try {
            await dispatch(getTopUsers());
        } catch (error) {
            dispatch(showToast({ message: error.message, type: 'error' }));
        }
    }

    return (
        <>
            <div className="fixed top-[4rem] md:top-[1rem] md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh] flex flex-col flex-grow overflow-y-auto">
                
                {/* --- TOP USERS SECTION (KEPT EXACTLY AS IS) --- */}
                <h2 className={`text-[var(--heading)] font-bold text-[1.5rem]`}>
                    Top Personalities
                </h2>

                {isLoading && page === 1 && <div className='flex gap-8 my-4'>
                    <Skeleton height={120} width={100} />
                    <Skeleton height={120} width={100} />
                </div>}

                {/* Only hide top users if loading page 1 initially, otherwise keep them visible */}
                {(!isLoading || page > 1) && <div className="w-full mb-4 overflow-x-auto flex gap-4 snap-x snap-mandatory px-4 py-2 min-h-[10rem]">
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
                                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg" />
                            </div>

                            <div className='absolute right-1 flex gap-2 items-center'>
                                <h2 className='text-white text-center font-bold text-sm'>{user.username}</h2>
                            </div>
                        </Link>
                    ))}
                </div>}
                {/* --- END TOP USERS SECTION --- */}


                <div className="flex justify-between items-center">
                    <h2 className={`text-[var(--heading)] font-bold text-[1.5rem]`}>Recent Post</h2>
                    <div className="flex gap-4">
                        {options?.map((option, index) => {
                            return (<h2
                                key={index}
                                className={`${type === option ? `text-[var(--heading)]` : `text-gray-400` // Default color
                                    } font-bold text-[1rem] hover:cursor-pointer`}
                                onClick={() => setSearchParams({ type: option })}>{option}</h2>)
                        })}
                    </div>
                </div>

                {/* Scrollable Post List */}
                <div className="pt-4 w-full h-screen pb-20"> {/* Added pb-20 for space at bottom */}
                    
                    {postState?.postList?.length > 0 ? postState?.postList?.map((post, index) => {
                        // 5. Check if it's the last element to attach the ref
                        if (postState.postList.length === index + 1) {
                            return (
                                <div ref={lastPostElementRef} key={post._id || index}>
                                    <PostCard post={post} index={index + 1} />
                                </div>
                            )
                        } else {
                            return (
                                <div key={post._id || index}>
                                    <PostCard post={post} index={index + 1} />
                                </div>
                            )
                        }
                    }) : (!isLoading && <h2 className={`w-full text-center font-extralight text-[var(--text)]`}>No posts to show</h2>)}

                    {/* Show Skeleton ONLY if loading */}
                    {isLoading && <SkeletonPostCard />}
                </div>
            </div>
        </>
    )
}
export default PostPage;