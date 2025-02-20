import Calendar from "../../layouts/calendar";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { Link } from "react-router-dom";

function SignUp () {
    const [visible, setVisible] = useState(false);
    return (
        // eslint-disable-next-line no-undef
        <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0" style={{ backgroundColor: _COLOR.dark}}>
        <div className="flex bg-transparent rounded-lg shadow-lg border overflow-hidden max-w-md w-full">
            <div className="w-full p-8">
            <p className="text-xl text-gray-600 text-center">Welcome!</p>
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
                </label>
                <input
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
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
                type="email"
                style={{backgroundColor: _COLOR.darkest}}
                required
                />
            </div>
            <div>
                <Calendar />
            </div>
            <div className="mt-4 flex flex-col justify-between">
                <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                </label>
                </div>
                <input
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
                <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                Sign Up
                </button>
            </div>
            <div className="mt-4 flex items-center w-full text-center">
                <a
                href="#"
                className="text-xs text-gray-500 capitalize text-center w-full"
                >
                Already have an account?
                <Link to={'/login'} className="text-blue-700"> Sign In</Link>
                </a>
            </div>
            </div>
        </div>
        </div>
    )
}

export default SignUp;