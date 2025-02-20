import Sidebar from "../components/sidebar";

function Home () {
    return (
        <div className={`min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-[${_COLOR.dark}] text-gray-800`}>
            <Sidebar />
        </div>
    )
}

export default Home;