import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterPostsByUser, getAllPosts } from "../redux/Slices/post.slice";

function usePosts (userId) {
    const postState = useSelector((state) => state.post);

    const dispatch = useDispatch();

    async function loadPosts() {
        if(!postState?.downloadedPosts?.length) dispatch(getAllPosts ());

        if (userId) dispatch (filterPostsByUser ( { id: userId } ));
    }

    useEffect(() => {
        loadPosts ();
    }, [postState?.downloadedPosts, userId]);

    return [postState];
}

export default usePosts;
