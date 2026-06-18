import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLinksApi, createLinkApi, deleteLinkApi } from '../../features/link/index.js';

// Async Thunks
export const fetchLinksThunk = createAsyncThunk(
    'link/fetchLinks',
    async ({ page = 1, search = '' } = {}, { rejectWithValue }) => {
        try {
            const res = await getLinksApi({ page, search });
            const { data, meta } = res.data;
            return {
                links: data || [],
                totalLinks: meta?.total_data || 0,
                currentPage: page,
                totalPages: meta?.['total-page'] || 1,
            };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to load links.'
            );
        }
    }
);

export const createLinkThunk = createAsyncThunk(
    'link/createLink',
    async ({ original_url, optional_slug }, { rejectWithValue }) => {
        try {
            const res = await createLinkApi({
                original_url,
                optional_slug: optional_slug || undefined,
            });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to create link.'
            );
        }
    }
);

export const deleteLinkThunk = createAsyncThunk(
    'link/deleteLink',
    async (linkId, { rejectWithValue }) => {
        try {
            await deleteLinkApi(linkId);
            return linkId;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to delete link.'
            );
        }
    }
);

// Initial State

const initialState = {
    links: [],
    totalLinks: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    selectedLink: null,
};

// Slice

const linkSlice = createSlice({
    name: 'link',
    initialState,
    reducers: {
        setSelectedLink(state, action) {
            state.selectedLink = action.payload;
        },
        clearSelectedLink(state) {
            state.selectedLink = null;
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        clearLinkError(state) {
            state.error = null;
        },
        resetLinks(state) {
            Object.assign(state, initialState);
        },
        incrementLocalClick(state, action) {
            const clickedShortLink = action.payload;
            const linkIndex = state.links.findIndex(
                (link) => link.short_link === clickedShortLink
            );
            if (linkIndex !== -1) {
                state.links[linkIndex].click_count += 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLinksThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLinksThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.links = action.payload.links;
                state.totalLinks = action.payload.totalLinks;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.error = null;
            })
            .addCase(fetchLinksThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Create link
        builder
            .addCase(createLinkThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createLinkThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.links = [action.payload, ...state.links];
                    state.totalLinks += 1;
                }
                state.error = null;
            })
            .addCase(createLinkThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Delete link
        builder
            .addCase(deleteLinkThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteLinkThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.links = state.links.filter(
                    (link) => link.id !== action.payload
                );
                state.totalLinks = Math.max(0, state.totalLinks - 1);
                state.error = null;
            })
            .addCase(deleteLinkThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setSelectedLink,
    clearSelectedLink,
    setCurrentPage,
    clearLinkError,
    resetLinks,
    incrementLocalClick,
} = linkSlice.actions;

// Selectors

export const selectLinks = (state) => state.link.links;
export const selectTotalLinks = (state) => state.link.totalLinks;
export const selectCurrentPage = (state) => state.link.currentPage;
export const selectTotalPages = (state) => state.link.totalPages;
export const selectLinkLoading = (state) => state.link.isLoading;
export const selectLinkError = (state) => state.link.error;
export const selectSelectedLink = (state) => state.link.selectedLink;

export default linkSlice.reducer;