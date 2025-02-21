import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

export default function PostForm({ open, setOpen }) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 z-[9998] transition-opacity" />
      <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl p-6">
            {/* Title */}
            <DialogTitle as="h3" className="text-xl font-semibold text-gray-900">
              Create Post
            </DialogTitle>
            
            {/* File Upload Button */}
            <label className="mt-6 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center">
                <i className="fa-solid fa-plus text-gray-500 text-3xl"></i>
                <span className="mt-2 text-sm text-gray-600">Add a photo or video</span>
              </div>
              <input type="file" className="hidden" />
            </label>
            
            {/* Caption Input */}
            <textarea
              className="mt-4 w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 resize-none"
              rows="3"
              placeholder="Write a caption..."
            ></textarea>
            
            {/* Post Button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}