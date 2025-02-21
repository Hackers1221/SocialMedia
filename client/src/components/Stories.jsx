function Stories () {
    return (
        <section class="fixed top-[3.5rem] right-0 bg-transparent min-h-screen flex flex-row md:flex-col items-center pt-5 pr-4">
            <ul class="flex flex-row md:flex-col items-center justify-center md:space-x-8 gap-2">
                <li class="flex flex-col items-center space-y-2">
                    <div class="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1 relative">
                        <a class="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img class="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                        <button class="transition duration-500 absolute bottom-0 right-0 bg-blue-700 h-8 w-8 rounded-full text-white text-2xl font-semibold border-4 border-white flex justify-center items-center hover:bg-blue-900">+</button>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>beast0E4</p>
                </li>
                <li class="flex flex-col items-center space-y-2">
                    <div class="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a class="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img class="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>dealer_101</p>
                </li>
                <li class="flex flex-col items-center space-y-2">
                    <div class="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a class="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img class="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>rounak_086</p>
                </li>
                <li class="flex flex-col items-center space-y-2">
                    <div class="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a class="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img class="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>forhadx_9008</p>
                </li>
                <li class="flex flex-col items-center space-y-2">
                    <div class="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a class="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img class="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image" />
                        </a>
                    </div>
                    <p className={`text-sm text-[${_COLOR.lightest}]`}>shahnoor_877</p>
                </li>
            </ul>
        </section>
    )
}

export default Stories;