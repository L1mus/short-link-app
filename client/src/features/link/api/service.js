import api from '../../../service/api.js';


/**
 * @param {{ page?: number, search?: string }} params
 */
export const getLinksApi = (params = {}) =>
    api.get('/links', { params });

/**
 * @param {{ originalUrl: string, customSlug?: string }} data
 */
export const createLinkApi = (data) =>
    api.post('/links', data);

/**
 * @param {string} id
 */
export const deleteLinkApi = (id) =>
    api.delete(`/links/${id}`);

/**
 * @param {string} id
 */
export const getLinkByIdApi = (id) =>
    api.get(`/links/${id}`);
