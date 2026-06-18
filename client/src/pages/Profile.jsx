import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Button from '../components/ui/Button.jsx';

import {
    fetchProfileThunk,
    selectProfile,
    selectUserLoading,
    selectUserError,
    clearUserError,
} from '../redux/slices/userSlice.js';
import { logout } from '../redux/slices/authSlice.js';
import { resetLinks } from '../redux/slices/linkSlice.js';

import iconPencil from '../assets/icons/pencil.svg';
import iconBell from '../assets/icons/bell.svg';
import iconShield from '../assets/icons/shild.svg';
import iconChain from '../assets/icons/chain.svg';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector(selectProfile);
    const isLoading = useSelector(selectUserLoading);
    const profileError = useSelector(selectUserError);

    useEffect(() => {
        dispatch(fetchProfileThunk());
    }, [dispatch]);

    useEffect(() => {
        if (profileError) {
            toast.error(profileError);
            dispatch(clearUserError());
        }
    }, [profileError, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetLinks());
        toast.success('You have been signed out.');
        navigate('/login');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f6fa]">
            <Header />

            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Account Management
                </p>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-6 h-6 rounded-full border-2 border-blue-primary border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                            <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Pro Member
                            </span>
                        </div>

                        {/* Avatar + name */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {profile?.profile_picture_url ? (
                                        <img
                                            src={profile.profile_picture_url}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-400 uppercase">
                                            {profile?.email?.[0] ?? 'U'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                                    aria-label="Edit avatar"
                                >
                                    <img src={iconPencil} alt="" />
                                </button>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {profile?.full_name || 'User'}
                                </p>
                                <p className="text-sm text-gray-400">{profile?.email}</p>
                            </div>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="rounded-xl bg-gray-50 px-4 py-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                    Email Address
                                </p>
                                <p className="text-sm font-medium text-gray-700 truncate">
                                    {profile?.email || '—'}
                                </p>
                            </div>
                            <div className="rounded-xl bg-gray-50 px-4 py-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                    Member Since
                                </p>
                                <p className="text-sm font-medium text-gray-700">
                                    {formatDate(profile?.created_at)}
                                </p>
                            </div>
                        </div>

                        {/* Active Assets CTA */}
                        <div className="rounded-xl bg-blue-primary px-5 py-4 flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <img src={iconChain} alt="" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold">
                                        Active Assets
                                    </p>
                                    <p className="text-2xl font-extrabold text-white leading-none">
                                        {profile?.active_links ?? '0'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/dashboard')}
                                className="border-white! text-white! hover:bg-white/20!"
                            >
                                View Links
                            </Button>
                        </div>

                        {/* Settings */}
                        <div className="flex flex-col gap-0 divide-y divide-gray-100 mb-6">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <img src={iconBell} alt="" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Email Notifications
                                    </span>
                                </div>
                                <div className="w-10 h-6 rounded-full bg-blue-primary flex items-center justify-end px-1 cursor-pointer">
                                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                </div>
                            </div>

                            {/* 2FA */}
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <img src={iconShield} alt="" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Two-Factor Authentication
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                                    Disabled
                                </span>
                            </div>
                        </div>

                        {/* Logout button */}
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={handleLogout}
                            leftIcon={
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            }
                        >
                            Sign Out
                        </Button>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            Your data is encrypted using AES-256 standards.{' '}
                            <a href="/privacy" className="text-blue-primary hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Profile;