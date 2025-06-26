import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--buttons)] rounded-full animate-spin" />
    </div>
  );
};

export default Loader;