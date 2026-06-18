import React from 'react';
import { Link } from 'react-router';

const FOOTER_LINKS = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/docs', label: 'API Documentation' },
    { to: '/support', label: 'Support' },
];

const Footer = () => {
    return (
        <footer className="border-t border-gray-100 bg-white mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Copyright */}
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                    © {new Date().getFullYear()} ShortLink. The Digital Architect.
                </p>

                {/* Nav links */}
                <nav className="flex items-center gap-5">
                    {FOOTER_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="text-xs text-gray-400 uppercase tracking-wide hover:text-gray-600 transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
