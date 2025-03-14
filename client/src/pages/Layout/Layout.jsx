import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Stories from "../../components/Stories";
import Messages from "../../components/Messages";

function Layout () {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    
    // Hide Navbar and Sidebar on these pages
    const location = useLocation();
    const hideSidebar = ["/login", "/signup","/verifyotp","/register","/forgetpass","/resetpass", "/sign"].includes(location.pathname);
    const hideOthers = ["/messenger", "/settings"].includes(location.pathname);
    
    // Handle screen resizing
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-[${_COLOR.darkest}] text-gray-800`}>
            {/* {!hideOthers && screenWidth >= 768 && <Navbar />} */}
            {!hideSidebar && <Sidebar />}
            {!hideOthers && screenWidth >= 1480 && !hideSidebar && <Messages />}
            <Outlet />
        </div>
    )
}

export default Layout;