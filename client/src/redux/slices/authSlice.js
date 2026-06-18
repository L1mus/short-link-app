import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi } from '../../features/auth/index.js';

// Async Thunks

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await loginApi(credentials);
            return {
                user: { email: res.data.data.email },
                token: res.data.data.token,
            };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Login failed. Please try again.'
            );
        }
    }
);

export const registerThunk = createAsyncThunk(
    'auth/register',
    async (data, { rejectWithValue }) => {
        try {
            await registerApi(data);
            return { email: data.email };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Registration failed. Please try again.'
            );
        }
    }
);

// Initial State

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    registeredEmail: null,
    isActivationSuccess: false,
    resetPassEmail: null,
};

// Slice

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
        },
        updateUserProfile(state, action) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        clearError(state) {
            state.error = null;
        },
        setResetPassEmail(state, action) {
            state.resetPassEmail = action.payload;
        },
        clearResetPassEmail(state) {
            state.resetPassEmail = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Register
        builder
            .addCase(registerThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.registeredEmail = action.payload.email;
                state.isActivationSuccess = true;
                state.error = null;
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
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