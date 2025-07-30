// Import required hooks and utilities
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendOtp, verifyOtp } from "../../redux/Slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../redux/Slices/toast.slice";

function VerifyOtp() {
    // Initialize OTP state (6 digits)
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    // Loading state for async actions
    const [loading, setLoading] = useState(false);

    // Timer state to manage OTP countdown
    const [timer, setTimer] = useState(() => {
        // Load timer from localStorage or default to 60 seconds
        const savedTime = localStorage.getItem("otpTimer");
        return savedTime
            ? Math.max(0, Number(savedTime) - (Date.now() - Number(localStorage.getItem("otpStartTime"))) / 1000)
            : 60;
    });

    // State to control resend OTP button
    const [canResend, setCanResend] = useState(false);

    // Refs to control input focus
    const inputRefs = useRef([]);

    // Redux and navigation setup
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle input change and auto-focus to next box
    const handleChange = (index, e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle backspace to focus previous box
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Submit OTP to server for verification
    const submit = async () => {
        if (timer === 0) {
            dispatch(showToast({ message: "OTP expired! Please request a new one!", type: "error" }));
            return;
        }

        setLoading(true);
        try {
            const response = await dispatch(
                verifyOtp({
                    email: localStorage.getItem("email"),
                    otp: otp.join(""),
                })
            );

            if (response.payload) {
                navigate("/register", { replace: true });
            } else {
                dispatch(showToast({ message: "Invalid OTP! Please try again!", type: "error" }));
            }
        } catch (error) {
            dispatch(showToast({ message: "Verification failed!", type: "error" }));
        }
        setLoading(false);
    };

    // Resend a new OTP to the user's email
    const resendOtp = async () => {
        try {
            setLoading(true); // Start loader
            const response = await dispatch(sendOtp({ email: localStorage.getItem("email") }));

            dispatch(showToast({ message: "New OTP sent to your email!", type: "success" }));

            setOtp(["", "", "", "", "", ""]);
            setTimer(60); // Reset timer
            setCanResend(false);
            localStorage.setItem("otpTimer", 60);
            localStorage.setItem("otpStartTime", Date.now());
        } catch (error) {
            dispatch(showToast({ message: "Failed to resend OTP!", type: "error" }));
        } finally {
            setLoading(false); // Stop loader
        }
    };

    // Handle Ctrl+V paste to auto-fill OTP boxes
    useEffect(() => {
        const handlePaste = async (e) => {
            if (!(e.ctrlKey || e.metaKey) || e.key !== "v") return;

            try {
                const text = await navigator.clipboard.readText();
                const digits = text.replace(/\D/g, "").slice(0, 6).split("");

                setOtp((prevOtp) => {
                    const newOtp = [...prevOtp];
                    digits.forEach((digit, i) => {
                        newOtp[i] = digit;
                        if (inputRefs.current[i]) inputRefs.current[i].value = digit;
                    });

                    // Move focus to last digit
                    const last = Math.min(digits.length, newOtp.length) - 1;
                    if (inputRefs.current[last]) {
                        inputRefs.current[last].focus();
                    }

                    return newOtp;
                });
            } catch (err) {
                console.error("Paste failed", err);
            }
        };

        window.addEventListener("keydown", handlePaste);
        return () => window.removeEventListener("keydown", handlePaste);
    }, []);

    // Effect to handle countdown and persist time
    useEffect(() => {
        if (timer > 0) {
            localStorage.setItem("otpTimer", timer);
            localStorage.setItem("otpStartTime", Date.now());

            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer, dispatch]);

    // Return OTP input UI
    return (
        <div className={`flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-[url("https://images.stockcake.com/public/2/9/c/29cc0acd-d266-46bf-b9b8-b5330cd2918b_large/greenery-on-wood-stockcake.jpg")]  bg-no-repeat bg-cover bg-center`}>
            <div className={`flex items-center justify-center bg-[#131842] bg-opacity-[40%] backdrop-blur-lg backdrop-saturate-300 w-full h-full`}>
                <div className="flex justify-evenly w-[90%] h-[80%]">
                    
                    {/* Left side promotional content (hidden on small screens) */}
                    <div className="hidden md:flex flex-col justify-center text-[3rem] w-[40%] text-white font-bold leading-[1.2]">
                        <span>Be part of</span>
                        <span className={`text-[#0077c0]`}>something bigger by</span>
                        <span>joining today</span>
                    </div>

                    {/* OTP Verification Box */}
                    <div className="flex flex-col items-center h-full justify-center w-full md:w-[50%]">
                        
                        {/* Step progress indicator */}
                        <div className="flex steps gap-4 max-w-full">
                            <div className={`step step-info step-neutral`}>
                                <p className={`text-info text-xs`}>Email Entry</p>
                            </div>
                            <div className="step step-info step-neutral">
                                <p className={`text-info text-xs`}>Otp Verification</p>
                            </div>
                            <div className="step step-neutral">
                                <p className={`text-info text-xs`}>Personal Details</p>
                            </div>
                        </div>

                        {/* OTP input card */}
                        <div className="flex overflow-hidden max-w-md w-full p-8">
                            <div className="w-full text-center">
                                <p className="text-[3rem] font-bold text-white">Enter OTP</p>
                                <p className="text-sm text-gray-300 mt-2">
                                    If your email is correct, you must have recieved an OTP at your registered email address.
                                </p>

                                {/* Countdown Timer */}
                                <p className="text-sm text-red-600 mt-2">
                                    {timer > 0 ? `Time remaining: ${Math.floor(timer)}s` : "OTP expired!"}
                                </p>

                                {/* OTP input boxes */}
                                <div className="mt-4 flex justify-center gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleChange(index, e)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className={`w-10 md:w-12 h-10 md:h-12 text-center text-xl font-bold border-2 border-[#0077c0] rounded-md focus:outline-none text-white bg-gray-800`}
                                            maxLength="1"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            disabled={timer === 0}
                                        />
                                    ))}
                                </div>

                                {/* Submit OTP button */}
                                <button
                                    className={`mt-6 py-[0.6rem] w-full rounded-2xl text-white font-bold flex items-center justify-center bg-[#0077c0]`}
                                    onClick={submit}
                                    disabled={loading || timer === 0}
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </button>

                                {/* Resend OTP button */}
                                {canResend && (
                                    <button className={`mt-4 text-[#0077c0] hover:underline`} onClick={resendOtp}>
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyOtp;
