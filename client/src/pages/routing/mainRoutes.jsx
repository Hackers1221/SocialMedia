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

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LogIn />} />
        <Route path="saved" element={<SavedPost />} />
        <Route path="profile" element={<Profile />} />
        <Route path="explore" element={<Explore />} />
        <Route path="messenger" element={<Messenger />} />
        <Route path="pulse" element={<Pulse />} />
      </Route>
    </Routes>
  );
}

export default MainRoutes;
