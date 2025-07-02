import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initSocket } from '../../redux/Slices/socket.slice';
import { getExplorePost } from "../../redux/Slices/post.slice";
import { showToast } from "../../redux/Slices/toast.slice";
import RightPanel from "../../components/RightPanel"

function Layout () {
    const authState = useSelector ((state) => state.auth);
    const dispatch = useDispatch();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    
    // Hide Navbar and Sidebar on these pages
    const location = useLocation();
    const hideSidebar = ["/login", "/signup","/verifyotp","/register","/forgetpass","/resetpass", "/sign"].includes(location.pathname);
    const hideOthers = ["/messenger", "/settings"].includes(location.pathname);

    // Handle socket connection
    useEffect(() => {
        if (authState?.data?._id) {
          dispatch(initSocket({ userId: authState.data._id, dispatch }));
          dispatch (getExplorePost (authState.data?._id));
        }
    }, [authState.data?._id, dispatch]);

    useEffect (() => {
        if (authState.newNotification) {
            dispatch (showToast ({message: "New notification", type: "notification"}));
        }
    }, [authState.newNotification])
    
    // Handle screen resizing
    useEffect(() => {        
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-[var(--background)] text-gray-800`}>
            {!hideSidebar && <Sidebar />}
            {authState?.isLoggedIn && !hideOthers && screenWidth >= 1480 && !hideSidebar && <RightPanel />}
            {(hideSidebar || authState?.isLoggedIn) && <Outlet />}
        </div>
    )
}

export default Layout;