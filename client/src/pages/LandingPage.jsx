import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header.jsx'
import Footer from "../components/layout/Footer.jsx";
import insightsImage from '../assets/images/assets-landing-page.png';

const LandingPage = () => {
    const navigate = useNavigate();
    const [longUrl, setLongUrl] = useState('');

    // Logic untuk redirect dari tombol "Get Started"
    const handleGetStarted = () => {
        navigate('/create-link');
    };

    // Logic untuk redirect dan membawa value URL dari tombol "Shorten"
    const handleShorten = (e) => {
        e.preventDefault();
        navigate('/create-link', {
            state: { destinationUrl: longUrl }
        });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header/>
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                    Shorten URLs. <span className="text-blue-600">Share Easily.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Create short, memorable links for your team communications. <br className="hidden md:block" />
                    Transform long, cumbersome URLs into powerful digital assets that <br className="hidden md:block" />
                    drive engagement.
                </p>

                <div className="flex items-center justify-center gap-4 mb-16">
                    <Button variant="primary" size="lg" onClick={handleGetStarted}>
                        Get Started
                    </Button>
                    <Button variant="outline" size="lg">
                        Learn More
                    </Button>
                </div>

                {/* Input URL Box */}
                <form
                    onSubmit={handleShorten}
                    className="max-w-3xl mx-auto bg-white p-2.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-3 border border-gray-100"
                >
                    <div className="pl-4 text-gray-400">
                        {/* Placeholder Icon Link */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    </div>
                    <input
                        type="url"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        placeholder="https://very-long-architectural-url.com/asset-id-99238-x1"
                        className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base focus:ring-0"
                        required
                    />
                    <Button type="submit" variant="primary" size="md" className="px-8">
                        Shorten
                    </Button>
                </form>
            </section>

            {/* FEATURES SECTION */}
            <section className="bg-gray-50/50 py-24 px-6 border-t border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
                            Architectural Features
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Built for Enterprise Precision
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                                {/* Placeholder Icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Easy Create</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Instantly generate high-performance short links with a single click or through our surgical API endpoints.
                            </p>
                            <div className="w-8 h-1 bg-blue-200 rounded-full"></div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
                                {/* Placeholder Icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Custom Slugs</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Maintain brand authority with readable, custom link endings that resonate with your digital audience.
                            </p>
                            <div className="w-8 h-1 bg-indigo-200 rounded-full"></div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-6">
                                {/* Placeholder Icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Team Ready</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Collaborate across departments with shared workspaces, permissions, and unified analytics dashboards.
                            </p>
                            <div className="w-8 h-1 bg-orange-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insignt section */}
            <section className="py-24 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="w-full">
                    <img
                        src={insightsImage}
                        alt="Data Dashboard on Laptop"
                        className=""
                    />
                </div>
                <div className="w-full">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Data Driven Insights
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        Observe your link architecture in real-time.
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Every click is a data point. Our dashboard provides surgical precision into where your traffic originates, who is engaging, and how your team communications are performing across the globe.
                    </p>

                    <ul className="space-y-4">
                        {[
                            'Geographic Distribution Maps',
                            'Device & Browser Breakdown',
                            'UTM Parameter Tracking'
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-800">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* FOOTER*/}
            <Footer/>
        </div>
    );
};

export default LandingPage;