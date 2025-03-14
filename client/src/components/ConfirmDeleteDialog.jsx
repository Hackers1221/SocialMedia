import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { IoMdTrash } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";

export default function ConfirmDeleteDialog({ open, setOpen, onDelete, deleting }) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[9999]">
      <DialogBackdrop
        className="fixed inset-0 bg-gray-500/75 z-[9998] transition-opacity"
      />
      <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl p-6"
          >
            {/* Centered Title with Animated Delete Icon */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center">
              <motion.div
                className="flex items-center justify-center size-14 rounded-full text-red-600"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.2 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
              >
                <IoMdTrash className="text-3xl" />
              </motion.div>
              <DialogTitle as="h3" className="mt-3 text-lg font-semibold text-gray-900">
                Confirm Deletion
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Are you sure you want to delete this Account? This action cannot be undone.
              </p>
            </div>

            {/* Cancel & Delete Buttons */}
            <div className="bg-gray-50 px-4 py-6 flex flex-col md:flex-row gap-4 justify-center sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center w-full md:w-1/2 justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 shadow-xs hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center w-full md:w-1/2 justify-center rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? <ImSpinner2 className="animate-spin text-lg" /> : "Delete"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
