import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoMdPulse } from "react-icons/io";

export default function PostDialog({ open, setOpen, onAddPost, onAddPulse, onAddVerse}) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[9999]">
      <DialogBackdrop
        className="fixed inset-0 bg-gray-500/75 z-[9998] transition-opacity"
      />
      <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0 ">
          <DialogPanel
            className="relative transform overflow-hidden rounded-lg bg-[var(--card)] text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl p-6"
          >
            {/* Centered Title with Icon */}
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center">
              <div className="flex items-center justify-center size-14 rounded-full">
                <i className="fa-solid fa-photo-film text-[var(--buttons)] text-3xl"></i>
              </div>
              <DialogTitle as="h3" className="mt-3 text-lg font-semibold text-[var(--text)]">
                Add Post
              </DialogTitle>
            </div>

            {/* Post & Reel Buttons in One Line */}
            <div className="px-4 py-6 flex flex-col md:flex-row gap-4 justify-center sm:px-6">
              <button
                type="button"
                onClick={onAddPost}
                className="flex items-center w-full md:w-1/2 justify-center rounded-md px-4 py-3 text-sm font-semibold text-[var(--text)] ring-1 ring-gray-300 hover:ring-2"
              >
                <i className="fa-solid fa-pen-to-square text-[var(--buttons)] text-lg mr-2"></i> Add a post
              </button>
              <button
                type="button"
                onClick={onAddPulse}
                className="flex items-center w-full md:w-1/2  justify-center rounded-md px-4 py-3 text-sm font-semibold text-[var(--text)] ring-1 ring-gray-300 hover:ring-2"
              >
                <IoMdPulse className="text-[var(--buttons)] text-lg mr-2"/> Add a pulse
              </button>
            </div>
            <div className="px-4 sm:px-6">
              <button
                  type="button"
                  onClick={onAddVerse}
                  className="flex items-center w-full  justify-center rounded-md px-4 py-3 text-sm font-semibold text-[var(--text)] ring-1 ring-gray-300 hover:ring-2"
                >
                  <i className="fa-regular fa-comments mr-2 text-[var(--buttons)]"/> Add a verse
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
