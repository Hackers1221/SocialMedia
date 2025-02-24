import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterPostsByUser, getAllPosts, getPostByUserId, getSavedPost } from "../redux/Slices/post.slice";

function usePosts () {
    const postState = useSelector((state) => state.post);
    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch();

    async function loadPosts() {
        if(!postState?.downloadedPosts?.length) dispatch(getAllPosts ()); 

        if (location.pathname == '/saved') await dispatch(getSavedPost (authState?.data?._id));

        if (location.pathname == '/profile') await dispatch (getPostByUserId (authState.data._id));

    }

    useEffect(() => {
        loadPosts ();
    }, [postState?.downloadedPosts, location.pathname]);

    return [postState];
}

export default usePosts;
