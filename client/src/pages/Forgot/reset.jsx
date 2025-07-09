import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPass } from "../../redux/Slices/auth.slice";
import { showToast } from "../../redux/Slices/toast.slice";

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
            dispatch (showToast ({ message: 'Both the fields are required!', type: 'error' }));
            return;
        }
        if (password !== confirmPassword) {
            dispatch (showToast ({ message: 'Passwords do not match!', type: 'error' }));
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
                dispatch (showToast ({ message: 'Password reset was successful', type: 'success' }));

                setConfirmPassword("");
                setPassword("");
                navigate("/login");
            }else{
                setConfirmPassword("");
                setPassword("");

                dispatch (showToast ({ message: 'Unable to reset the password! Please try again!', type: 'error' }));
            }
        } catch (error) {
            dispatch (showToast ({ message: 'Unable to reset the password! Please try again!', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-[var(--background)]">
            <div className="flex rounded-lg shadow-lg overflow-hidden max-w-md w-full bg-[var(--card)]">
                <div className="w-full p-8">
                    <p className="text-xl text-gray-600 text-center text-[var(--buttons)] font-bold">Reset Password</p>
                    <div className="mt-4">
                        <label className="block text-[var(--text)] text-sm font-bold mb-2">
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
                        <label className="block text-[var(--text)] text-sm font-bold mb-2">
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
                    <div className="mt-8 border rounded-md hover:bg-[var(--background)]">
                        <button
                            className="text-[var(--buttons)] font-bold py-2 px-4 w-full rounded flex items-center justify-center"
                            onClick={resetPassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Reset"
                            )}
                        </button>
                    </div>
                    <div
                        className="mt-4 text-center text-xs text-[var(--buttons)] hover:cursor-pointer hover:underline hover:font-bold"
                        onClick={() => navigate("/login")}
                    >
                        Back to login
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
