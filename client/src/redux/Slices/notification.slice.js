import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { showToast } from "./toast.slice";

const initialState = {};

// Reducers for delete Notifications

// 1) Non follow request notification
export const deleteNonFR = createAsyncThunk('/notification/deleteNonFollowRequests', async (userId, { dispatch }) => {
    if(!userId) return;
    try {
        const response = await axiosInstance.delete(`notification/non-follow/${userId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if (!response) dispatch (showToast ({ message: "Something went wrong!", type: 'error' }));
        return;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

// 2) Reject follow request
export const rejectFR = createAsyncThunk('/notification/rejectFollowRequests', async ({ sender, recipient}, { dispatch }) => {
    if (!sender || !recipient) return;
    try {
        const response = await axiosInstance.delete(`notification/follow`, {
            data: { sender, recipient },
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        if (!response) dispatch (showToast ({ message: "Something went wrong!", type: 'error' }));
        return;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});


// 2) Accept follow request
export const acceptFR = createAsyncThunk('/notification/acceptFollowRequests', async ({sender, recipient}, { dispatch }) => {
    if(!sender || !recipient) return;
    try {
        const response = await axiosInstance.post(`notification/follow`, {sender, recipient}, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if (!response) dispatch (showToast ({ message: "Something went wrong!", type: 'error' }));
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

const NotificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
});

export default NotificationSlice.reducer;
