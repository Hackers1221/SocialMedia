import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterPostsByUser, getAllPosts } from "../redux/Slices/post.slice";

function usePosts () {
    const postState = useSelector((state) => state.post);
    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch();

    async function loadPosts() {
        if(!postState?.downloadedPosts?.length || location.pathname === '/explore') dispatch(getAllPosts ());

        if (location.pathname == '/profile') await dispatch (filterPostsByUser ( { id: authState?.data?._id } ));

    }

    useEffect(() => {
        loadPosts ();
    }, [postState?.downloadedPosts, location.pathname]);

    return [postState];
}

export default usePosts;
