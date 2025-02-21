import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import PostPage from "../posts/postPage";
import Messages from "../../components/Messages";

function Layout () {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    
    // Hide Navbar and Sidebar on these pages
    const location = useLocation();
    const hideLayout = ["/login", "/signup"].includes(location.pathname);

    
    // Handle screen resizing
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-[${_COLOR.dark}] text-gray-800`}>
            {!hideLayout && screenWidth >= 768 && <Navbar />}
            {!hideLayout && <Sidebar />}
            <Messages />
            <PostPage />
            <Outlet />
        </div>
    )
}

export default Layout;