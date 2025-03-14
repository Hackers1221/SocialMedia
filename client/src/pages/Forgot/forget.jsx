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
        <div className={`flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-[url("https://images.stockcake.com/public/2/9/c/29cc0acd-d266-46bf-b9b8-b5330cd2918b_large/greenery-on-wood-stockcake.jpg")]  bg-no-repeat bg-cover bg-center`}>
            <div className={`flex items-center justify-center bg-[#131842] bg-opacity-[40%] backdrop-blur-lg backdrop-saturate-300 w-full h-full`}>
                <div className="flex justify-evenly w-[90%] h-[80%]">
                <div className="flex flex-col justify-center text-[3rem] w-[40%] text-white font-bold leading-[1.2]">
                    <span>Moments become</span>
                    <span className={`text-[${_COLOR.buttons}]`}>memories</span>
                    <span>— don't miss out!</span>
                </div>
                <div className="flex items-center overflow-hidden w-[40%] h-full">
                    <div className="w-full p-8">
                        <p className="text-[3rem] text-white text-center">Forgot Password?</p>
                        <div className="mt-4">
                            <label className="block text-white text-sm font-bold mb-2">
                                Enter Your Email
                            </label>
                            <input
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[${_COLOR.input}]`}
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
                                className={`flex justify-center text-white font-bold py-[0.6rem] w-full rounded-2xl bg-[${_COLOR.buttons}]`}
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
                            className={`mt-4 text-center text-xs text-[${_COLOR.buttons}] capitalize hover:cursor-pointer hover:underline`}
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
