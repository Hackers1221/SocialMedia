import PostPage from "./posts/postPage";

function Home () {

    return  (
        <div className={`bg-[${_COLOR.medium}]`}>
            <PostPage />
        </div>
    )
}

export default Home;