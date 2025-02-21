import { useSelector } from "react-redux";
import Avatar from "./Avatar";

function Stories () {

    const authState = useSelector ((state) => state.auth);


    return (
        <section className="fixed top-[2rem] md:top-[3.5rem] md:right-0 w-full md:w-auto bg-transparent h-max md:min-h-screen flex flex-row md:flex-col items-center pt-5 px-4">

            <ul className="flex flex-row md:flex-col items-center justify-center md:space-x-8 gap-2">
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1 relative">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <Avatar url={authState?.data?.image} />
                        </a>
                        <button className="transition duration-500 absolute bottom-0 right-0 bg-blue-700 h-8 w-8 rounded-full text-white text-2xl font-semibold border-4 border-white flex justify-center items-center hover:bg-blue-900">+</button>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>beast0E4</p>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>dealerAnu_101</p>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>rounak_086</p>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>forhadx_9008</p>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image" />
                        </a>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>shahnoor_877</p>
                </li>
            </ul>
        </section>
    )
}

export default Stories;