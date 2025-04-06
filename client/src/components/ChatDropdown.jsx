import React, { useState, useRef, useEffect } from "react";

const ChatDropdown = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const options = ['New chat', 'New group']

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-48" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 text-left bg-white border rounded shadow hover:bg-gray-100"
      >
        {selected || "Select an option"}
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatDropdown;
