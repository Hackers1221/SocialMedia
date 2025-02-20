import toast from "react-hot-toast";
import { useState } from "react";
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

            console.log (userDetails);

            const res = await dispatch (login (userDetails));
            if (res.payload) navigate('/');
            else resetDetails();

        } catch (error) {
            toast.error(error);
        }
    }

    return (
        // eslint-disable-next-line no-undef
        <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0" style={{
            backgroundColor: _COLOR.light,
          }}>
        <div className="flex rounded-lg shadow-lg border overflow-hidden max-w-md w-full" style={{backgroundColor: _COLOR.lightest}}>
            <div className="w-full p-8">
            <p className="text-xl text-gray-600 text-center">Welcome Back!</p>
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
                </label>
                <input
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                className="text-black border  border-[2px] rounded py-2 px-4 block w-full focus:outline-none"
                style={{borderColor: _COLOR.light, backgroundColor: _COLOR.lightest}}
                type="email"
                autoComplete="off" autoCorrect="off" spellCheck="false"
                placeholder="Email address"
                required
                />
            </div>
            <div className="mt-4 flex flex-col justify-between">
                <div className="flex justify-between">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                </div>
                <div className="flex">
                    <input
                    name="password"
                    value={userDetails.password}
                    onChange={handleChange}
                    className="text-black border-l-[2px] border-t-[2px] border-b-[2px] py-2 px-4 block w-full focus:outline-none"
                    style={{borderColor: _COLOR.light, backgroundColor: _COLOR.lightest}}
                    type={visible ? "text" : "password"}
                    autoComplete="new-password" autoCorrect="off" spellCheck="false"
                placeholder="********"
                    />
                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="p-2 flex items-center border-r-[2px] border-t-[2px] border-b-[2px] text-gray-500"
                        style={{borderColor: _COLOR.light, backgroundColor: _COLOR.lightest}}
                        >
                        {!visible ? <FaEye /> : <LuEyeClosed />}
                    </button>
                </div>
            </div>
            <div className="mt-8">
                <button onClick={onSubmit} className="text-white font-bold py-2 px-4 w-full rounded" style={{backgroundColor: _COLOR.dark}}>
                Log In
                </button>
            </div>
            <div className="mt-4 flex items-center w-full text-center">
                <div
                href="#"
                className="text-xs text-gray-500 capitalize text-center w-full"
                >
                Don&apos;t have any account yet?
                <Link to={'/signup'} style={{color: _COLOR.dark}}> Sign Up</Link>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default LogIn;