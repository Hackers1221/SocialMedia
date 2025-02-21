import Messages from "../components/Messages";
import Stories from "../components/Stories";
import PostPage from "./posts/postPage";

function Home () {

    return  (
        <>
            <Stories />
            <Messages />
            <PostPage />
        </>
    )
}

export default Home;