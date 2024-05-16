const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
        {
                user: {
                        type: mongoose.Schema.ObjectId,
                        ref: "user",
                },
                from: {
                        type: String,
                },
                to: {
                        type: String,
                },
                amount: {
                        type: String,
                },
                address: {
                        type: String,
                },
                flow: {
                        type: String,
                },
                payinAddress: {
                        type: String,
                },
                payoutAddress: {
                        type: String,
                },
                fromCurrency: {
                        type: String,
                },
                toCurrency: {
                        type: String,
                },
                id: {
                        type: String,
                },
                returnAmount: {
                        type: Number,
                        default: 0.0
                },
        },


        { timestamps: true }
);

module.exports = mongoose.model("createExchangetransaction", faqSchema);
