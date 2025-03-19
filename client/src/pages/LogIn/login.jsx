import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/Slices/auth.slice";

function LogIn () {

    const dispatch = useDispatch ();
    const navigate = useNavigate ();

    const [visible, setVisible] = useState(false);

    const [userDetails, setUserDetails] = useState ({
        email: "",
        password: "",
    });

    function handleChange (e) {
        const {name, value} = e.target;
        setUserDetails ({
            ...userDetails,
            [name] : value
        })
    }

    function resetDetails () {
        setUserDetails ({
            email: "",
            password: "",
        })
    }

    async function onSubmit () {
        try {  
            if (!userDetails.email.trim() || !userDetails.password.trim()) {
                toast.error ('Fields cannot be empty'); return;
            }

            const res = await dispatch (login (userDetails));
            if (res.payload) navigate('/');
            else resetDetails();

        } catch (error) {
            toast.error(error);
        }
    }

    const forget = () => {
        navigate('/forgetpass')
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
        // eslint-disable-next-line no-undef
        <div className={`flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-[url("https://images.stockcake.com/public/2/9/c/29cc0acd-d266-46bf-b9b8-b5330cd2918b_large/greenery-on-wood-stockcake.jpg")]  bg-no-repeat bg-cover bg-center`}>
            <div className={`flex items-center justify-center bg-[#131842] bg-opacity-[40%] backdrop-blur-lg backdrop-saturate-300 w-full h-full`}>
                <div className="flex justify-evenly w-[90%] h-[80%]">
                <div className="flex flex-col justify-center text-[3rem] w-[40%] text-white font-bold leading-[1.2]">
                    <span>Moments become</span>
                    <span className={`text-[var(--buttons)]`}>memories</span>
                    <span>— don't miss out!</span>
                </div>

                    <div className="flex items-center rounded-lg  overflow-hidden max-w-md w-[50%]">
                        <div className="w-full p-8">
                        <p className="text-[3rem] text-center text-white font-bold">Welcome Back!</p>
                        <div className="mt-4">
                            <label className="block text-white text-sm font-bold mb-2">
                            Email Address / Username
                            </label>
                            <input
                            name="email"
                            value={userDetails.email}
                            onChange={handleChange}
                            className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--input)]`}
                            type="email"
                            autoComplete="off" autoCorrect="off" spellCheck="false"
                            placeholder="Email address / Username"
                            required
                            />
                        </div>
                        <div className="mt-4 flex flex-col justify-between">
                            <div className="flex justify-between">
                                <label className="block text-white text-sm font-bold mb-2">
                                    Password
                                </label>
                            </div>
                            <div className="flex">
                                <input
                                name="password"
                                value={userDetails.password}
                                onChange={handleChange}
                                className={`text-white rounded-l-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--input)]`}
                                type={visible ? "text" : "password"}
                                autoComplete="new-password" autoCorrect="off" spellCheck="false"
                            placeholder="********"
                                />
                                <button
                                    type="button"
                                    onClick={() => setVisible(!visible)}
                                    className={`flex items-center text-white px-4 block rounded-r-xl focus:outline-none bg-[var(--input)]`}
                                    >
                                    {!visible ? <FaEye /> : <LuEyeClosed />}
                                </button>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button onClick={onSubmit} id="submitButton" className={`text-white font-bold py-[0.6rem] w-full rounded-2xl bg-[var(--buttons)]`}>
                            Log In
                            </button>
                        </div>
                        <div className="mt-4 flex items-center w-full text-center">
                            <div
                            href="#"
                            className="text-xs text-gray-500 capitalize text-center w-full"
                            >
                            Don&apos;t have any account yet?
                            <Link to={'/signup'} className={`hover:underline text-[var(--buttons)]`}> Sign Up</Link>
                            </div>
                        </div>
                        <div className={`text-xs text-center w-full hover:cursor-pointer hover:underline text-[var(--buttons)]`}
                        onClick = {forget}>
                                Forgot password?
                            </div >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogIn;