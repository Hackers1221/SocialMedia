import Calendar from "../../layouts/calendar";
import { useState, useRef, useCallback, useEffect } from "react";
import { FaEye, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login, signup } from "../../redux/Slices/auth.slice";
import BlockBackNavigation from "../../components/BlockBackNavigation";
import { setTheme } from "../../redux/Slices/theme.slice";

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const birthRef = useRef(null);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const [errors, setErrors] = useState({});
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        lower: false,
        upper: false,
        digit: false,
        special: false
    });

    const [userDetails, setUserDetails] = useState({
        name: "",
        username: "",
        email: localStorage.getItem("email"),
        password: "",
        birth: ""
    });

    console.log (userDetails);

    function handleChange(e) {
        const { name, value } = e.target;
        if (name !== "confirmPassword") {
            setUserDetails({ ...userDetails, [name]: value });
            if (name === "password") updatePasswordCriteria(value);
        } else {
            setConfirmPassword(value);
        }
    }

    function updatePasswordCriteria(password) {
        setPasswordCriteria({
            length: password.length >= 8,
            lower: /[a-z]/.test(password),
            upper: /[A-Z]/.test(password),
            digit: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    }

    function handleBirthChange(date) {
        setUserDetails({ ...userDetails, birth: date });
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
        setPasswordCriteria({
            length: false,
            lower: false,
            upper: false,
            digit: false,
            special: false
        });
        setErrors({});
    }

    function validateFields() {
        const newErrors = {};
        if (!userDetails.name.trim()) newErrors.name = "Name is required";
        if (!userDetails.username.trim()) newErrors.username = "Username is required";
        if (!userDetails.password) newErrors.password = "Password is required";
        if (confirmPassword !== userDetails.password) newErrors.confirmPassword = "Passwords do not match";

        const criteria = passwordCriteria;
        if (!criteria.length || !criteria.lower || !criteria.upper || !criteria.digit || !criteria.special) {
            newErrors.password = "Password does not meet requirements";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function onSubmit() {
        if (!validateFields()) return;

        try {
            setLoading(true);
            const signupRes = await dispatch(signup(userDetails));
            if (signupRes.payload) {
                const signIn = await dispatch(login(userDetails));
                if (signIn.payload) {
                    navigate('/', { replace: true });
                    dispatch (setTheme ("dark"));
                }
            } else {
                resetDetails();
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') document.getElementById('submitButton').click();
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    return (
        <div className="fixed inset-0 bg-[url('https://images.stockcake.com/public/2/9/c/29cc0acd-d266-46bf-b9b8-b5330cd2918b_large/greenery-on-wood-stockcake.jpg')] bg-no-repeat bg-cover bg-center overflow-hidden">
            <BlockBackNavigation />
            <div className="absolute inset-0 bg-[#131842] bg-opacity-40 backdrop-blur-lg backdrop-saturate-300 flex items-center justify-center">
                <div className="flex flex-wrap justify-evenly items-center w-full max-w-[1200px] py-10 px-4 md:px-10">

                    <div className="hidden md:flex flex-col justify-start text-[2rem] lg:text-[3rem] w-full md:w-[45%] text-white font-bold leading-[1.2] mb-10 md:mb-0">
                        <p className="text-[2rem] sm:text-[2.5rem] text-white text-left font-bold mt-2 pb-2 mb-4">Welcome!</p>
                        <span className="text-[#0077c0] mb-2">Be part of</span>
                        <span className="text-[#0077c0] mb-2">something bigger by</span>
                        <span className="mb-4">joining today</span>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full md:w-[50%] px-2">
                        <div className="flex steps gap-2 sm:gap-4 flex-wrap justify-center">
                            <div className="step step-info step-neutral">
                                <p className="text-info text-xs">Email Entry</p>
                            </div>
                            <div className="step step-info step-neutral">
                                <p className="text-info text-xs">Otp Verification</p>
                            </div>
                            <div className="step step-info step-neutral">
                                <p className="text-info text-xs">Personal Details</p>
                            </div>
                        </div>

                        <div className="w-full max-w-[500px] bg-opacity-80 p-6 sm:p-8">
                            <div className="mt-4 flex gap-4 flex-col sm:flex-row">
                                <div className="w-full">
                                    <label className="block text-white text-sm font-bold mb-2">Name</label>
                                    <input
                                        name="name"
                                        value={userDetails.name}
                                        onChange={handleChange}
                                        className="text-white rounded-xl py-[0.6rem] px-4 w-full focus:outline-none bg-[#474E68]"
                                        type="text"
                                        placeholder="Your name"
                                        autoComplete="off"
                                    />
                                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div className="w-full">
                                    <label className="block text-white text-sm font-bold mb-2">Username</label>
                                    <input
                                        name="username"
                                        value={userDetails.username}
                                        onChange={handleChange}
                                        className="text-white rounded-xl py-[0.6rem] px-4 w-full focus:outline-none bg-[#474E68]"
                                        type="text"
                                        placeholder="Your username"
                                        autoComplete="off"
                                    />
                                    {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                                </div>
                            </div>

                            <div className="mt-4">
                                <Calendar ref={birthRef} value={userDetails.birth} onChange={handleBirthChange} />
                            </div>

                            <div className="mt-4">
                                <label className="block text-white text-sm font-bold mb-2">Password</label>
                                <input
                                    name="password"
                                    value={userDetails.password}
                                    onChange={handleChange}
                                    className="text-white rounded-xl py-[0.6rem] px-4 w-full focus:outline-none bg-[#474E68]"
                                    type="password"
                                    placeholder="********"
                                    autoComplete="off"
                                />
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                <div className="flex justify-between mt-2">
                                    <ul className="text-xs space-y-1 w-[48%]">
                                        <li className="flex items-center gap-2 text-white">
                                            {passwordCriteria.length ? <FaCheckCircle className="text-green-400" /> : <FaTimesCircle className="text-red-400" />}
                                            Minimum 8 characters
                                        </li>
                                        <li className="flex items-center gap-2 text-white">
                                            {passwordCriteria.lower ? <FaCheckCircle className="text-green-400" /> : <FaTimesCircle className="text-red-400" />}
                                            At least 1 lowercase letter
                                        </li>
                                        <li className="flex items-center gap-2 text-white">
                                            {passwordCriteria.upper ? <FaCheckCircle className="text-green-400" /> : <FaTimesCircle className="text-red-400" />}
                                            At least 1 uppercase letter
                                        </li>
                                    </ul>

                                    <ul className="text-xs space-y-1 w-[48%]">
                                        <li className="flex items-center gap-2 text-white">
                                            {passwordCriteria.digit ? <FaCheckCircle className="text-green-400" /> : <FaTimesCircle className="text-red-400" />}
                                            At least 1 number
                                        </li>
                                        <li className="flex items-center gap-2 text-white">
                                            {passwordCriteria.special ? <FaCheckCircle className="text-green-400" /> : <FaTimesCircle className="text-red-400" />}
                                            At least 1 special character
                                        </li>
                                    </ul>
                                </div>

                            </div>

                            <div className="mt-4">
                                <label className="block text-white text-sm font-bold mb-2">Confirm Password</label>
                                <div className="flex">
                                    <input
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleChange}
                                        className="text-white rounded-l-xl py-[0.6rem] px-4 w-full focus:outline-none bg-[#474E68]"
                                        type={visible ? "text" : "password"}
                                        placeholder="********"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setVisible(!visible)}
                                        className="text-white rounded-r-xl py-[0.6rem] px-4 bg-[#474E68]"
                                    >
                                        {!visible ? <FaEye /> : <LuEyeClosed />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={onSubmit}
                                    id="submitButton"
                                    className="flex justify-center text-white rounded-xl py-[0.6rem] px-4 w-full bg-[#0077c0]"
                                    disabled={loading}
                                >
                                    {loading ? <FaSpinner className="animate-spin mr-2" /> : "Sign Up"}
                                </button>
                            </div>

                            <div className="flex justify-center mt-4 text-xs text-gray-400">
                                Already have an account?
                                <Link to="/login" className="ml-1 hover:underline text-[#0077c0]">Sign In</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SignUp;
