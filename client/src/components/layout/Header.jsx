import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, logout } from '../../redux/slices/authSlice.js';
import { resetLinks } from '../../redux/slices/linkSlice.js';
import Button from '../ui/Button.jsx';

const NAV_LINKS = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/links', label: 'Links' },
];

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetLinks());
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
                {/* Logo */}
                <NavLink
                    to="/dashboard"
                    className="text-lg font-extrabold text-gray-900 tracking-tight shrink-0"
                >
                    ShortLink
                </NavLink>

                {/* Nav links */}
                <nav className="flex items-center gap-1">
                    {NAV_LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                [
                                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'text-blue-primary border-b-2 border-blue-primary rounded-none pb-[18px]'
                                        : 'text-gray-500 hover:text-gray-800',
                                ].join(' ')
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-auto">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/create-link')}
                    >
                        + Create New Link
                    </Button>

                    {/* Avatar */}
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-1"
                        aria-label="Profil saya"
                    >
                        {user?.profile_picture_url ? (
                            <img
                                src={user.profile_picture_url}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs font-bold text-gray-500 uppercase">
                                {user?.email?.[0] ?? 'U'}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
