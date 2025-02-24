import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterPostsByUser, getAllPosts, getPostByUserId, getSavedPost } from "../redux/Slices/post.slice";
import { useSearchParams } from "react-router-dom";
import { getUserByUsername } from "../redux/Slices/auth.slice";
import { useParams } from "react-router-dom";

function usePosts () {
    const postState = useSelector((state) => state.post);
    const authState = useSelector ((state) => state.auth);

    const { username } = useParams();

    const dispatch = useDispatch();

    async function loadPosts() {
        if(!postState?.downloadedPosts?.length) dispatch(getAllPosts ()); 

        if (location.pathname === '/saved') await dispatch(getSavedPost (authState?.data?._id));

        console.log(location.pathname.split('/')[1]);

        if (location.pathname.split('/')[1] == 'profile') {
            const user = await dispatch (getUserByUsername (username));

            await dispatch (getPostByUserId (user.payload?.data?.userDetails?._id));
        }

    }

    useEffect(() => {
        loadPosts ();
    }, [postState?.downloadedPosts, location.pathname]);

    return [postState];
}

export default usePosts;
