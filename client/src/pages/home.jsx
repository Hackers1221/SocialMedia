import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

function Home () {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    
    // Handle screen resizing
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-[${_COLOR.dark}] text-gray-800`}>
            <div className="flex">
                <Sidebar />
                <div className="w-full">
                    {screenWidth >= 768 && (<Navbar />)}
                </div>
            </div>
        </div>
    )
}

export default Home;