import { Route, Routes } from "react-router-dom";
import SignUp from "../SignUp/signup";
import LogIn from "../LogIn/login";
import Home from "../home";
import Layout from "../Layout/Layout";
import SavedPost from "../../components/SavedPosts";
import Profile from "../../components/Profile";
import Explore from "../../components/Explore";
import Messenger from "../../components/Messenger";
import Pulse from "../Pulse/Pulse";
import DisplayStory from "../../components/DisplayStory";
import Settings from "../../components/Settings";
import SendOtp from "../SignUp/sentotp";
import VerifyOtp from "../SignUp/verifyotp";
import ForgetPassword from "../Forgot/Forget";
import ResetPassword from "../Forgot/reset";
import VersePage from "../Verse/VersePage";

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
