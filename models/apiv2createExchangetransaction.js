const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
        {
                user: {
                        type: mongoose.Schema.ObjectId,
                        ref: "user",
                },
                fromAmount: {
                        type: Number,
                },
                toAmount: {
                        type: Number,
                        default: 0.0
                },
                flow: {
                        type: String,
                },
                type: {
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
                address: {
                        type: String,
                },
                fromNetwork: {
                        type: String,
                },
                toNetwork: {
                        type: String,
                },
                expectedSendAmount: {
                        type: Number,
                        default: 0.0
                },
                expectedReceiveAmount: {
                        type: Number,
                        default: 0.0
                },
                status: {
                        type: String,
                },
                crpUpdatedAt: {
                        type: String,
                },
                crpCreatedAt: {
                        type: String,
                },
                isPartner: {
                        type: Boolean,
                },
        },


        { timestamps: true }
);

module.exports = mongoose.model("apiv2createExchangetransaction", faqSchema);
