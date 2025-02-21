import { IoPerson } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

function Navbar () {
    return (
        <div className={`top-0 bg-[${_COLOR.less_light}] max-w-screen shadow-md flex items-center justify-between px-8 py-2`}>
            <div className={`py-4 flex items-center justify-center`}>
                    <div className="text-xl cursive-text">DropChat</div>
            </div>
            <div className={`p-[0.1rem] w-[35%] flex items-center border border-[${_COLOR.medium}] rounded-3xl`}>
                <FaSearch className={`h-full w-10 px-2 py-2 bg-transparent`} />
                <input 
                    type="text" 
                    className="h-full w-full py-1.5 text-sm bg-transparent outline-none"
                    placeholder="Search..."
                />
            </div>

            <div className="flex justify-end">
                <IoPerson className="w-8 h-8"/>
            </div>
        </div>
    )
}

export default Navbar;