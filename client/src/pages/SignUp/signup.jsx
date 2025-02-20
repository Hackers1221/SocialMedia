import Calendar from "../../layouts/calendar";
import { useState, useRef } from "react";
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
            console.log(res);
            if (res.payload) navigate('/login');
            else resetDetails();

        } catch (error) {
            toast.error(error);
        }


    }

    return (
        // eslint-disable-next-line no-undef
        <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0" style={{ backgroundColor: _COLOR.dark}}>
        <div className="flex bg-transparent rounded-lg shadow-lg border overflow-hidden max-w-md w-full">
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
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
                type="text"
                style={{backgroundColor: _COLOR.darkest}}
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
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
                type="text"
                style={{backgroundColor: _COLOR.darkest}}
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
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
                type="email"
                style={{backgroundColor: _COLOR.darkest}}
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
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
                type= "password"
                style={{backgroundColor: _COLOR.darkest}}
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
                    className="text-black py-2 px-4 block w-full focus:outline-none"
                    style={{backgroundColor: _COLOR.darkest}}
                    type={visible ? "text" : "password"}
                    />
                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="p-2 flex items-center text-gray-500"
                        style={{backgroundColor: _COLOR.darkest}}
                        >
                        {!visible ? <FaEye /> : <LuEyeClosed />}
                    </button>
                </div>
            </div>
            <div className="mt-8">
                <button onClick={onSubmit} className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                Sign Up
                </button>
            </div>
            <div className="mt-4 flex items-center w-full text-center">
                <div
                className="text-xs text-gray-500 capitalize text-center w-full"
                >
                Already have an account?
                <Link to={'/login'} className="text-blue-700"> Sign In</Link>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default SignUp;