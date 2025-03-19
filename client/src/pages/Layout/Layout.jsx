import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Suggestions from "../../components/Suggestions";
import { useSelector } from "react-redux";

function Layout () {
    const authState = useSelector ((state) => state.auth);

    const navigate = useNavigate ();

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    
    // Hide Navbar and Sidebar on these pages
    const location = useLocation();
    const hideSidebar = ["/login", "/signup","/verifyotp","/register","/forgetpass","/resetpass", "/sign"].includes(location.pathname);
    const hideOthers = ["/messenger", "/settings"].includes(location.pathname);
    
    // Handle screen resizing
    useEffect(() => {
        if (!authState?.isLoggedIn || !authState?.data?.email) {
            navigate ("/login"); return;
        }
        
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-[${_COLOR.background}] text-gray-800`}>
            {/* {!hideOthers && screenWidth >= 768 && <Navbar />} */}
            {!hideSidebar && <Sidebar />}
            {!hideOthers && screenWidth >= 1480 && !hideSidebar && <Suggestions />}
            <Outlet />
        </div>
    )
}

export default Layout;