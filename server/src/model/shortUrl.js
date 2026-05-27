const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const shortUrlSchema = new mongoose.Schema({
    fullUrl: {
        type : String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: () => nanoid().substring(0, 10),
    },
    clicks: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Each URL must belong to a user
    }
},{
  timestamps: true  
}
)

const urlModel = mongoose.model("ShortUrl", shortUrlSchema);

module.exports = { urlModel };
