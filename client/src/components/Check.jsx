import { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export default function Check() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-[#eaf1ff] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl flex">
                <div className="w-1/2 pr-8">
                    <h1 className="text-4xl font-bold mb-2">Sign Up</h1>
                    <p className="text-gray-500 text-sm mb-6">Secure Your Communications with Easymail</p>

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Daniel Ahmadi"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <FaCheck className="absolute right-3 top-3 text-green-500" />
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="11Danielahmadi@gmail.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <FaCheck className="absolute right-3 top-3 text-green-500" />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {showPassword ? (
                                <FaEyeSlash
                                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                    onClick={() => setShowPassword(false)}
                                />
                            ) : (
                                <FaEye
                                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                    onClick={() => setShowPassword(true)}
                                />
                            )}
                        </div>

                        <p className="text-xs text-gray-400">
                            ✅ Least 8 characters<br />
                            ✅ Least one number (0-9) or a symbol<br />
                            ✅ Lowercase (a-z) and uppercase (A-Z)
                        </p>

                        <input
                            type="password"
                            placeholder="Re-Type Password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Sign Up
                        </button>

                        <div className="text-center text-sm text-gray-500 my-4">Or</div>

                        <div className="flex justify-center space-x-4">
                            <button className="bg-white border border-gray-300 p-2 rounded-lg">
                                <FcGoogle size={24} />
                            </button>
                            <button className="bg-white border border-gray-300 p-2 rounded-lg">
                                <FaFacebookF size={24} className="text-blue-600" />
                            </button>
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-500 mt-6">
                        Already a member? <span className="text-blue-600 cursor-pointer">Sign in</span>
                    </div>
                </div>

                <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6">
                    <div className="bg-white shadow-lg rounded-lg p-4 text-center w-3/4 mb-6">
                        <p className="text-gray-800 font-bold text-xl">Inbox</p>
                        <p className="text-3xl font-bold text-blue-600">176,18</p>
                        <div className="mt-2 text-blue-500">45</div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-4 w-3/4">
                        <p className="text-gray-800 font-bold">Your data, your rules</p>
                        <p className="text-sm text-gray-500">Your data belongs to you, and our encryption ensures that.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}