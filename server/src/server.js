const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server: SocketIOServer } = require("socket.io");
const connectDb = require("./config/dbConfig");
const { initializeRedis } = require("./config/redisConfig");
const shortUrl = require("./routes/shortUrl");
const auth = require("./routes/auth");
const { urlModel } = require("./model/shortUrl");
const { getFromCache, setInCache } = require("./utils/cacheManager");

dotenv.config();

const PORT = process.env.PORT || 5001;
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || "http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
        origin: FRONTEND_ORIGINS,
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
        origin: FRONTEND_ORIGINS,
    credentials: true
}));

// Make io accessible to routes
app.set("io", io);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Initialize database and Redis
const initializeApp = async () => {
    try {
        await connectDb();
        await initializeRedis();
    } catch (error) {
        console.error("Initialization failed:", error);
    }
};

initializeApp();

/**
 * Redirect route with Redis caching
 * Check cache first, then database, then redirect
 */
app.get("/r/:shortUrl", async (req, res) => {
    try {
        const shortUrlCode = req.params.shortUrl;

        // Try to get from cache first
        let fullUrl = await getFromCache(shortUrlCode);

        if (fullUrl) {
            // Cache hit - redirect immediately
            // Emit click event but don't update database for cached URLs
            io.emit("urlClicked", { shortUrl: shortUrlCode });
            return res.redirect(fullUrl);
        }

        // Cache miss - fetch from database
        const urlDoc = await urlModel.findOne({ shortUrl: shortUrlCode });

        if (urlDoc) {
            // Update click count
            urlDoc.clicks++;
            await urlDoc.save();

            // Emit click event to all connected clients
            io.emit("urlClicked", {
                shortUrl: shortUrlCode,
                clicks: urlDoc.clicks,
                userId: urlDoc.user.toString()
            });

            // Store in cache for future requests
            await setInCache(shortUrlCode, urlDoc.fullUrl);

            // Redirect
            return res.redirect(urlDoc.fullUrl);
        }

        // URL not found
        res.status(404).json({ message: "URL not found" });
    } catch (error) {
        console.error("Redirect error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.use("/api/", shortUrl);
app.use("/api/auth", auth);

server.listen(PORT, () => {
    console.log(`Server started successfully on PORT ${PORT}`);
});
