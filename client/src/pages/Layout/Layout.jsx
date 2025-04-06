import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Suggestions from "../../components/Suggestions";
import { useSelector } from "react-redux";
import useSocket from "../../hooks/useSocket";

function Layout () {
    const authState = useSelector ((state) => state.auth);

    const sockets = useSocket();

    const navigate = useNavigate ();

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
        <div className={`min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-[var(--background)] text-gray-800`}>
            {/* {!hideOthers && screenWidth >= 768 && <Navbar />} */}
            {!hideSidebar && <Sidebar />}
            {!hideOthers && screenWidth >= 1480 && !hideSidebar && <Suggestions />}
            <Outlet />
        </div>
    )
}

export default Layout;