const User = require("../models/user.model");
const userCard = require("../models/userCard")
const jwt = require("jsonwebtoken");
var newOTP = require("otp-generators");
const nodemailer = require("nodemailer");
const authConfig = require("../configs/auth.config");
const helpandSupport = require("../models/helpAndSupport");
const axios = require('axios');
const crypto = require('crypto');


exports.registration = async (req, res) => {
    const { phone, email } = req.body;
    try {
        if(!email)  return res.status(422).send({ message: "email required",});
        else if(!phone)  return res.status(422).send({ message: "phone required",});
        req.body.email = email.split(" ").join("").toLowerCase();
        let user = await User.findOne({
            $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }],
        });
        if (!user) {
            // const otp = newOTP.generate(4, {
            //     alphabets: false,
            //     upperCase: false,
            //     specialChar: false,
            // });

            
            // const transporter = nodemailer.createTransport({
            //     host: "smtp.ethereal.email",
            //     port: 587,
            //     auth: {
            //         user: "frieda.smitham40@ethereal.email",
            //         pass: "TURy68KCpFSsFyNfjs",
            //     },
            // });
            // // Define the email options
            // const mailOptions = {
            //     to: email,
            //     from: "node2@flyweis.technology",
            //     subject: "Password reset request",
            //     text:
            //         `OTP ${otp}\n` +
            //         `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            //         `your otp is ${otp} ` +
            //         `for reset password\n\n` +
            //         `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            // };
            // let resultmail = await transporter.sendMail(mailOptions);
            // if (resultmail) {
            // req.body.otp = otp;
            // req.body.otpExpiration = Date.now() + 3600000;

            req.body.userType = "USER";
            req.body.merchantId = await reffralCode();
            const userCreate = await User.create(req.body);
            return res.status(200).send({
                message: "registered successfully ",
                data: userCreate,
            });

            // } else {
            //     return res.status(500).json({
            //         message: "Could not send email. Please try again later.",
            //     });
            // }
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
exports.update = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id });
        if (user) {
            if (req.file) {
                req.body.profilePic = req.file.path;
            }
            let obj = {
                profilePic: req.body.profilePic || user.profilePic,
            }
            const newUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: obj }, { new: true });
            return res.status(200).json({ status: 200, message: 'User update successfully', data: newUser });
        }
        return res.status(404).json({ message: "user not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
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
exports.updateNotification = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id });
        if (user) {
            if (user.notification == true) {
                const newUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: { notification: false } }, { new: true });
                return res.status(200).json({ status: 200, message: 'Notification update successfully', data: newUser });
            } else {
                const newUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: { notification: true } }, { new: true });
                return res.status(200).json({ status: 200, message: 'Notification update successfully', data: newUser });

            }
        }
        return res.status(404).json({ message: "user not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createPaymentCard = async (req, res, next) => {
    try {
        const data = await User.findOne({ _id: req.user._id, });
        if (data) {
            const saveData = {
                user: req.user._id,
                name: req.body.name,
                number: req.body.number,
                month: req.body.month,
                year: req.body.year,
                cvv: req.body.cvv,
                cardType: req.body.cardType,
            };
            const saved = await userCard.create(saveData);
            return res.status(200).json({ status: 200, message: "Card details saved.", data: saved })
        } else {
            return res.status(404).json({ status: 404, message: "No data found", data: {} });
        }
    } catch (err) {
        console.log(err);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
};
exports.getPaymentCard = async (req, res, next) => {
    try {
        const data = await User.findOne({ _id: req.user._id, });
        if (data) {
            const getData = await userCard.find({ user: req.user._id });
            return res.status(200).json({ status: 200, message: "Card details fetch.", data: getData })
        } else {
            return res.status(404).json({ status: 404, message: "No data found", data: {} });
        }
    } catch (err) {
        console.log(err);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
};
exports.updatePaymentCard = async (req, res, next) => {
    try {
        const data = await User.findOne({ _id: req.user._id, });
        if (data) {
            const payment = await userCard.findById(req.params.id);
            if (!payment) {
                return res.status(404).json({ status: 404, message: "Card details not fetch", data: {} });
            } else {
                let obj = {
                    name: req.body.name || payment.name,
                    number: req.body.number || payment.number,
                    month: req.body.month || payment.month,
                    year: req.body.year || payment.year,
                    cvv: req.body.cvv || payment.cvv,
                    cardType: req.body.cardType || payment.cardType,
                }
                let saved = await userCard.findByIdAndUpdate(payment._id, { obj }, { new: true });
                return res.status(200).json({ status: 200, message: "Card details Updated Successfully.", data: saved })
            }
        } else {
            return res.status(404).json({ status: 404, message: "No data found", data: {} });
        }
    } catch (err) {
        console.log(err);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
};
exports.DeletePaymentCard = async (req, res, next) => {
    try {
        const payment = await userCard.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ status: 404, message: "Card details not fetch", data: {} });
        } else {
            const data = await userCard.findByIdAndDelete({ _id: payment._id, });
            return res.status(200).json({ status: 200, message: "Card details Delete Successfully.", data: {} })
        }
    } catch (err) {
        console.log(err);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
};
exports.networkStorePayment = async (req, res) => {
    try {
        let user = await User.findOne({ merchantId: req.body.merchantId });
        if (user) {
            req.body.merNo = 448888;
            req.body.terNo = 88816;
            const code = `EncryptionMode=SHA256&CharacterSet=UTF8&merNo=${req.body.merNo}&terNo=${req.body.terNo}&orderNo=${req.body.orderNo}&currencyCode=${req.body.currencyCode}&amount=${req.body.amount}&payIP=${req.body.payIP}&transType=${req.body.transType}&transModel=${req.body.transModel}&52400b2fc90e48a9b81cd55a6830281a`
            const hash = crypto.createHash('sha256').update(code).digest('hex');
            let goodsInfo = [];
            for (let i = 0; i < req.body.goodsName.length; i++) {
                let obj1 = {
                    goodsName: req.body.goodsName[i],
                    quantity: req.body.quantity[i],
                    goodsPrice: req.body.goodsPrice[i]
                }
                goodsInfo.push(obj1)
            }
            let obj = {
                merNo: req.body.merNo,
                terNo: req.body.terNo,
                CharacterSet: req.body.CharacterSet,
                transType: req.body.transType,
                transModel: req.body.transModel,
                apiType: req.body.apiType,
                amount: req.body.amount,
                currencyCode: req.body.currencyCode,
                orderNo: req.body.orderNo,
                merremark: req.body.merremark,
                returnURL: req.body.returnURL,
                merMgrURL: req.body.merMgrURL,
                language: req.body.language,
                cardCountry: req.body.cardCountry,
                cardState: req.body.cardState,
                cardCity: req.body.cardCity,
                cardAddress: req.body.cardAddress,
                cardZipCode: req.body.cardZipCode,
                payIP: req.body.payIP,
                cardFullName: req.body.cardFullName,
                cardFullPhone: req.body.cardFullPhone,
                grCountry: req.body.grCountry,
                grState: req.body.grState,
                grCity: req.body.grCity,
                grAddress: req.body.grAddress,
                grZipCode: req.body.grZipCode,
                grEmail: req.body.grEmail,
                grphoneNumber: req.body.grphoneNumber,
                grPerName: req.body.cardFullName,
                goodsString: {
                    goodsInfo: goodsInfo
                },
                cardNO: req.body.cardNO,
                cvv: req.body.cvv,
                expMonth: req.body.expMonth,
                expYear: req.body.expYear,
                hashcode: hash
            }
            var url = `https://payment.gantenpay.com/payment/api/payment`;
            axios({
                method: 'post',
                url: url,
                data: obj
            }).then(function (response) {
                console.log(response.config.data);
                console.log(response.data);
                resolve(response)
                return res.status(200).send({ msg: "Data Payment", data: response, });

            }).catch(function (error) {
                return res.status(501).send({ msg: "error", data: error, });
            });
        } else {
            return res.status(404).send({ msg: "MerchantId not matched", data: {}, });
        }
    } catch (err) {
        console.log(err);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
}
exports.fastPayPayment = async (req, res) => {
    try {
        let user = await User.findOne({ merchantId: req.body.merchantId });
        if (user) {
            const code = `EncryptionMode=SHA256&CharacterSet=UTF8&merNo=${req.body.merNo}&terNo=${req.body.terNo}&orderNo=${req.body.orderNo}&currencyCode=${req.body.currencyCode}&amount=${req.body.amount}&payIP=${req.body.payIP}&transType=${req.body.transType}&transModel=${req.body.transModel}&52400b2fc90e48a9b81cd55a6830281a`
            const hash = crypto.createHash('sha256').update(code).digest('hex');
            let body = req.body;
            console.log("--------1888-----", body.merNo);
            let goodsInfo = [];
            for (let i = 0; i < req.body.goodsName.length; i++) {
                let obj1 = {
                    goodsName: req.body.goodsName[i],
                    quantity: req.body.quantity[i],
                    goodsPrice: req.body.goodsPrice[i]
                }
                goodsInfo.push(obj1)
            }
            let obj = {
                merNo: req.body.merNo,
                terNo: req.body.terNo,
                CharacterSet: req.body.CharacterSet,
                transType: req.body.transType,
                transModel: req.body.transModel,
                apiType: req.body.apiType,
                amount: req.body.amount,
                currencyCode: req.body.currencyCode,
                orderNo: req.body.orderNo,
                merremark: req.body.merremark,
                returnURL: req.body.returnURL,
                merMgrURL: req.body.merMgrURL,
                language: req.body.language,
                cardCountry: req.body.cardCountry,
                cardState: req.body.cardState,
                cardCity: req.body.cardCity,
                cardAddress: req.body.cardAddress,
                cardZipCode: req.body.cardZipCode,
                payIP: req.body.payIP,
                cardFullName: req.body.cardFullName,
                cardFullPhone: req.body.cardFullPhone,
                grCountry: req.body.grCountry,
                grState: req.body.grState,
                grCity: req.body.grCity,
                grAddress: req.body.grAddress,
                grZipCode: req.body.grZipCode,
                grEmail: req.body.grEmail,
                grphoneNumber: req.body.grphoneNumber,
                grPerName: req.body.cardFullName,
                goodsString: {
                    goodsInfo: goodsInfo
                },
                cardNO: req.body.cardNO,
                cvv: req.body.cvv,
                expMonth: req.body.expMonth,
                expYear: req.body.expYear,
                hashcode: hash
            }
            console.log(obj);
            var url = `https://payment.gantenpay.com/fastpay/apply`;
            axios({
                method: 'post',
                url: url,
                data: obj
            }).then(function (response) {
                console.log(response);
                resolve(response)
                return res.status(200).send({ msg: "Data Payment", data: response, });
            })
                .catch(function (error) {
                    console.log(error.response.data);
                    return res.status(501).send({ msg: "error", data: error.response.data, });
                });
        } else {
            return res.status(404).send({ msg: "MerchantId not matched", data: {}, });
        }
    } catch (err) {
        console.log(err);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
}
exports.requestForRefund = async (req, res) => {
    try {
        let user = await User.findOne({ merchantId: req.body.merchantId });
        if (user) {
            const code = `EncryptionMode=SHA256&CharacterSet=UTF8&merNo=${req.body.merNo}&refundCurrency=${req.body.refundCurrency}&refundAmount=${req.body.refundAmount}&busCurrency=${req.body.busCurrency}&busAmount=${req.body.busAmount}&tradeNo=${req.body.tradeNo}&52400b2fc90e48a9b81cd55a6830281a`
            const hash = crypto.createHash('sha256').update(code).digest('hex');
            let obj = {
                merNo: req.body.merNo,
                terNo: req.body.terNo,
                refundCurrency: req.body.refundCurrency,
                busCurrency: req.body.busCurrency,
                refundAmount: req.body.refundAmount,
                refundReason: req.body.refundReason,
                busAmount: req.body.busAmount,
                tradeNo: req.body.tradeNo,
                hashcode: hash
            }
            var url = `https://payment.gantenpay.com/payment/refund/requestForRefund`;
            axios({
                method: 'post',
                url: url,
                data: obj
            }).then(function (response) {
                console.log(response.data);
                resolve(response)
                return res.status(200).send({ msg: "Data Payment", data: response, });
            })
                .catch(function (error) {
                    return res.status(501).send({ msg: "error", data: error, });
                });
        } else {
            return res.status(404).send({ msg: "MerchantId not matched", data: {}, });
        }
    } catch (error) {

    }
}
exports.JumpPayment = async (req, res) => {
    try {
        let user = await User.findOne({ merchantId: req.body.merchantId });
        if (user) {
            const code = `EncryptionMode=SHA256&CharacterSet=UTF8&merNo=${req.body.merNo}&terNo=${req.body.terNo}&orderNo=${req.body.orderNo}&currencyCode=${req.body.currencyCode}&amount=${req.body.amount}&payIP=${req.body.payIP}&transType=${req.body.transType}&transModel=${req.body.transModel}&52400b2fc90e48a9b81cd55a6830281a`
            const hash = crypto.createHash('sha256').update(code).digest('hex');
            let goodsInfo = [];
            for (let i = 0; i < req.body.goodsName.length; i++) {
                let obj1 = {
                    goodsName: req.body.goodsName[i],
                    quantity: req.body.quantity[i],
                    goodsPrice: req.body.goodsPrice[i]
                }
                goodsInfo.push(obj1)
            }
            let obj = {
                merNo: req.body.merNo,
                terNo: req.body.terNo,
                CharacterSet: req.body.CharacterSet,
                transType: req.body.transType,
                transModel: req.body.transModel,
                apiType: req.body.apiType,
                amount: req.body.amount,
                currencyCode: req.body.currencyCode,
                orderNo: req.body.orderNo,
                merremark: req.body.merremark,
                returnURL: req.body.returnURL,
                merMgrURL: req.body.merMgrURL,
                language: req.body.language,
                cardCountry: req.body.cardCountry,
                cardState: req.body.cardState,
                cardCity: req.body.cardCity,
                cardAddress: req.body.cardAddress,
                cardZipCode: req.body.cardZipCode,
                payIP: req.body.payIP,
                grCountry: req.body.grCountry,
                grState: req.body.grState,
                grCity: req.body.grCity,
                grAddress: req.body.grAddress,
                grZipCode: req.body.grZipCode,
                grEmail: req.body.grEmail,
                grphoneNumber: req.body.grphoneNumber,
                grPerName: req.body.cardFullName,
                goodsString: {
                    goodsInfo: goodsInfo
                },
                equipment: req.body.equipment,
                bodyWidth: req.body.bodyWidth,
                paymentPage: req.body.paymentPage,
                hashcode: hash
            }
            var url = `https://payment.gantenpay.com/payment/api/pay`;
            axios({
                method: 'post',
                url: url,
                data: obj
            }).then(async function (response) {
                // console.log(response.config.data);
                console.log("---------------------------", response.data);
                // resolve(response)
                return res.status(200).send(response);
            })
                .catch(function (error) {
                    console.log(error, "00000000000");
                    return res.status(501).send({ data: error, });
                });
        } else {
            return res.status(404).send({ msg: "MerchantId not matched", data: {}, });
        }
    } catch (err) {
        console.log(err);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
}
exports.addQuery = async (req, res) => {
    try {
        if ((req.body.name == (null || undefined)) || (req.body.email == (null || undefined)) || (req.body.name == "") || (req.body.email == "")) {
            return res.status(404).json({ message: "name and email provide!", status: 404, data: {} });
        } else {
            const Data = await helpandSupport.create(req.body);
            return res.status(200).json({ message: "Help and Support  create.", status: 200, data: Data });
        }

    } catch (err) {
        return res.status(500).send({ msg: "internal server error", error: err.message, });
    }
};
exports.getAllHelpandSupport = async (req, res) => {
    try {
        const data = await helpandSupport.find();
        if (data.length == 0) {
            return res.status(404).json({ message: "Help and Support not found.", status: 404, data: {} });
        }
        return res.status(200).json({ message: "Help and Support  found.", status: 200, data: data });
    } catch (err) {
        return res.status(500).send({ msg: "internal server error", error: err.message, });
    }
};
exports.getHelpandSupportById = async (req, res) => {
    try {
        const data = await helpandSupport.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Help and Support not found.", status: 404, data: {} });
        }
        return res.status(200).json({ message: "Help and Support  found.", status: 200, data: data });
    } catch (err) {
        return res.status(500).send({ msg: "internal server error", error: err.message, });
    }
};
exports.deleteHelpandSupport = async (req, res) => {
    try {
        const data = await helpandSupport.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Help and Support not found.", status: 404, data: {} });
        }
        await helpandSupport.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Help and Support  delete.", status: 200, data: {} });
    } catch (err) {
        return res.status(500).send({ msg: "internal server error", error: err.message, });
    }
};
const reffralCode = async () => {
    var digits = "1234567890123456789012345678901234567890";
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 36)];
    }
    return OTP;
}
