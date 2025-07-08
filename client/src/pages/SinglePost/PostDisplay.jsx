import { useEffect, useState } from "react";
import usePosts from "../../hooks/usePosts";
import { useDispatch } from "react-redux";
import { getPostById, getRelatedPosts } from "../../redux/Slices/post.slice";
import { useParams } from "react-router-dom";
import { showToast } from "../../redux/Slices/toast.slice";
import PostCard from "../../components/PostCard";
import SkeletonPostCard from "../../components/SkeletonPostCard";

function PostDisplay () {
    const { postId } = useParams();

    const dispatch = useDispatch();

    const [posts, setPosts] = useState([]);
    const [isLoading, setLoading] = useState(false);

    async function loadPosts() {
        setLoading(true);
        try {
            const res = await dispatch (getRelatedPosts (postId));

            const promises = res.payload.data.posts?.map((id) =>
                dispatch(getPostById(id))
            );
            const results = await Promise.all(promises);

            const newPosts = results
                .map((res) => res?.payload?.data?.postDetails)
                .filter(Boolean); // Filter out failed/null responses

            setPosts(newPosts);
        } catch (error) {
            dispatch(
                showToast({ message: "Could not load posts", type: "error" })
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (postId) loadPosts ();
    }, [postId]);
    
    return (
        <>
            <div className="fixed top-[4rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh] flex flex-col flex-grow overflow-y-auto">
                {isLoading && <SkeletonPostCard />}
                {!isLoading && <div className="pt-4 w-full h-screen">
                    {posts?.length > 0 ? posts?.map((post, index) => (
                        <div key={index}>
                            <PostCard post={post} index={index + 1}/>
                        </div>
                    )) : <h2 className={`w-full text-center font-extralight text-[var(--text)]`}>No posts to show</h2>}
                </div>}
            </div>
        </>
    )
}

export default PostDisplay;