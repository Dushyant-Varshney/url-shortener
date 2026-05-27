const { getRedisClient, isRedisAvailable } = require("../config/redisConfig");

const DEFAULT_CACHE_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
const CACHE_KEY_PREFIX = "url:";

/**
 * Generate cache key
 * @param {string} shortUrl - The short URL code
 * @returns {string} Namespaced cache key
 */
const getCacheKey = (shortUrl) => `${CACHE_KEY_PREFIX}${shortUrl}`;

/**
 * Get value from cache
 * @param {string} shortUrl - The short URL code
 * @returns {Promise<string | null>} Cached value or null
 */
const getFromCache = async (shortUrl) => {
    if (!isRedisAvailable()) {
        return null;
    }

    try {
        const client = getRedisClient();
        const cacheKey = getCacheKey(shortUrl);
        const cachedValue = await client.get(cacheKey);
        
        if (cachedValue) {
            console.log(`[CACHE HIT] ${cacheKey}`);
            return cachedValue;
        }
        
        console.log(`[CACHE MISS] ${cacheKey}`);
        return null;
    } catch (error) {
        console.warn(`Error retrieving from cache: ${error}`);
        return null;
    }
};

/**
 * Set value in cache
 * @param {string} shortUrl - The short URL code
 * @param {string} fullUrl - The full URL to cache
 * @param {number} ttl - Time to live in seconds (default: 7 days)
 * @returns {Promise<boolean>} Success status
 */
const setInCache = async (
    shortUrl,
    fullUrl,
    ttl = DEFAULT_CACHE_TTL
) => {
    if (!isRedisAvailable()) {
        return false;
    }

    try {
        const client = getRedisClient();
        const cacheKey = getCacheKey(shortUrl);
        await client.setEx(cacheKey, ttl, fullUrl);
        console.log(`[CACHE SET] ${cacheKey} with TTL ${ttl}s`);
        return true;
    } catch (error) {
        console.warn(`Error setting cache: ${error}`);
        return false;
    }
};

/**
 * Delete value from cache
 * @param {string} shortUrl - The short URL code
 * @returns {Promise<boolean>} Success status
 */
const deleteFromCache = async (shortUrl) => {
    if (!isRedisAvailable()) {
        return false;
    }

    try {
        const client = getRedisClient();
        const cacheKey = getCacheKey(shortUrl);
        const result = await client.del(cacheKey);
        console.log(`[CACHE DELETE] ${cacheKey}`);
        return result > 0;
    } catch (error) {
        console.warn(`Error deleting from cache: ${error}`);
        return false;
    }
};

/**
 * Flush all cache keys (use with caution)
 * @returns {Promise<boolean>} Success status
 */
const flushCache = async () => {
    if (!isRedisAvailable()) {
        return false;
    }

    try {
        const client = getRedisClient();
        await client.flushDb();
        console.log("[CACHE FLUSH] All cache cleared");
        return true;
    } catch (error) {
        console.warn(`Error flushing cache: ${error}`);
        return false;
    }
};

module.exports = {
    getFromCache,
    setInCache,
    deleteFromCache,
    flushCache,
};
