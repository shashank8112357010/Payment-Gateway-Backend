const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
        {
                ticker: {
                        type: String,
                },
                name: {
                        type: String,
                },
                image: {
                        type: String,
                },
                hasExternalId: {
                        type: Boolean,
                },
                isFiat: {
                        type: Boolean,
                },
                featured: {
                        type: Boolean,
                },
                isStable: {
                        type: Boolean,
                },
                supportsFixedRate: {
                        type: Boolean,
                },
                type: {
                        type: String,
                        Enum: ["Common"]
                }
        },
        { timestamps: true }
);

module.exports = mongoose.model("currencies", faqSchema);
