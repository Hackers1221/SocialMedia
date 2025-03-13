import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
      navigate("/verifyotp");
    } else {
      toast.error("Unable to send OTP. Please verify your email.");
      navigate("/signup");
    }
    setIsLoading(false); // Hide loader
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-full px-5 sm:px-0"
      style={{ backgroundColor: _COLOR.light }}
    >
      <div
        className="flex rounded-lg shadow-lg border overflow-hidden max-w-md w-full"
        style={{ backgroundColor: _COLOR.lightest }}
      >
        <div className="w-full p-8">
          <p className="text-xl text-gray-600 text-center">Enter Your Email</p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              name="email"
              value={email}
              onChange={handleChange}
              className="text-black border border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
              style={{ backgroundColor: _COLOR.lightest }}
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
              className="text-white font-bold py-2 px-4 w-full rounded flex items-center justify-center"
              style={{ backgroundColor: "#1f2937" }}
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
      </div>
    </div>
  );
}

export default SendOtp;
