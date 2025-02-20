import { Route, Routes } from "react-router-dom";
import SignUp from "../SignUp/signup";
import LogIn from "../LogIn/login";
import Home from "../home";

function MainRoutes() {
    return (
        <Routes>
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/" element={<Home />} />
        </Routes>
    )
}

export default MainRoutes;