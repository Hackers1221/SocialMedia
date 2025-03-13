import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgetPass } from "../../redux/Slices/auth.slice";
import { toast } from "react-hot-toast";

function ForgetPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setEmail(e.target.value);
    }

    const forget = async () => {
        if (!email.trim()) {
            toast.error("Email cannot be empty!");
            return;
        }
        try {
            setLoading(true);
            const response = await dispatch(forgetPass({ email }));
            setEmail("");
            
            if (response.payload) {
                localStorage.setItem("email",email);
                toast.success("Reset link sent! Check your email.");
            } else {
                toast.error("Failed to send reset link. Check your email");
            }
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0" style={{ backgroundColor: _COLOR.light }}>
            <div className="flex rounded-lg shadow-lg border overflow-hidden max-w-md w-full" style={{ backgroundColor: _COLOR.lightest }}>
                <div className="w-full p-8">
                    <p className="text-xl text-gray-600 text-center">Forgot Password?</p>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Enter Your Email
                        </label>
                        <input
                            name="email"
                            value={email}
                            onChange={handleChange}
                            className="text-black border border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
                            style={{ borderColor: _COLOR.light, backgroundColor: _COLOR.lightest }}
                            type="email"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            placeholder="Email address"
                            required
                        />
                    </div>
                    <div className="mt-8">
                        <button
                            className="text-white font-bold py-2 px-4 w-full rounded flex items-center justify-center"
                            style={{ backgroundColor: _COLOR.dark }}
                            onClick={forget}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Send Reset Link"
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

export default ForgetPassword;
