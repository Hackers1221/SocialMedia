import { Route, Routes } from "react-router-dom";
import SignUp from "../SignUp/signup";
import LogIn from "../LogIn/login";
import Home from "../home";
import Layout from "../Layout/Layout";
import SavedPost from "../../components/SavedPosts";
import Profile from "../../components/Profile";
import Explore from "../../components/Explore";

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
      </Route>
    </Routes>
  );
}

export default MainRoutes;
