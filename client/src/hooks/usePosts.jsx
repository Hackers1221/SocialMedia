import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, getSavedPost } from "../redux/Slices/post.slice";

function usePosts () {
    const postState = useSelector((state) => state.post);
    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch();

    async function loadPosts() {
        if(!postState?.downloadedPosts?.length) dispatch(getAllPosts ()); 

        if (location.pathname === '/saved' || location.pathname === '/explore') dispatch(getSavedPost (authState?.data?._id));
    }
    useEffect(() => {
        loadPosts ();
    }, []);

    return [postState];
}

export default usePosts;
