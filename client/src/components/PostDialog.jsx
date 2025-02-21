import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

export default function PostDialog({ open, setOpen, onAddPost }) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[9999]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 z-[9998] transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            {/* Centered Title with Icon */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center">
              <div className="flex items-center justify-center size-14 rounded-full">
                <i className="fa-solid fa-photo-film text-red-600 text-3xl"></i>
              </div>
              <DialogTitle as="h3" className="mt-3 text-lg font-semibold text-gray-900">
                Add Post
              </DialogTitle>
            </div>

            {/* Post & Reel Buttons in One Line */}
            <div className="bg-gray-50 px-4 py-6 flex flex-col md:flex-row gap-4 justify-center sm:px-6">
              <button
                type="button"
                onClick={onAddPost}
                className="flex items-center w-full md:w-1/2 justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 shadow-xs hover:bg-gray-100"
              >
                <i className="fa-solid fa-pen-to-square text-red-600 text-lg mr-2"></i> Add a post
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center w-full md:w-1/2  justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 shadow-xs hover:bg-gray-100"
              >
                <i className="fa-solid fa-film text-blue-600 text-lg mr-2"></i> Add a reel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
