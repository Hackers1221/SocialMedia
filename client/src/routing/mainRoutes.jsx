import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/SignUp/signup";
import LogIn from "../pages/LogIn/login";
import Home from "../pages/home";
import Layout from "../pages/Layout/Layout";
import SavedPost from "../pages/Saved/SavedPosts";
import Profile from "../pages/Profile/Profile";
import Explore from "../pages/Explore/Explore";
import Messenger from "../pages/Messenger/Messenger";
import Pulse from "../pages/Pulse/Pulse";
import DisplayStory from "../components/DisplayStory";
import Settings from "../pages/Settings/Settings";
import SendOtp from "../pages/SignUp/sentotp";
import VerifyOtp from "../pages/SignUp/verifyotp";
import ForgetPassword from "../pages/Forgot/Forget";
import ResetPassword from "../pages/Forgot/reset";
import VersePage from "../pages/Verse/VersePage";

function MainRoutes() {
  return (
    <Routes>
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
        <Route path="messenger" element={<Messenger />} />
        <Route path="pulse" element={<Pulse />} />
        <Route path="settings" element={<Settings />} />
        <Route path="verse" element={<VersePage />} />
      </Route>
    </Routes>
  );
}

export default MainRoutes;
