import React from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button.jsx';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6fa] px-4">
            <div className="text-center max-w-md">
                {/* Big 404 */}
                <p className="text-[120px] font-extrabold text-gray-100 leading-none select-none">
                    404
                </p>
                <h1 className="text-2xl font-bold text-gray-900 -mt-4 mb-2">
                    Page not found
                </h1>
                <p className="text-sm text-gray-400 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link to="/dashboard">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
