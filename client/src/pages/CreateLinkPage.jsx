import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import slugify from 'slugify';
import { toast } from 'react-toastify';

import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { createLinkSchema } from '../features/auth/index.js';
import { createLinkThunk, selectLinkLoading } from '../redux/slices/linkSlice.js';

import iconThunder from '../assets/icons/thunder.svg';

const BASE_DOMAIN = 'short.link/';

const CreateLinkPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectLinkLoading);
    const [slugPreview, setSlugPreview] = useState('my-custom-slug');
    const location = useLocation();
    const [, setDestinationUrl] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createLinkSchema),
        defaultValues: {
            original_url: '',
            optional_slug: '',
        },
    });

    // Live preview slug
    const watchedSlug = watch('optional_slug');
    React.useEffect(() => {
        const raw = watchedSlug?.trim();
        if (raw) {
            const clean = slugify(raw, { lower: true, strict: true });
            setSlugPreview(clean || 'my-custom-slug');
        } else {
            setSlugPreview('my-custom-slug');
        }
    }, [watchedSlug]);

    const onSubmit = async (data) => {
        const result = await dispatch(
            createLinkThunk({
                original_url: data.original_url,
                optional_slug: data.optional_slug || undefined,
            })
        );

        if (createLinkThunk.fulfilled.match(result)) {
            toast.success('Short link created successfully!');
            navigate('/dashboard');
        } else {
            toast.error(result.payload || 'Failed to create link.');
        }
    };

    useEffect(() => {
        if (location.state?.destinationUrl) {
            setDestinationUrl(location.state.destinationUrl);
        }
    }, [location]);

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f6fa]">
            <Header />

            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
                {/* Back link */}
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-primary hover:underline mb-5"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Dashboard
                </Link>

                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create New Short Link
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Transform your long URLs into clean, manageable assets.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="flex flex-col gap-6">
                            {/* Destination URL */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                                    Destination URL{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://example.com/your-long-url-here"
                                    error={errors.original_url?.message}
                                    prefix={
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                        </svg>
                                    }
                                    {...register('original_url')}
                                />
                                {!errors.original_url && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Ensure your URL starts with http:// or https://
                                    </p>
                                )}
                            </div>

                            {/* Custom Slug */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                                    Custom Slug{' '}
                                    <span className="text-gray-400 font-normal normal-case">
                                        (Optional)
                                    </span>
                                </label>
                                <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-primary focus-within:border-transparent">
                                    <span className="px-3 py-2.5 bg-gray-50 border-r border-gray-200 text-sm text-gray-500 whitespace-nowrap select-none">
                                        {BASE_DOMAIN}
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="my-custom-slug"
                                        className="flex-1 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none bg-white"
                                        {...register('optional_slug')}
                                    />
                                </div>
                                {errors.optional_slug ? (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.optional_slug.message}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Leave blank to generate a random unique identifier.
                                    </p>
                                )}
                            </div>

                            {/* Live preview */}
                            <div className="rounded-xl bg-bg-primary border border-blue-100 px-5 py-4">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#004AC6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span className="text-xs font-bold text-blue-primary uppercase tracking-widest">
                                        Live Preview
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Your short link will be:{' '}
                                    <span className="font-semibold text-blue-primary">
                                        https://{BASE_DOMAIN}
                                        {slugPreview}
                                    </span>
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    leftIcon={
                                        !isLoading && (
                                            <img src={iconThunder} alt="" />
                                        )
                                    }
                                >
                                    Create Link
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Feature callouts */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {[
                        {
                            icon: '📊',
                            title: 'Real-time Analytics',
                            desc: 'Track every click, geographical location, and referral source instantly.',
                        },
                        {
                            icon: '🔲',
                            title: 'Auto-generated QR',
                            desc: 'Every link automatically creates a high-resolution QR code for print.',
                        },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-3">
                            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-base shrink-0">
                                {icon}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">{title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CreateLinkPage;