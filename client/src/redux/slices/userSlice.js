import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchProfileStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchProfileSuccess(state, action) {
            state.isLoading = false;
            state.profile = action.payload;
            state.error = null;
        },
        fetchProfileFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        updateProfileStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        updateProfileSuccess(state, action) {
            state.isLoading = false;
            state.profile = { ...state.profile, ...action.payload };
            state.error = null;
        },
        updateProfileFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        clearUserError(state) {
            state.error = null;
        },

        resetUser(state) {
            Object.assign(state, initialState);
        },
    },
});

export const {
    fetchProfileStart,
    fetchProfileSuccess,
    fetchProfileFailure,
    updateProfileStart,
    updateProfileSuccess,
    updateProfileFailure,
    clearUserError,
    resetUser,
} = userSlice.actions;

// Selectors
export const selectProfile = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
