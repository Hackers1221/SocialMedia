import { Route, Routes } from "react-router-dom";
import SignUp from "../SignUp/signup";
import LogIn from "../LogIn/login";

function MainRoutes() {
    return (
        <Routes>
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/login" element={<LogIn />} />
        </Routes>
    )
}

export default MainRoutes;