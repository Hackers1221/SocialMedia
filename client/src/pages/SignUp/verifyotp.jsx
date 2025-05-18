import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendOtp, verifyOtp} from "../../redux/Slices/auth.slice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BlockBackNavigation from "../../components/BlockBackNavigation";

function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(() => {
    // Load timer from localStorage or default to 60 seconds
    const savedTime = localStorage.getItem("otpTimer");
    return savedTime ? Math.max(0, Number(savedTime) - (Date.now() - Number(localStorage.getItem("otpStartTime"))) / 1000) : 60;
  });
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // Handle input change and auto-focus
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

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Submit OTP
  const submit = async () => {
    if (timer === 0) {
      toast.error("OTP expired! Please request a new one.");
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
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Verification failed!");
      console.error(error);
    }
    setLoading(false);
  };

  // Resend OTP function
  const resendOtp = async () => {
    try {
      setLoading(true); // Start loader
      const response = await dispatch(sendOtp({ email: localStorage.getItem("email") }));
      toast.success("New OTP sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setTimer(60); // Reset timer
      setCanResend(false);
      localStorage.setItem("otpTimer", 60);
      localStorage.setItem("otpStartTime", Date.now());
    } catch (error) {
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className={`flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-[url("https://images.stockcake.com/public/2/9/c/29cc0acd-d266-46bf-b9b8-b5330cd2918b_large/greenery-on-wood-stockcake.jpg")]  bg-no-repeat bg-cover bg-center`}>
      <div className={`flex items-center justify-center bg-[#131842] bg-opacity-[40%] backdrop-blur-lg backdrop-saturate-300 w-full h-full`}>
                    <div className="flex justify-evenly w-[90%] h-[80%]">
                      <div className="hidden md:flex flex-col justify-center text-[3rem] w-[40%] text-white font-bold leading-[1.2]">
                          <span>Be part of</span>
                          <span className={`text-[var(--buttons)]`}>something bigger by</span>
                          <span>joining today</span>
                      </div>
      
                      <div className="flex flex-col items-center h-full justify-center w-full md:w-[50%]">
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
                        <div className="flex overflow-hidden max-w-md w-full p-8">
                          <div className="w-full text-center">
                            <p className="text-[3rem] font-bold text-white">Enter OTP</p>
                            <p className="text-sm text-gray-300 mt-2">
                              If your email is correct, you must have recieved an OTP at your registered email address.
                            </p>

                            {/* Timer */}
                            <p className="text-sm text-red-600 mt-2">
                              {timer > 0 ? `Time remaining: ${Math.floor(timer)}s` : "OTP expired!"}
                            </p>

                            <div className="mt-4 flex justify-center gap-2">
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  ref={(el) => (inputRefs.current[index] = el)}
                                  type="text"
                                  value={digit}
                                  onChange={(e) => handleChange(index, e)}
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                  className={`w-10 md:w-12 h-10 md:h-12 text-center text-xl font-bold border-2 border-[var(--buttons)] rounded-md focus:outline-none text-white bg-gray-800`}
                                  maxLength="1"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  disabled={timer === 0}
                                />
                              ))}
                            </div>

                            {/* Verify Button */}
                            <button
                              className={`mt-6 py-[0.6rem] w-full rounded-2xl text-white font-bold flex items-center justify-center bg-[var(--buttons)]`}
                              onClick={submit}
                              disabled={loading || timer === 0}
                            >
                              {loading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "Verify OTP"
                              )}
                            </button>

                            {/* Resend OTP Button */}
                            {canResend && (
                              <button className={`mt-4 text-[var(--buttons)] hover:underline`} onClick={resendOtp}>
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
