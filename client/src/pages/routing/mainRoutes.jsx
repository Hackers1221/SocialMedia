import { Route, Routes } from "react-router-dom";
import SignUp from "../SignUp/signup";

function MainRoutes() {
    return (
        <Routes>
            <Route path="/signup" element={<SignUp/>} />
        </Routes>
    )
}

export default MainRoutes;