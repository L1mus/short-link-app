import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    registeredEmail: null,
    isActivationSuccess: false,
    resetPassEmail: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login
        loginStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        },
        loginFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Register
        registerStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        registerSuccess(state, action) {
            state.isLoading = false;
            state.registeredEmail = action.payload.email;
            state.isActivationSuccess = true;
            state.error = null;
        },
        registerFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Logout
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
        },

        // Update user profile
        updateUserProfile(state, action) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },

        // Clear errors
        clearError(state) {
            state.error = null;
        },

        // Reset password flow
        setResetPassEmail(state, action) {
            state.resetPassEmail = action.payload;
        },
        clearResetPassEmail(state) {
            state.resetPassEmail = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    logout,
    updateUserProfile,
    clearError,
    setResetPassEmail,
    clearResetPassEmail,
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.token;

export default authSlice.reducer;
