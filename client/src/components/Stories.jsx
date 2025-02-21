function Stories () {
    return (
        <section className={`fixed top-0 md:top-[3.5rem] md:right-0 bg-[${_COLOR.less_light}] min-h-screen md:flex flex-col items-center pr-4 pt-4`}>
            <ul className="md:flex-col items-center justify-center md:space-x-8">
                <li className="flex flex-col items-center space-y-2 bg-yellow-500">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                        {/* <button className={`transition duration-500 absolute bottom-0 right-0 bg-[${_COLOR.dark}] h-8 w-8 rounded-full text-white text-2xl font-semibold border-4 border-white flex justify-center items-center hover:bg-blue-900`}>+</button> */}
                    </div>
                    <p className="text-sm">you</p>
                </li>
                <li className="flex flex-col items-center bg-yellow-500 w-full">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className="text-sm">dealer_101</p>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className="text-sm">raftaar_086</p>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className="text-sm">forhadx_9008</p>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className="text-sm">shahnoor_877</p>
                </li>
            </ul>
        </section>
    )
}

export default Stories;