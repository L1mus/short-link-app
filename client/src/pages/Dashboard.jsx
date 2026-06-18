import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

import { getLinksApi } from '../features/link/index.js';
import {
    fetchLinksStart,
    fetchLinksSuccess,
    fetchLinksFailure,
    deleteLinkStart,
    deleteLinkSuccess,
    deleteLinkFailure,
    setCurrentPage,
    selectLinks,
    selectTotalLinks,
    selectCurrentPage,
    selectTotalPages,
    selectLinkLoading,
} from '../redux/slices/linkSlice.js';
import { deleteLinkApi } from '../features/link/index.js';

import iconCopy from '../assets/icons/copy.svg'
import iconTrash from '../assets/icons/trash.svg'
import iconCalender from  '../assets/icons/calender.svg'
import iconChain from  '../assets/icons/chain.svg'
import iconChart from  '../assets/icons/chart.svg'



const CopyIcon = () => (
    <img src={iconCopy} alt="copy"/>
);

const TrashIcon = () => (
    <img src={iconTrash} alt=""/>
);

const LinkIcon = () => (
    <img src={iconChain} alt=""/>
);

const CalendarIcon = () => (
    <img src={iconCalender} alt="link"/>
);

const ClickIcon = () => (
    <img src={iconChart} alt=""/>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const links = useSelector(selectLinks);
    const totalLinks = useSelector(selectTotalLinks);
    const currentPage = useSelector(selectCurrentPage);
    const totalPages = useSelector(selectTotalPages);
    const isLoading = useSelector(selectLinkLoading);

    const loadLinks = useCallback(async (page = 1, searchQuery = '') => {
        dispatch(fetchLinksStart());
        try {
            const res = await getLinksApi({ page, search: searchQuery });
            const { data, meta } = res.data;
            dispatch(
                fetchLinksSuccess({
                    links: data || [],
                    totalLinks: meta?.total_data || 0,
                    currentPage: page,
                    totalPages: meta?.['total-page'] || 1,
                }),
            );
        } catch (err) {
            dispatch(fetchLinksFailure(err.response?.data?.message || 'Gagal memuat data'));
        }
    }, [dispatch]);

    useEffect(() => {
        loadLinks(currentPage, search);
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadLinks(1, search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (linkId) => {
        if (!window.confirm('delete this link?')) return;
        dispatch(deleteLinkStart());
        try {
            await deleteLinkApi(linkId);
            dispatch(deleteLinkSuccess(linkId));
        } catch (err) {
            dispatch(deleteLinkFailure(err.response?.data?.message || 'Failed to delete'));
        }
    };

    const handleCopy = (shortLink, id) => {
        navigator.clipboard.writeText(`https://${shortLink}`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }).toUpperCase();
    };

    const formatClicks = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n);

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f6fa]">
            <Header />

            <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
                {/* Page header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Links</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Manage and track your shortened digital assets.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Total Active
                        </p>
                        <p className="text-3xl font-extrabold text-blue-primary">
                            {totalLinks}
                        </p>
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative mb-6">
                    <Input
                        type="text"
                        placeholder="Search by name or URL..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        prefix={
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        }
                    />
                </div>

                {/* Links list */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-6 h-6 rounded-full border-2 border-blue-primary border-t-transparent animate-spin" />
                    </div>
                ) : links.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-sm">Belum ada link. Buat link pertamamu!</p>
                        <Button
                            className="mt-4"
                            size="sm"
                            onClick={() => navigate('/create-link')}
                        >
                            + Create New Link
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {links.map((link) => (
                            <div
                                key={link.short_link}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                            >
                                <div className="min-w-0 flex-1">
                                    {/* Short link */}
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <LinkIcon />
                                        <span className="text-sm font-semibold text-blue-primary truncate">
                                            {link.short_link}
                                        </span>
                                    </div>
                                    {/* Original URL */}
                                    <p className="text-xs text-gray-400 truncate mb-2">
                                        {link.original_link}
                                    </p>
                                    {/* Meta */}
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon />
                                            {formatDate(link.created_at)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ClickIcon />
                                            {formatClicks(link.click_count)} CLICKS
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleCopy(link.short_link, link.short_link)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-primary transition-colors"
                                        title="Copy link"
                                    >
                                        {copiedId === link.short_link ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <CopyIcon />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Hapus link"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={() => {
                                const prev = currentPage - 1;
                                dispatch(setCurrentPage(prev));
                                loadLinks(prev, search);
                            }}
                            disabled={currentPage <= 1}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            &lt; Prev Page
                        </button>

                        <span className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-primary text-white font-semibold text-xs">
                                {currentPage}
                            </span>
                            of {totalPages}
                        </span>

                        <button
                            onClick={() => {
                                const next = currentPage + 1;
                                dispatch(setCurrentPage(next));
                                loadLinks(next, search);
                            }}
                            disabled={currentPage >= totalPages}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Next &gt;
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
