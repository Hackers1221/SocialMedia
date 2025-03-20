import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "../../redux/Slices/auth.slice";
import toast from "react-hot-toast";

function SendOtp() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e) {
    setEmail(e.target.value);
  }

  const submit = async () => {
    setIsLoading(true); // Show loader
    const response = await dispatch(sendOtp({ email }));
    
    if (response.payload) {
      localStorage.setItem("otpTimer", 60);
      localStorage.setItem("otpStartTime", Date.now());
      navigate("/verifyotp");
    } else {
      toast.error("Unable to send OTP. Please verify your email.");
      navigate("/signup");
    }
    setIsLoading(false); // Hide loader
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
      
                      <div className="flex flex-col items-center h-full justify-center">
                        <div className="flex steps gap-4 max-w-full">
                          <div className={`step step-info step-neutral`}>
                            <p className={`text-info text-xs`}>Email Entry</p>
                          </div>
                          <div className="step step-neutral">
                            <p className={`text-info text-xs`}>Otp Verification</p>
                          </div>
                          <div className="step step-neutral">
                            <p className={`text-info text-xs`}>Personal Details</p>
                          </div>
                        </div>
                        <div
                          className="flex flex-col r py-5 overflow-hidden max-w-md w-full"
                        >
                          <div className="w-full px-8 py-4">
                            <p className="text-[3rem] text-white text-center font-bold">Enter Your Email</p>
                            <div className="mt-4">
                              <label className="block text-white text-sm font-bold mb-2">
                                Email Address
                              </label>
                              <input
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--input)]`}
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
                                id="submitButton"
                                className={`flex justify-center text-white font-bold py-[0.6rem] w-full rounded-2xl bg-[var(--buttons)]`}
                                onClick={submit}
                                disabled={isLoading} // Disable button while loading
                              >
                                {isLoading ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
                                ) : (
                                  "Send OTP"
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center w-full text-center">
                                  <div
                                  className="text-xs text-gray-500 text-center w-full "
                                  >
                                  Already have an account?
                                  <Link to={'/login'} id="submitButton" className={`hover:underline text-[var(--buttons)]`}> Sign In</Link>
                                  </div>
                              </div>
                        </div>
                      </div>
                      </div>
                  </div>
    </div>
  );
}

export default SendOtp;
