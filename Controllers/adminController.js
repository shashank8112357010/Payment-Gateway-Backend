const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
var newOTP = require("otp-generators");
const nodemailer = require("nodemailer");
const authConfig = require("../configs/auth.config");
const notification = require("../models/notification");
exports.registration = async (req, res) => {
    const { phone, email } = req.body;
    try {
        req.body.email = email.split(" ").join("").toLowerCase();
        let user = await User.findOne({
            $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }],
        });
        if (!user) {
            const otp = newOTP.generate(4,{
                alphabets: false,
                upperCase: false,
                specialChar: false,
            });
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: "frieda.smitham40@ethereal.email",
                    pass: "TURy68KCpFSsFyNfjs",
                },
            });
            // Define the email options
            const mailOptions = {
                to: email,
                from: "node2@flyweis.technology",
                subject: "Password reset request",
                text:
                    `OTP ${otp}\n` +
                    `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                    `your otp is ${otp} ` +
                    `for reset password\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            let resultmail = await transporter.sendMail(mailOptions);
            if (resultmail) {
                req.body.otp = otp;
                req.body.otpExpiration = Date.now() + 3600000;
                req.body.userType = "ADMIN";
                const userCreate = await User.create(req.body);
                return res.status(200).send({
                    message: "registered successfully ",
                    data: userCreate,
                });
            } else {
                return res.status(500).json({ message: "Could not send email. Please try again later.", });
            }
        } else {
            return res.status(409).send({ message: "Already Exist", data: [] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        }
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const updated = await User.findByIdAndUpdate(
            { _id: user._id },
            { accountVerification: true },
            { new: true }
        );
        const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });
        return res.status(200).send({
            message: "logged in successfully",
            accessToken: accessToken,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ error: "internal server error" + err.message });
    }
};
exports.login = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ msg: "not found" });
        } else {
            const userObj = {};
            let otp = newOTP.generate(4, {
                alphabets: false,
                upperCase: false,
                specialChar: false,
            });
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: "frieda.smitham40@ethereal.email",
                    pass: "TURy68KCpFSsFyNfjs",
                },
            });
            // Define the email options
            const mailOptions = {
                to: email,
                from: "node2@flyweis.technology",
                subject: "Password reset request",
                text:
                    `OTP ${otp}\n` +
                    `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                    `your otp is ${otp} ` +
                    `for reset password\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            let resultmail = await transporter.sendMail(mailOptions);
            if (resultmail) {
                userObj.otp = otp;
                userObj.accountVerification = false;
                userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
                const updated = await User.findOneAndUpdate({ email: email }, userObj, { new: true });
                return res.status(200).send({ msg: "Otp send", userId: updated._id, otp: updated.otp, });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.resendOTP = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const userObj = {};
        let otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false });
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: "frieda.smitham40@ethereal.email",
                pass: "TURy68KCpFSsFyNfjs",
            },
        });
        // Define the email options
        const mailOptions = {
            to: user.email,
            from: "node2@flyweis.technology",
            subject: "Password reset request",
            text:
                `OTP ${otp}\n` +
                `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `your otp is ${otp} ` +
                `for reset password\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        let resultmail = await transporter.sendMail(mailOptions);
        if (resultmail) {
            userObj.otp = otp;
            userObj.accountVerification = false;
            userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
            const updated = await User.findByIdAndUpdate({ _id: user._id }, userObj, { new: true });
            return res.status(200).send({ msg: "Otp resend", userId: updated._id, otp: updated.otp, });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error" + error.message });
    }
};
exports.getAllUser = async (req, res) => {
    try {
        const user = await User.find({});
        if (user.length == 0) {
            return res.status(404).send({ message: "not found" });
        }
        return res.status(200).send({ message: "Get user details.", data: user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "internal server error " + err.message,
        });
    }
};
exports.viewUser = async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).send({ msg: "Data found successfully", data: data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ msg: "internal server error", error: err.message, });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const data = await User.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ msg: "internal server error", error: err.message, });
    }
};
exports.sendNotification = async (req, res) => {
    try {
        const admin = await User.findById({ _id: req.user._id });
        if (!admin) {
            return res.status(404).json({ status: 404, message: "Admin not found" });
        } else {
            if (req.body.total == "ALL") {
                let userData = await User.find({ userType: req.body.sendTo });
                if (userData.length == 0) {
                    return res.status(404).json({ status: 404, message: "User not found" });
                } else {
                    for (let i = 0; i < userData.length; i++) {
                        let obj = {
                            userId: userData[i]._id,
                            title: req.body.title,
                            body: req.body.body,
                            date: req.body.date,
                            image: req.body.image,
                            time: req.body.time,
                        }
                        await notification.create(obj)
                    }
                    let obj1 = {
                        userId: admin._id,
                        title: req.body.title,
                        body: req.body.body,
                        date: req.body.date,
                        image: req.body.image,
                        time: req.body.time,
                    }
                    await notification.create(obj1)
                    return res.status(200).json({ status: 200, message: "Notification send successfully." });
                }
            }
            if (req.body.total == "SINGLE") {
                let userData = await User.findById({ _id: req.body._id, userType: req.body.sendTo });
                if (!userData) {
                    return res.status(404).json({ status: 404, message: "User not found" });
                } else {
                    let obj = {
                        userId: userData._id,
                        title: req.body.title,
                        body: req.body.body,
                        date: req.body.date,
                        image: req.body.image,
                        time: req.body.time,
                    }
                    let data = await notification.create(obj)
                    if (data) {
                        let obj1 = {
                            userId: admin._id,
                            title: req.body.title,
                            body: req.body.body,
                            date: req.body.date,
                            image: req.body.image,
                            time: req.body.time,
                        }
                        await notification.create(obj1)
                        return res.status(200).json({ status: 200, message: "Notification send successfully.", data: data });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
}
exports.allNotification = async (req, res) => {
    try {
        const admin = await User.findById({ _id: req.user._id });
        if (!admin) {
            return res.status(404).json({ status: 404, message: "Admin not found" });
        } else {
            let findNotification = await notification.find({ userId: admin._id }).populate('userId');
            if (findNotification.length == 0) {
                return res.status(404).json({ status: 404, message: "Notification data not found successfully.", data: {} })
            } else {
                return res.status(200).json({ status: 200, message: "Notification data found successfully.", data: findNotification })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
}