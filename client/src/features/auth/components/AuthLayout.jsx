import React from 'react';
import { Link } from 'react-router';
import Footer from '../../../components/layout/Footer.jsx';

/**
 * AuthLayout — wrapper shared for Login & Register
 */
const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#f0f2f8]"
             style={{
                 background: 'radial-gradient(ellipse at top left, #dce8ff 0%, #f0f2f8 50%, #f5f5f8 100%)'
             }}
        >
            {/* Top bar — logo */}
            <div className="w-full flex justify-center pt-10 pb-2">
                <Link
                    to="/"
                    className="text-2xl leading-8 tracking-tighter font-extrabold text-gray-900"
                >
                    ShortLink
                </Link>
            </div>

            {/* Card area */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default AuthLayout;