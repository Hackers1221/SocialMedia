function PrivacyButton ({ isOn, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-14 h-8 flex items-center rounded-full p-1 transition duration-300 ${
        isOn ? "bg-[var(--buttons)]" : "bg-gray-400"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full bg-[var(--card)] border border-[var(--input)] shadow-md transform transition ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
};

export default PrivacyButton;