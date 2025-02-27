import Calendar from "../../layouts/calendar";
import { useState, useRef, useCallback, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signup } from "../../redux/Slices/auth.slice";

function SignUp () {

    const dispatch = useDispatch ();
    const navigate = useNavigate ();
    const birthRef = useRef (null);

    const [confirmPassword, setConfirmPassword] = useState ("");

    const [userDetails, setUserDetails] = useState ({
        name: "",
        username: "",
        email: "",
        password: "",
        birth: ""
    });

    const [visible, setVisible] = useState(false);

    function handleChange (e) {
        const {name, value} = e.target;
        console.log (name, value);
        if (name !== "confirmPassword") {
            setUserDetails ({
                ...userDetails,
                [name] : value
            })
        }
        else setConfirmPassword (value);
    }

    function handleBirthChange (date) {
        setUserDetails ({
            ...userDetails,
            birth: date
        })
    }

    function resetDetails () {
        setUserDetails ({
            name: "",
            username: "",
            email: "",
            password: "",
            birth: ""
        })

        setConfirmPassword ("");
    }

    async function onSubmit () {
        try {
            if (confirmPassword !== userDetails.password) {
                toast.error ('Passwords do not match'); return;
            }
    
            if (!userDetails.name.trim() || !userDetails.username.trim() || !confirmPassword.trim()) {
                toast.error ('Fields cannot be empty'); return;
            }

            const res = await dispatch (signup (userDetails));

            if (res.payload) navigate('/login');
            else resetDetails();

        } catch (error) {
            toast.error(error);
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
        // eslint-disable-next-line no-undef
        <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0" style={{ backgroundColor: _COLOR.light}}>
        <div className="flex rounded-lg shadow-lg border overflow-hidden max-w-md w-full" style={{ backgroundColor: _COLOR.lightest}}>
            <div className="w-full p-8">
            <p className="text-xl text-gray-600 text-center">Welcome!</p>
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
                </label>
                <input
                name="name"
                value={userDetails.name}
                onChange={handleChange}
                className="text-black border border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
                style={{
                    // borderColor: _COLOR.light,
                    backgroundColor: _COLOR.lightest,
                  }}
                type="text"
                autoComplete="off" autoCorrect="off" spellCheck="false"
                placeholder="Your name"
                required
                />
            </div>
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
                </label>
                <input
                name="username"
                value={userDetails.username}
                onChange={handleChange}
                className="text-black border border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
                style={{
                    // borderColor: _COLOR.light,
                    backgroundColor: _COLOR.lightest,
                }}
                type="text"
                autoComplete="false" autoCorrect="false" spellCheck="false"
                placeholder="Your username"
                required
                />
            </div>
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
                </label>
                <input
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                className="text-black border border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
                style={{
                    // borderColor: _COLOR.light,
                    backgroundColor: _COLOR.lightest,
                  }}
                type="email"
                autoComplete="off" autoCorrect="off" spellCheck="false"
                placeholder="Email address"
                required
                />
            </div>
            <div>
                <Calendar ref={birthRef} value={userDetails.birth} onChange={handleBirthChange}/>
            </div>
            <div className="mt-4 flex flex-col justify-between">
                <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                </label>
                </div>
                <input
                name="password"
                value={userDetails.password}
                onChange={handleChange}
                className="text-gray-700 border border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
                style={{
                    // borderColor: _COLOR.light,
                    backgroundColor: _COLOR.lightest,
                  }}
                type= "password"
                autoComplete="new-password" autoCorrect="off" spellCheck="false"
                placeholder="********"
                />
            </div>
            <div className="mt-4 flex flex-col justify-between">
                <div className="flex justify-between">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Confirm Password
                    </label>
                </div>
                <div className="flex">
                    <input
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    className="text-black  border-l-[2px] border-t-[2px] border-b-[2px] py-2 px-4 block w-full focus:outline-none"
                    style={{
                        // borderColor: _COLOR.light,
                        backgroundColor: _COLOR.lightest,
                      }}
                    type={visible ? "text" : "password"}
                    autoComplete="off" autoCorrect="off" spellCheck="false"
                    placeholder="********"
                    />
                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="p-2 flex items-center border-r-[2px] border-t-[2px] border-b-[2px] text-gray-500"
                        style={{
                            // borderColor: _COLOR.light,
                            backgroundColor: _COLOR.lightest,
                          }}
                        >
                        {!visible ? <FaEye /> : <LuEyeClosed />}
                    </button>
                </div>
            </div>
            <div className="mt-8">
                <button onClick={onSubmit} id="submitButton" className=" text-white font-bold py-2 px-4 w-full rounded" style={{
                    backgroundColor: _COLOR.dark,
                  }}>
                Sign Up
                </button>
            </div>
            <div className="mt-4 flex items-center w-full text-center">
                <div
                className="text-xs text-gray-500 capitalize text-center w-full"
                >
                Already have an account?
                <Link to={'/login'} style={{
                    color: _COLOR.dark,
                  }} id="submitButton"> Sign In</Link>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default SignUp;