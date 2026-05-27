const QRCode = require("qrcode");

/**
 * Generate QR code as data URL
 * @param {string} text - The text/URL to encode in the QR code
 * @returns {Promise<string>} Base64 encoded data URL
 */
const generateQRCodeDataUrl = async (text) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(text);
        return qrCodeDataUrl;
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw error;
    }
};

/**
 * Generate QR code as PNG buffer
 * @param {string} text - The text/URL to encode in the QR code
 * @returns {Promise<Buffer>} PNG buffer
 */
const generateQRCodeBuffer = async (text) => {
    try {
        const buffer = await QRCode.toBuffer(text);
        return buffer;
    } catch (error) {
        console.error("Error generating QR code buffer:", error);
        throw error;
    }
};

module.exports = {
    generateQRCodeDataUrl,
    generateQRCodeBuffer,
};
