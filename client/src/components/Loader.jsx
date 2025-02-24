import React from 'react';

function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-transparent bg-opacity-75 backdrop-blur-sm">
      <div className="relative flex space-x-2">
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse delay-100"></div>
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse delay-200"></div>
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
}

export default Loader;
