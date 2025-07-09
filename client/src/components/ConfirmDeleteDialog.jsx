// UI components from Headless UI
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
// Animation library
import { motion } from "framer-motion";
// Icons
import { IoMdTrash } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
// React and Redux hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Navigation
import { useNavigate } from "react-router-dom";

// Redux actions
import { deleteUser } from "../redux/Slices/auth.slice";
import { deleteAnnouncement } from "../redux/Slices/announcement.slice";
import { showToast } from "../redux/Slices/toast.slice";
import { DeletePost, getAllPosts } from "../redux/Slices/post.slice";
import { deletePulse } from "../redux/Slices/pulse.slice";

// Confirmation dialog component
export default function ConfirmDeleteDialog({ open, setOpen, type, id, data }) {
    // Accessing Redux state
    const socket = useSelector((state) => state.socket.socket);
    const liveGroup = useSelector((state) => state.group.liveGroup);
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // UI and delete status state
    const [isDeleting, setDeleting] = useState(false);
    const [message, setMessage] = useState("");
    const [warning, setWarning] = useState("");

    // Handle account deletion
    const handleDeleteAccount = async () => {
        setDeleting(true);
        const deleted = await dispatch(deleteUser(authState?.data?._id));
        if (deleted.payload) {
            navigate("/signup");
        }
        setOpen(false);
        setDeleting(false);
    };

    // Handle group deletion via socket
    function handleGroupDelete() {
        setDeleting(true);
        if (socket && socket.connected) {
            socket.emit("delete-group", {
                _id: liveGroup._id,
                userId: authState.data?._id
            });
        }
        setOpen(false);
        setDeleting(false);
    }

    // Handle announcement deletion
    async function handleAnnouncementDelete() {
        setDeleting(true);
        try {
            await dispatch(deleteAnnouncement(id));
        } catch (error) {
            dispatch(showToast({ message: error.message, type: 'error' }));
            setDeleting(false);
        } finally {
            setOpen(false);
            setDeleting(false);
        }
    }

    // Handle post deletion
    async function handlePostDelete() {
        setDeleting(true);
        try {
            await dispatch(DeletePost(data));
        } catch (error) {
            await dispatch(getAllPosts());
            dispatch(showToast({ message: error.message, type: 'error' }));
            setDeleting(false);
        } finally {
            setOpen(false);
            setDeleting(false);
        }
    }

    // Handle pulse deletion
    async function handlePulseDelete() {
        setDeleting(true);
        try {
            await dispatch(deletePulse(data));
        } catch (error) {
            dispatch(showToast({ message: error.message, type: 'error' }));
            setDeleting(false);
        } finally {
            setOpen(false);
            setDeleting(false);
        }
    }

    // Master delete switch
    function onDelete() {
        if (type === "accountDelete") handleDeleteAccount();
        if (type === "groupDelete") handleGroupDelete();
        if (type === "announcementDelete") handleAnnouncementDelete();
        if (type === "postDelete") handlePostDelete();
        if (type === "pulseDelete") handlePulseDelete();
    }

    // Update confirmation message based on delete type
    useEffect(() => {
        if (type === "accountDelete") {
            setMessage("Are you sure you want to delete this account?");
            setWarning("Deleting your account is permanent. All your posts, followers, and personal data will be removed and cannot be recovered. Are you sure you want to proceed?");
        }
        if (type === "groupDelete") {
            setMessage("Are you sure you want to delete this group?");
            setWarning("Deleting the group will remove it from your account, and you won’t be able to view or access its messages anymore. This action is permanent and cannot be undone.");
        }
        if (type === "announcementDelete") {
            setMessage("Are you sure you want to delete this announcement?");
            setWarning("Are you sure you want to delete this announcement? This action cannot be undone");
        }
        if (type === "postDelete") {
            setMessage("Are you sure you want to delete this post?");
            setWarning("Are you sure you want to delete this post? This action cannot be undone");
        }
        if (type === "pulseDelete") {
            setMessage("Are you sure you want to delete this pulse?");
            setWarning("Are you sure you want to delete this pulse? This action cannot be undone");
        }
    }, [type]);

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-100">
            {/* Backdrop */}
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 z-100 transition-opacity" />
            <div className="fixed inset-0 z-100 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
                    <DialogPanel
                        className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl p-6"
                    >
                        {/* Dialog content with trash icon and warning */}
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
                            <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>

                            {/* Warning box */}
                            <div className="mt-2 border-l-[0.5rem] border-[#E97451] bg-[#EFD2B1] p-2">
                                <div className="flex justify-start gap-4 text-[#8B4000] items-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <h2 className="font-bold">Warning</h2>
                                </div>
                                <p className="text-[#CC5500] text-sm">{warning}</p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="bg-gray-50 px-4 py-6 flex flex-col md:flex-row gap-4 justify-center sm:px-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex items-center w-full md:w-1/2 justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 shadow-xs hover:bg-gray-100"
                            >
                                No, cancel
                            </button>
                            <button
                                type="button"
                                onClick={onDelete}
                                disabled={isDeleting}
                                className="flex items-center w-full md:w-1/2 justify-center rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-red-700"
                            >
                                {isDeleting ? (
                                    <ImSpinner2 className="animate-spin text-lg" />
                                ) : (
                                    "Yes, delete"
                                )}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
