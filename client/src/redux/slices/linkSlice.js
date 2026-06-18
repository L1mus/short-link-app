import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    links: [],
    totalLinks: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    selectedLink: null,
};

const linkSlice = createSlice({
    name: 'link',
    initialState,
    reducers: {
        // Fetch all links
        fetchLinksStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchLinksSuccess(state, action) {
            state.isLoading = false;
            state.links = action.payload.links;
            state.totalLinks = action.payload.totalLinks;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.error = null;
        },
        fetchLinksFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Create link
        createLinkStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        createLinkSuccess(state, action) {
            state.isLoading = false;
            state.links = [action.payload, ...state.links];
            state.totalLinks += 1;
            state.error = null;
        },
        createLinkFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Delete link
        deleteLinkStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        deleteLinkSuccess(state, action) {
            state.isLoading = false;
            state.links = state.links.filter((link) => link._id !== action.payload);
            state.totalLinks -= 1;
            state.error = null;
        },
        deleteLinkFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Select a single link (for detail/edit)
        setSelectedLink(state, action) {
            state.selectedLink = action.payload;
        },
        clearSelectedLink(state) {
            state.selectedLink = null;
        },

        // Set page
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },

        // Clear errors
        clearLinkError(state) {
            state.error = null;
        },

        // Reset state on logout
        resetLinks(state) {
            Object.assign(state, initialState);
        },
    },
});

export const {
    fetchLinksStart,
    fetchLinksSuccess,
    fetchLinksFailure,
    createLinkStart,
    createLinkSuccess,
    createLinkFailure,
    deleteLinkStart,
    deleteLinkSuccess,
    deleteLinkFailure,
    setSelectedLink,
    clearSelectedLink,
    setCurrentPage,
    clearLinkError,
    resetLinks,
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
