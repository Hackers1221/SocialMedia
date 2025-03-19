import { useEffect, useState } from "react";

export default function ModeButton () {

    const [theme, setTheme] = useState ('light');

    return (
    <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-16 h-8 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow"
    >
        <div
        className={`w-8 h-full relative rounded-full transition duration-500 transform p-1 text-white flex justify-center items-center
            ${theme == 'dark' ? "bg-gray-700 translate-x-full" : "bg-yellow-500 -translate-x-2"}`}>
        {theme == 'dark' ? (
            <i className="fa-solid fa-moon"></i>
        ) : (
            <i className="fa-solid fa-sun"></i>
        )}
        </div>
    </button>
    );
}
