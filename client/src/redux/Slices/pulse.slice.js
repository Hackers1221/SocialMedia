import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { showToast } from "./toast.slice";

const initialState = {
    downloadedPulse: [],
    pulseList: [],
    savedList: []
};

export const getAllPulse = createAsyncThunk('posts/getAllPulse', async (_, { dispatch }) => {
    try {
        const response = await axiosInstance.get('pulse', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "Failed to fetch pulses!", type: 'error' }));
    }
});

export const createPulse = createAsyncThunk('post/createPulse', async (pulseData, { dispatch }) => {
    try {
        const response = await axiosInstance.post('pulse', pulseData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "Failed to create post!", type: 'error' }));
    }
});

export const likePulse = createAsyncThunk('pulse/likePulse', async(data, { dispatch }) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`pulse/like/${data._id}`, resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "Failed to like pulse!", type: 'error' }));
    }
})

export const getPulseByUserId = createAsyncThunk('pulse/getPulse' ,async(id, { dispatch }) => {
    try {
        const response = await axiosInstance.get(`pulse/pulse/${id}`, { 
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "Failed to get pulse!", type: 'error' }));
    }
})

export const getSavedPulse = createAsyncThunk('pulse/getSavedPulse' , async(id, { dispatch }) => {
    try {
        const response = await axiosInstance.get(`pulse/save/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "Failed to get saved pulse!", type: 'error' }));
    }
})

export const updateSavedPulse = createAsyncThunk('pulse/updateSavedPulse', async(data, { dispatch }) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`pulse/save/${data._id1}`, resp, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "Failed to get saved pulse!", type: 'error' }));
    }
})

const PulseSlice = createSlice({
    name: 'pulse',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllPulse.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                state.downloadedPulse = action.payload?.data?.pulsedata?.pulse.reverse();
                state.pulseList = state.downloadedPulse;
            })
            .addCase(createPulse.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                console.log (action.payload.data)
                state.downloadedPulse = [action.payload?.data?.pulseData?.pulse, ...state.downloadedPulse];
                state.pulseList = state.downloadedPulse;
            })
            .addCase(getSavedPulse.fulfilled,(state,action) => {
                if(!action.payload?.data) return;
                state.savedList = action.payload?.data?.pulseDetails.reverse();
            })
            .addCase(getPulseByUserId.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                state.pulseList = action.payload?.data?.pulseDetails?.reverse();
            })
    }
});

export default PulseSlice.reducer;
