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

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LogIn />} />
        <Route path="saved" element={<SavedPost />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="explore" element={<Explore />} />
        <Route path="messenger" element={<Messenger />} />
        <Route path="pulse" element={<Pulse />} />
        <Route path="story" element={<DisplayStory />}/>
      </Route>
    </Routes>
  );
}

export default MainRoutes;
