import { useEffect } from "react";
import PostPage from "./posts/postPage";
import { useDispatch } from "react-redux";
import { getAllPosts } from "../redux/Slices/post.slice";
import toast from "react-hot-toast";

function Home () {

    const dispatch = useDispatch();

    async function getPosts () {
        console.log ('hello');
        const res = await dispatch (getAllPosts());
        if (!res) toast.error ("Something went wrong");
    }

    useEffect (() => {
        getPosts ();
    }, [])

    return  (
        <>
        < PostPage />
        </>
    )
}

export default Home;