const express = require("express");
const { createUrl, deleteUrl, getAllUrl, getUrl, getQRCode } = require("../controllers/shortUrl");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes - require authentication
router.post("/shortUrl", authMiddleware, createUrl);
router.get("/shortUrl", authMiddleware, getAllUrl);
router.get("/shortUrl/:id/qr", authMiddleware, getQRCode);
router.get("/shortUrl/:id", authMiddleware, getUrl);
router.delete("/shortUrl/:id", authMiddleware, deleteUrl);

module.exports = router;
