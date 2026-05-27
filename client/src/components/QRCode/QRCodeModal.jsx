import React from 'react';
import { X, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const QRCodeModal = ({ isOpen, qrCode, shortUrl, onClose }) => {
    if (!isOpen) return null;

    const downloadQR = () => {
        if (!qrCode) return;

        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `qr-${shortUrl}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect-lg max-w-md w-full p-8 rounded-3xl border border-white/20"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">QR Code</h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* QR Code Display */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 flex justify-center mb-6 border border-white/10">
                    {qrCode ? (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={qrCode}
                            alt="QR Code"
                            className="w-64 h-64"
                        />
                    ) : (
                        <div className="w-64 h-64 flex items-center justify-center">
                            <div className="animate-spin">
                                <div className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Short URL */}
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">Short URL</p>
                    <code className="text-lg font-mono text-purple-300">{shortUrl}</code>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={downloadQR}
                        disabled={!qrCode}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default QRCodeModal;
