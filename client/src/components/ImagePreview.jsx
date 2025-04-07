import { useEffect, useRef } from "react";

function ImagePreview ({ url, isOpen, setOpen }) {
    if (!isOpen) return null;

    const dialogRef = useRef(null);

    useEffect (() => {
        if (isOpen && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [isOpen]);


    return (
        <>
            {open && <div className="fixed left-0 top-0 inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[20]"></div>}
            <dialog ref={dialogRef} className="w-[50%] h-[80%] bg-transparent">
                <button onClick={() => setOpen (!isOpen)} className={`fixed top-5 right-6 w-max h-max text-white font-bold text-xl focus:outline-none hover:cursor-pointer z-[500]`}>✕</button>
                <img src={url} className="w-full h-full object-contain"/>
            </dialog>
        </>
    )
}

export default ImagePreview;