import * as React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../../config/api';
import { LinkIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FormContainer = (props) => {
    const { updateReloadState } = props;
    const [fullUrl, setFullUrl] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const inputRef = React.useRef(null);

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullUrl.trim()) {
            toast.error('Please enter a URL');
            return;
        }

        if (!isValidUrl(fullUrl)) {
            toast.error('Please enter a valid URL');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(`${serverUrl}/shortUrl`, {
                fullUrl: fullUrl,
            });

            setFullUrl("");
            updateReloadState();
            toast.success('URL shortened successfully!');
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.info('This URL was already shortened');
                updateReloadState();
            } else {
                toast.error('Failed to shorten URL. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full pt-16 pb-24 px-4 relative overflow-hidden'>
            {/* Gradient orbs */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-40 right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl'></div>
                <div className='absolute bottom-40 left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl'></div>
            </div>

            <div className='container mx-auto max-w-3xl relative z-10'>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='text-center mb-12'
                >
                    <h1 className='text-5xl md:text-6xl font-bold mb-4 leading-tight'>
                        <span className='gradient-text'>Shorten URLs.</span>
                        <br />
                        <span className='text-white'>Track Clicks.</span>
                        <br />
                        <span className='text-slate-300'>Share Instantly.</span>
                    </h1>
                    <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
                        Create short, powerful links with real-time analytics. Premium link management for developers and creators.
                    </p>
                </motion.div>

                {/* Input Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='glass-effect-lg p-2 mb-12 hover-lift glow-effect'
                >
                    <div className='flex flex-col md:flex-row gap-2'>
                        <div className='flex-1 relative group'>
                            <LinkIcon className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors' />
                            <input
                                ref={inputRef}
                                type="url"
                                placeholder="paste your long URL here..."
                                required
                                disabled={isLoading}
                                className='w-full pl-12 pr-4 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm'
                                value={fullUrl}
                                onChange={(e) => setFullUrl(e.target.value)}
                            />
                        </div>
                        <motion.button
                            type='submit'
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing</span>
                                </>
                            ) : (
                                <>
                                    <span>Shorten</span>
                                    <ArrowRight className='w-4 h-4' />
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default FormContainer;
