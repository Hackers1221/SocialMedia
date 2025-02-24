import React, { useRef, useState } from "react";

function DisplayStory ({ open, setOpen, index }) {

  return (
    <dialog
      ref={dialogRef}
      className={`relative w-[60%] mx-auto p-2 py-4 bg-black shadow-[${_COLOR.less_light}] shadow-xl rounded-lg z-[100]`}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default DisplayStory();
