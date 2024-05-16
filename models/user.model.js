const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        merchantId: {
            type: String,
        },
        fullName: {
            type: String,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
            minLength: 10,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        address: {
            type: String,
        },
        profilePic: {
            type: String,
        },
        language: {
            type: String,
        },
        registrationNumber: {
            type: String,
        },
        passportId: {
            type: String,
        },
        accountNumber: {
            type: String,
        },
        swiftCode: {
            type: String,
        },
        bankAddress: {
            type: String,
        },
        recipientName: {
            type: String,
        },
        company: {
            type: String,
        },
        website: {
            type: String,
        },
        maximumTicketAmount: {
            type: Number,
        },
        minimumTicketAmount: {
            type: Number,
        },
        averageTicketAmount: {
            type: Number,
        },
        monthlyTransactionValue: {
            type: Number,
        },
        previousPayment: {
            type: Number,
        },
        otp: {
            type: String,
        },
        otpExpiration: {
            type: Date,
        },
        userType: {
            type: String,
            enum: ["USER", "ADMIN"],
        },
        accountVerification: {
            type: Boolean,
            default: false,
        },
        notification: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", schema);
