import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { resetPass } from "../../redux/Slices/auth.slice";

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    }

    const resetPassword = async () => {
        if (!password || !confirmPassword) {
            toast.error("Both fields are required!");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            setLoading(true);
            const response = await dispatch(resetPass({
                email : localStorage.getItem("email"),
                password : password,
                token : searchParams.get("token")
            }))
            if(response.payload){
                toast.success("Password reset successful!");
                setConfirmPassword("");
                setPassword("");
                navigate("/login");
            }else{
                setConfirmPassword("");
                setPassword("");
                toast.error("Unable to reset the password , Pls try again");
            }
        } catch (error) {
            toast.error("Unable to reset the password , Pls try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0" style={{ backgroundColor: _COLOR.light }}>
            <div className="flex rounded-lg shadow-lg border overflow-hidden max-w-md w-full" style={{ backgroundColor: _COLOR.lightest }}>
                <div className="w-full p-8">
                    <p className="text-xl text-gray-600 text-center">Reset Password</p>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            New Password
                        </label>
                        <input
                            name="password"
                            value={password}
                            onChange={handleChange}
                            className="text-black border border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
                            style={{ borderColor: _COLOR.light, backgroundColor: _COLOR.lightest }}
                            type="password"
                            autoComplete="off"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            className="text-black border border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
                            style={{ borderColor: _COLOR.light, backgroundColor: _COLOR.lightest }}
                            type="password"
                            autoComplete="off"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <div className="mt-8">
                        <button
                            className="text-white font-bold py-2 px-4 w-full rounded flex items-center justify-center"
                            style={{ backgroundColor: _COLOR.dark }}
                            onClick={resetPassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </div>
                    <div
                        className="mt-4 text-center text-xs text-gray-800 capitalize hover:cursor-pointer hover:underline hover:font-bold"
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
