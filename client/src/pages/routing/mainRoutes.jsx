import { Route, Routes } from "react-router-dom";
import SignUp from "../SignUp/signup";
import LogIn from "../LogIn/login";
import Home from "../home";
import Layout from "../Layout/Layout";

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LogIn />} />
      </Route>
    </Routes>
  );
}

export default MainRoutes;
