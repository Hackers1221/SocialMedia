import { Route, Routes, useLocation } from "react-router-dom";

import SignUp from "../pages/SignUp/signup";
import LogIn from "../pages/LogIn/login";
import Home from "../pages/home";
import Layout from "../pages/Layout/Layout";
import SavedPost from "../pages/Saved/SavedPosts";
import Profile from "../pages/Profile/Profile";
import Explore from "../pages/Explore/Explore";
import Messenger from "../pages/Messenger/Messenger";
import Pulse from "../pages/Pulse/Pulse";
import Settings from "../pages/Settings/Settings";
import SendOtp from "../pages/SignUp/sentotp";
import VerifyOtp from "../pages/SignUp/verifyotp";
import ForgetPassword from "../pages/Forgot/Forget";
import ResetPassword from "../pages/Forgot/reset";
import Notification from "../pages/Notification/Notification";
import DisplayPost from "../components/DisplayPost";
import { useEffect, useState } from "react";
import PostDisplay from "../pages/SinglePost/PostDisplay";

function MainRoutes() {
  const location = useLocation ();
  const state = location.state;

  const [width, setWidth] = useState (window.innerWidth);

  // 👇 Keeps track of the page we were on when navigating to /posts/:id
  const backgroundLocation = state?.backgroundLocation || location;

    useEffect (() => {
        const handleResize = () => setWidth (window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <>
        <Routes location={width > 1000 ? backgroundLocation : location}>
            <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<SendOtp />} />
            <Route path="verifyotp" element={<VerifyOtp />} />
            <Route path="forgetpass" element={<ForgetPassword />} />
            <Route path="resetpass" element={<ResetPassword />} />
            <Route path="register" element={<SignUp />} />
            <Route path="login" element={<LogIn />} />
            <Route path="saved" element={<SavedPost />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="explore" element={<Explore />} />
            <Route path="message" element={<Messenger />} />
            <Route path="notification" element={<Notification />} />
            <Route path="pulse" element={<Pulse />} />
            <Route path="settings" element={<Settings />} />
            <Route path="posts/:postId" element={<PostDisplay />} />
            </Route>
      </Routes>

      {/* Modal overlay only for desktop */}
      {state?.backgroundLocation && width > 1000 && (
        <Routes>
          <Route path="/posts/:postId" element={<DisplayPost />} />
        </Routes>
      )}
    </>
  );
}

export default MainRoutes;
