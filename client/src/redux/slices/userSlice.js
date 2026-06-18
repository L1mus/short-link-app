import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api.js';

// Async Thunks

export const fetchProfileThunk = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/users/profile');
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to load profile.'
            );
        }
    }
);

//Initial State

const initialState = {
    profile: null,
    isLoading: false,
    error: null,
};

// Slice

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError(state) {
            state.error = null;
        },
        resetUser(state) {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfileThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(fetchProfileThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUserError, resetUser } = userSlice.actions;

// Selectors

export const selectProfile = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;