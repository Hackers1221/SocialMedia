import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/Slices/theme.slice";

export default function ModeButton() {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <button
      aria-label="Toggle dark/light mode"
      onClick={() => dispatch(toggleTheme())}
      className="w-12 h-6 rounded-full bg-white flex items-center p-1 cursor-pointer focus:outline-none shadow relative"
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-white transition-transform duration-300 ease-in-out
          ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}
      >
        {theme === "dark" ? (
          <i className="fa-solid fa-moon text-black"></i>
        ) : (
          <i className="fa-solid fa-sun text-yellow-400"></i>
        )}
      </div>
    </button>
  );
}
