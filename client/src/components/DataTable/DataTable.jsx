import * as React from 'react';
import { toast } from 'react-toastify';
import { serverUrl, baseUrl } from '../../config/api';
import axios from 'axios';
import QRCodeModal from '../QRCode/QRCodeModal';
import { Copy, QrCode, Trash2, ExternalLink, TrendingUp, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DataTable = (props) => {
    const { data, updateReloadState } = props;
    const [qrModalOpen, setQrModalOpen] = React.useState(false);
    const [selectedQR, setSelectedQR] = React.useState(null);

    const openQRModal = (item) => {
        setSelectedQR({ qrCode: item.qrCode, shortUrl: item.shortUrl });
        setQrModalOpen(true);
    };

    const closeQRModal = () => {
        setQrModalOpen(false);
        setSelectedQR(null);
    };

    const copyToClipboard = async (url) => {
        try {
            const fullUrl = `${baseUrl}/r/${url}`;
            await navigator.clipboard.writeText(fullUrl);
            toast.success(`Copied: ${url}`);
        } catch (error) {
            toast.error('Failed to copy URL');
            console.log(error);
        }
    };

    const deleteUrl = async (id) => {
        if (window.confirm('Are you sure you want to delete this URL?')) {
            try {
                await axios.delete(`${serverUrl}/shortUrl/${id}`);
                updateReloadState();
                toast.success('URL deleted successfully');
            } catch (error) {
                toast.error('Failed to delete URL');
                console.log(error);
            }
        }
    };

    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const mostClickedUrl = data.reduce((max, item) => item.clicks > max.clicks ? item : max, data[0] || null);

    if (data.length === 0) {
        return (
            <div className='container mx-auto py-20 px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center'
                >
                    <div className='w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center'>
                        <Link2 className='w-8 h-8 text-slate-400' />
                    </div>
                    <h3 className='text-2xl font-bold text-white mb-2'>No links yet</h3>
                    <p className='text-slate-400 text-lg'>Create your first shortened URL to get started and track its performance</p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className='container mx-auto px-4 py-12'>
                {/* Analytics Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-12'
                >
                    <div className='glass-effect p-6 rounded-2xl hover-lift'>
                        <p className='text-slate-400 text-sm font-medium mb-2'>Total Links</p>
                        <p className='text-3xl font-bold text-white'>{data.length}</p>
                    </div>
                    <div className='glass-effect p-6 rounded-2xl hover-lift'>
                        <p className='text-slate-400 text-sm font-medium mb-2'>Total Clicks</p>
                        <p className='text-3xl font-bold gradient-text'>{totalClicks}</p>
                    </div>
                    <div className='glass-effect p-6 rounded-2xl hover-lift'>
                        <p className='text-slate-400 text-sm font-medium mb-2'>Top Link</p>
                        <p className='text-lg font-bold text-white truncate'>{mostClickedUrl?.shortUrl || '-'}</p>
                        <p className='text-sm text-slate-400 mt-1'>{mostClickedUrl?.clicks || 0} clicks</p>
                    </div>
                </motion.div>

                {/* URL List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className='text-2xl font-bold text-white mb-6'>Your Links</h2>
                    
                    <div className='space-y-3'>
                        {data.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className='glass-effect p-4 md:p-6 rounded-2xl hover-lift group'
                            >
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    {/* URL Info */}
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <div className='px-3 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                                                <code className='text-purple-300 font-mono font-semibold text-sm'>
                                                    {item.shortUrl}
                                                </code>
                                            </div>
                                            <a
                                                href={`${baseUrl}/r/${item.shortUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className='text-slate-400 hover:text-purple-400 transition-colors'
                                                title='Open link'
                                            >
                                                <ExternalLink className='w-4 h-4' />
                                            </a>
                                        </div>
                                        <a
                                            href={item.fullUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className='text-slate-300 hover:text-purple-300 transition-colors break-all text-sm'
                                            title={item.fullUrl}
                                        >
                                            {item.fullUrl.length > 80 ? `${item.fullUrl.substring(0, 80)}...` : item.fullUrl}
                                        </a>
                                    </div>

                                    {/* Stats */}
                                    <div className='flex items-center gap-4 md:gap-8 flex-shrink-0'>
                                        <div className='flex flex-col items-center'>
                                            <TrendingUp className='w-5 h-5 text-purple-400 mb-1' />
                                            <span className='text-lg font-bold text-white'>{item.clicks}</span>
                                            <p className='text-xs text-slate-400'>clicks</p>
                                        </div>

                                        {/* Actions */}
                                        <div className='flex gap-2'>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => copyToClipboard(item.shortUrl)}
                                                className='p-2 md:p-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all duration-300'
                                                title='Copy URL'
                                            >
                                                <Copy className='w-4 h-4' />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => openQRModal(item)}
                                                className='p-2 md:p-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all duration-300'
                                                title='View QR Code'
                                            >
                                                <QrCode className='w-4 h-4' />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => deleteUrl(item._id)}
                                                className='p-2 md:p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all duration-300'
                                                title='Delete URL'
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <QRCodeModal
                isOpen={qrModalOpen}
                qrCode={selectedQR?.qrCode}
                shortUrl={selectedQR?.shortUrl || ''}
                onClose={closeQRModal}
            />
        </>
    );
};

export default DataTable;
