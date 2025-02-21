function Messages () {
    return (
        <section className={`fixed top-[2rem] md:top-[4rem] right-[6rem] hidden md:flex md:flex-col overflow-auto w-[20rem] lg:max-w-sm bg-[${_COLOR.less_light}]`}>
            <div className="search-box p-4 flex-none">
                <form onsubmit="">
                    <div className="relative">
                        <label>
                            <input className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                                type="text" value="" placeholder="Search Messenger"/>
                            <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                                <svg viewBox="0 0 24 24" className="w-6 h-6">
                                    <path fill="#bbb"
                                        d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
                                </svg>
                            </span>
                        </label>
                    </div>
                </form>
            </div>
            {/* <div className="contacts p-2 flex-1 overflow-y-scroll">
                <div className="flex justify-between items-center p-3 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt=""
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Angelina Jolie</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">Ok, see you at the subway in a bit.</p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">Just now</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt=""
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Scarlett Johansson</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">You sent a photo.</p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">1h</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt=""
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>John Snow</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">You missed a call John.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">4h</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Emma Watson</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">You sent a video.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">11 Feb</p>
                        </div>
                    </div>
                    <div className="w-4 h-4 flex flex-shrink-0 hidden md:block group-hover:block">
                        <img className="rounded-full w-full h-full object-cover" alt="user2"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"/>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
                            <div className="bg-green-500 rounded-full w-3 h-3"></div>
                        </div>
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Sunny Leone</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">Ah, it was an awesome one night stand.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">1 Feb</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Bruce Lee</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">You are a great human being.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">23 Jan</p>
                        </div>
                    </div>
                    <div className="w-4 h-4 flex flex-shrink-0 hidden md:block group-hover:block">
                        <img className="rounded-full w-full h-full object-cover" alt="user2"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"/>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-10 h-10 object-cover absolute ml-6"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                        <img className="shadow-md rounded-full w-10 h-10 object-cover absolute mt-6"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
                            <div className="bg-green-500 rounded-full w-3 h-3"></div>
                        </div>
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>TailwindCSS Group</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">Adam: Hurray, Version 2 is out now!!.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">23 Jan</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Will Smith</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">WTF dude!! absofuckingloutely.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">13 Dec</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Brad Pitt</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">you called Brad.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">31 Dec</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
                            <div className="bg-green-500 rounded-full w-3 h-3"></div>
                        </div>
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Tom Hanks</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">Tom called you.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">31 Dec</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Dwayne Johnson</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">How can i forget about that man!.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">12 Nov</p>
                        </div>
                    </div>
                    <div className="w-4 h-4 flex flex-shrink-0 hidden md:block group-hover:block">
                        <img className="rounded-full w-full h-full object-cover" alt="user2"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"/>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Johnny Depp</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">Alright! let's catchup tomorrow!.
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">4 Nov</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
                            <div className="bg-green-500 rounded-full w-3 h-3"></div>
                        </div>
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Leonardo Dicaprio</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">How can you leave Rose dude. I hate you!
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">26 Oct</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt="User2"
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p>Tom Cruise</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                                <p className="truncate">Happy birthday to you my friend!
                                </p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">2 Oct</p>
                        </div>
                    </div>
                    <div className="w-4 h-4 flex flex-shrink-0 hidden md:block group-hover:block">
                        <img className="rounded-full w-full h-full object-cover" alt="user2"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"/>
                    </div>
                </div>
            </div>  */}
            <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative">
                    <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img className="shadow-md rounded-full w-full h-full object-cover"
                            src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                            alt=""
                        />
                        <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
                            <div className="bg-green-500 rounded-full w-3 h-3"></div>
                        </div>
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                        <p className="font-bold">Tony Stark</p>
                        <div className="flex items-center text-sm font-bold">
                            <div className="min-w-0">
                                <p className="truncate">Hey, Are you there?</p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">10min</p>
                        </div>
                    </div>
                    <div className="bg-blue-700 w-3 h-3 rounded-full flex flex-shrink-0 hidden md:block group-hover:block"></div>
                </div>
        </section>
    )
}

export default Messages;