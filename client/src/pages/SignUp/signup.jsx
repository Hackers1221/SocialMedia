import Calendar from "../../layouts/calendar";
import { useState, useRef, useCallback, useEffect } from "react";
import { FaEye, FaSpinner } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login, signup } from "../../redux/Slices/auth.slice";

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const birthRef = useRef(null);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false); // Loader state

    const [userDetails, setUserDetails] = useState({
        name: "",
        username: "",
        email: localStorage.getItem("email"),
        password: "",
        birth: ""
    });

    const [visible, setVisible] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        if (name !== "confirmPassword") {
            setUserDetails({
                ...userDetails,
                [name]: value
            });
        } else setConfirmPassword(value);
    }

    function handleBirthChange(date) {
        setUserDetails({
            ...userDetails,
            birth: date
        });
    }

    function resetDetails() {
        setUserDetails({
            name: "",
            username: "",
            email: "",
            password: "",
            birth: ""
        });

        setConfirmPassword("");
    }

    async function onSubmit() {
        try {
            if (confirmPassword !== userDetails.password) {
                toast.error('Passwords do not match');
                return;
            }

            if (!userDetails.name.trim() || !userDetails.username.trim() || !confirmPassword.trim()) {
                toast.error('Fields cannot be empty');
                return;
            }

            setLoading(true); // Start loader

            const signupRes = await dispatch(signup(userDetails));

            if (signupRes.payload) {
                const signIn = await dispatch (login (userDetails));
                if (signIn.payload) navigate('/', { replace: true });
            }
            else resetDetails();

        } catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading (false);
        }
    }

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') document.getElementById('submitButton').click();
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <div className={`flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-[url("https://images.stockcake.com/public/2/9/c/29cc0acd-d266-46bf-b9b8-b5330cd2918b_large/greenery-on-wood-stockcake.jpg")]  bg-no-repeat bg-cover bg-center`}>
      <div className={`flex items-center justify-center bg-[#131842] bg-opacity-[40%] backdrop-blur-lg backdrop-saturate-300 w-full h-full`}>
                      <div className="flex justify-evenly w-[90%] h-[90%]">
                      <div className="hidden md:flex flex-col justify-center text-[3rem] w-[40%] text-white font-bold leading-[1.2]">
                          <span>Be part of</span>
                          <span className={`text-[var(--buttons)]`}>something bigger by</span>
                          <span>joining today</span>
                      </div>
      
                      <div className="flex flex-col items-center h-full justify-center w-[50%]">
                        <div className="flex steps gap-4 max-w-full">
                          <div className={`step step-info step-neutral`}>
                            <p className={`text-info text-xs`}>Email Entry</p>
                          </div>
                          <div className="step step-info step-neutral">
                            <p className={`text-info text-xs`}>Otp Verification</p>
                          </div>
                          <div className="step step-info step-neutral">
                            <p className={`text-info text-xs`}>Personal Details</p>
                          </div>
                        </div>
                        <div className="flex overflow-hidden max-w-md w-full">
                            <div className="w-full p-8">
                                <p className="text-[3rem] text-white text-center font-bold">Welcome!</p>
                                <div className="mt-4">
                                    <label className="block text-white text-sm font-bold mb-2">
                                        Name
                                    </label>
                                    <input
                                        name="name"
                                        value={userDetails.name}
                                        onChange={handleChange}
                                        className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--input)]`}
                                        type="text"
                                        autoComplete="off" autoCorrect="off" spellCheck="false"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-white text-sm font-bold mb-2">
                                        Username
                                    </label>
                                    <input
                                        name="username"
                                        value={userDetails.username}
                                        onChange={handleChange}
                                        className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--input)]`}
                                        type="text"
                                        autoComplete="false" autoCorrect="false" spellCheck="false"
                                        placeholder="Your username"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <Calendar ref={birthRef} value={userDetails.birth} onChange={handleBirthChange} />
                                </div>
                                <div className="mt-4 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <label className="block text-white text-sm font-bold mb-2">
                                            Password
                                        </label>
                                    </div>
                                    <input
                                        name="password"
                                        value={userDetails.password}
                                        onChange={handleChange}
                                        className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--input)]`}
                                        type="password"
                                        autoComplete="new-password" autoCorrect="off" spellCheck="false"
                                        placeholder="********"
                                    />
                                </div>
                                <div className="mt-4 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <label className="block text-white text-sm font-bold mb-2">
                                            Confirm Password
                                        </label>
                                    </div>
                                    <div className="flex">
                                        <input
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleChange}
                                            className={`text-white rounded-l-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--input)]`}
                                            type={visible ? "text" : "password"}
                                            autoComplete="off" autoCorrect="off" spellCheck="false"
                                            placeholder="********"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setVisible(!visible)}
                                            className={`text-white rounded-r-xl py-[0.6rem] px-4 block focus:outline-none bg-[var(--input)]`}
                                        >
                                            {!visible ? <FaEye /> : <LuEyeClosed />}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <button
                                        onClick={onSubmit}
                                        id="submitButton"
                                        className={`flex justify-center text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--buttons)]`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <FaSpinner className="animate-spin mr-2" />
                                        ) : (
                                            "Sign Up"
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center w-full text-center mt-4">
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
    </div>
    )
}

export default SignUp;
