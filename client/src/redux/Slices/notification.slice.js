import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

const initialState = {};

// Reducers for delete Notifications

// 1) Non follow request notification
export const deleteNonFR = createAsyncThunk('/notification/deleteNonFollowRequests', async (userId) => {
    if(!userId) return;
    try {
        const response = await axiosInstance.delete(`notification/non-follow/${userId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if (!response) toast.error('Something went wrong!');
        return;
    } catch (error) {
        toast.error(error.response.data.error || "An error occurred!");
    }
});

// 2) Reject follow request
export const rejectFR = createAsyncThunk('/notification/rejectFollowRequests', async ({ sender, recipient }) => {
    if (!sender || !recipient) return;
    try {
        const response = await axiosInstance.delete(`notification/follow`, {
            data: { sender, recipient },
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        if (!response) toast.error('Something went wrong!');
        return;
    } catch (error) {
        toast.error(error.response.data.error || "An error occurred!");
    }
});


// 2) Accept follow request
export const acceptFR = createAsyncThunk('/notification/acceptFollowRequests', async ({sender, recipient}) => {
    if(!sender || !recipient) return;
    try {
        const response = await axiosInstance.post(`notification/follow`, {sender, recipient}, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if (!response) toast.error('Something went wrong!');
        return response;
    } catch (error) {
        toast.error(error.response.data.error || "An error occurred!");
    }
});

const NotificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
});

export default NotificationSlice.reducer;
