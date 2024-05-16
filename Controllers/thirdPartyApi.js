const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const userCard = require("../models/userCard")
const jwt = require("jsonwebtoken");
var newOTP = require("otp-generators");
const nodemailer = require("nodemailer");
const authConfig = require("../configs/auth.config");
const axios = require('axios');
const crypto = require('crypto');
const qs = require('querystring');

exports.networkStorePayment = async (req, res) => {
    try {
        // const code = `amount=${req.body.amount}&currencyCode=${req.body.currencyCode}&merNo=${req.body.merNo}&orderNo=${req.body.orderNo}&respCode=01&respMsg=GetsourceURLfails&terNo=${req.body.terNo}&tradeNo=BA1512281121473675&transType=${req.body.transType}&52400b2fc90e48a9b81cd55a6830281a`

        // ternumber => multiple bank 
        const code = `EncryptionMode=SHA256&CharacterSet=UTF8&merNo=${req.body.merNo}&terNo=${req.body.terNo}&orderNo=${req.body.orderNo}&currencyCode=${req.body.currencyCode}&amount=${req.body.amount}&payIP=${req.body.payIP}&transType=${req.body.transType}&transModel=${req.body.transModel}&52400b2fc90e48a9b81cd55a6830281a`
        const hash = crypto.createHash('sha256').update(code).digest('hex');
        req.body.hashcode = hash;
        let body = req.body;
        console.log("-------------", body);
        console.log("--------1888-----", body.merNo);
        var url = `https://payment.bringallpay.com/payment/api/payment`;
        axios({
            method: 'post',
            url: url,
            data: body
        }).then(function (response) {
            console.log(response.data);
            resolve(response)
            return res.status(200).send({ msg: "Data Payment", data: response, });

        })
            .catch(function (error) {
                return res.status(501).send({ msg: "error", data: error, });
            });
    } catch (error) {

    }
}
exports.fastPayPayment = async (req, res) => {
    try {
        // const code = `amount=${req.body.amount}&currencyCode=${req.body.currencyCode}&merNo=${req.body.merNo}&orderNo=${req.body.orderNo}&respCode=01&respMsg=GetsourceURLfails&terNo=${req.body.terNo}&tradeNo=BA1512281121473675&transType=${req.body.transType}&52400b2fc90e48a9b81cd55a6830281a`
        const code = `EncryptionMode=SHA256&CharacterSet=UTF8&merNo=${req.body.merNo}&terNo=${req.body.terNo}&orderNo=${req.body.orderNo}&currencyCode=${req.body.currencyCode}&amount=${req.body.amount}&payIP=${req.body.payIP}&transType=${req.body.transType}&transModel=${req.body.transModel}&52400b2fc90e48a9b81cd55a6830281a`
        const hash = crypto.createHash('sha256').update(code).digest('hex');
        req.body.hashcode = hash
        let body = req.body;
        console.log("-------------", body);
        console.log("--------1888-----", body.merNo);
        // return;
        var url = `https://payment.bringallpay.com/payment/api/payment`;
        axios({
            method: 'post',
            url: url,
            data: body
        }).then(function (response) {
            console.log(response.data);
            resolve(response)
            return res.status(200).send({ msg: "Data Payment", data: response, });

        })
            .catch(function (error) {
                return res.status(501).send({ msg: "error", data: error, });
            });
    } catch (error) {

    }
}
exports.requestForRefund = async (req, res) => {
    try {
        const code = `EncryptionMode=SHA256&CharacterSet=UTF8&merNo=${req.body.merNo}&refundCurrency=${req.body.refundCurrency}&refundAmount=${req.body.refundAmount}&busCurrency=${req.body.busCurrency}&busAmount=${req.body.busAmount}&tradeNo=${req.body.tradeNo}&52400b2fc90e48a9b81cd55a6830281a`
        const hash = crypto.createHash('sha256').update(code).digest('hex');
        req.body.hashcode = hash
        let body = req.body;
        console.log("-------------", body);
        console.log("--------1888-----", body.merNo);
        return;
        var url = `https://payment.bringallpay.com/payment/refund/requestForRefund`;
        axios({
            method: 'post',
            url: url,
            data: body
        }).then(function (response) {
            console.log(response.data);
            resolve(response)
            return res.status(200).send({ msg: "Data Payment", data: response, });

        })
            .catch(function (error) {
                return res.status(501).send({ msg: "error", data: error, });
            });
    } catch (error) {

    }
}
exports.query = async (req, res) => {
    try {
        const code = `${req.body.merNo}+${req.body.terNo}+${req.body.orderNo}+${req.body.amount}+${req.body.currency}+52400b2fc90e48a9b81cd55a6830281a`
        const hash = crypto.createHash('sha256').update(code).digest('hex');
        req.body.hashcode = hash
        let body = req.body;
        console.log("-------------", body);
        console.log("--------1888-----", body.merNo);
        return;
        var url = `https://payment.bringallpay.com/payment/external/query`;
        axios({
            method: 'post',
            url: url,
            data: body
        }).then(function (response) {
            console.log(response.data);
            resolve(response)
            return res.status(200).send({ msg: "Data Payment", data: response, });

        })
            .catch(function (error) {
                return res.status(501).send({ msg: "error", data: error, });
            });
    } catch (error) {

    }
}
//////////////// working api //////////////
exports.query1 = async (req, res) => {
    try {
        const { merNo,
            amount,
            billNo,
            currency,
            language,
            returnURL,
            notifyUrl,
            tradeUrl,
            lastName,
            firstName,
            country,
            state,
            city,
            address,
            zipCode,
            email,
            phone,
            shippingFirstName,
            shippingLastName,
            shippingCountry,
            shippingState,
            shippingCity,
            shippingAddress,
            shippingZipCode,
            shippingEmail,
            shippingPhone,
            cardNum,
            year,
            month,
            cvv2,
            cardBank,
            productInfo,
            nationalCode,
            ip,
            acceptLanguage,
            userAgent,
            timeZone,
            javascriptEnabled, } = req.body;
        const md5String = merNo + billNo + currency + amount + returnURL + '^Qdb}Kzy';
        const md5Info = crypto.createHash('md5').update(md5String).digest('hex');
        req.body.md5Info = md5Info;
        var url = `https://testurl.carespay.com:28081/carespay/pay`;
        const formData = qs.stringify(req.body);
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(function (response) {
            console.log(response);
            // data: {
            //     code: 'P0001',
            //     message: 'payment successful!|TEST DESCRIPTOR：SUCC',
            //     orderNo: '10014017019504553432',
            //     merNo: '100140',
            //     billNo: 'ORDER8975391',
            //     amount: '100.00',
            //     currency: '1',
            //     tradeStatus: 'S0001',
            //     returnURL: 'http://your-return-url.com',
            //     md5Info: 'e5ce3caf83056a4b2ee6a09da34a9c29',
            //     tradeTime: 1701950454917,
            //     auth3DUrl: null,
            //     billAddr: 'TEST',
            //     rebillToken: 'n1U2w0S7l262G76pXMS/9bOI67yQ==',
            //     threeDSecure: '',
            //     cnyexchangeRate: '7.1371'
            //   }
            const responseData = {
                code: response.data.code,
                message: response.data.message,
                orderNo: response.data.orderNo,
            };

            return res.status(200).send({ msg: "Data Payment", data: responseData });
        }).catch(function (error) {
            console.error(error);
            return res.status(501).send({ msg: "error", data: error.message });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.queryorder = async (req, res) => {
    try {
        const { merNo, billNo, md5key } = req.body;
        if (!merNo || !billNo || !md5key) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const signature = crypto.createHash('md5').update(`merNo=${merNo}&billNo=${billNo}&key=${md5key}`).digest('hex');
        const requestData = {
            merNo,
            billNo,
            signature,
        };
        const formData = qs.stringify(requestData);
        const queryUrl = 'https://testurl.carespay.com:28081/query/order';
        const response = await axios.post(queryUrl, formData);
        console.log(response);
        // {
        //     "msg": "Data Payment",
        //     "data": {
        //         "code": "P0001",
        //         "message": "TEST DESCRIPTOR：SUCC",
        //         "orderNo": "10014017019504553432",
        //         "merNo": "100140",
        //         "billNo": "ORDER8975391",
        //         "amount": "100.0",
        //         "currency": "1",
        //         "tradeStatus": "S0001",
        //         "returnURL": null,
        //         "md5Info": null,
        //         "tradeTime": 1701950454000,
        //         "auth3DUrl": null,
        //         "billAddr": null,
        //         "rebillToken": null,
        //         "threeDSecure": null,
        //         "cnyexchangeRate": null
        //     }
        // }
        return res.status(200).send({ msg: 'Data Payment', data: response.data });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.querybatchlist = async (req, res) => {
    try {
        const { merNo, startDate, endDate, pages, md5key } = req.body;
        if (!merNo || !startDate || !endDate || !pages || !md5key) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const signature = crypto.createHash('md5').update(`merNo=${merNo}&startDate=${startDate}&endDate=${endDate}&key=${md5key}`).digest('hex');
        const requestData = {
            merNo,
            startDate,
            endDate,
            pages,
            signature,
        };
        const formData = qs.stringify(requestData);
        const queryUrl = 'https://testurl.carespay.com:28081/query/batchlist';
        const response = await axios.post(queryUrl, formData);
        console.log(response);
        // {
        //     "msg": "Data Payment",
        //     "data": {
        //         "code": "P0001",
        //         "message": "payment successful!",
        //         "total": 854,
        //         "batchList": [
        //             {
        //                 "orderNo": "10014016987510385680",
        //                 "merNo": null,
        //                 "merOrderNo": "69987cfsrZ45816wSFSa73748",
        //                 "amount": "121.01",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0002",
        //                 "remark": "pecker.info:Do not honor",
        //                 "transDate": 1698751038000
        //             },
        //             {
        //                 "orderNo": "10014016987511269262",
        //                 "merNo": null,
        //                 "merOrderNo": "94284bUzZA93497OMoXY62515",
        //                 "amount": "121.01",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0001",
        //                 "remark": "Success:pecker.info",
        //                 "transDate": 1698751126000
        //             },
        //             {
        //                 "orderNo": "10014017000148255786",
        //                 "merNo": null,
        //                 "merOrderNo": "20231115472547801577",
        //                 "amount": "10.0",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0002",
        //                 "remark": "待支付",
        //                 "transDate": 1700014825000
        //             },
        //             {
        //                 "orderNo": "10014017010879603094",
        //                 "merNo": null,
        //                 "merOrderNo": "payment_id_3",
        //                 "amount": "12.34",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0001",
        //                 "remark": "TEST DESCRIPTOR：SUCC",
        //                 "transDate": 1701087959000
        //             },
        //             {
        //                 "orderNo": "10014016938042756871",
        //                 "merNo": null,
        //                 "merOrderNo": "liuqh-169380033300050005",
        //                 "amount": "1.0",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0002",
        //                 "remark": "1:Do not honor",
        //                 "transDate": 1693804148000
        //             },
        //             {
        //                 "orderNo": "10014016938044241458",
        //                 "merNo": null,
        //                 "merOrderNo": "liuqh-169380033300050006",
        //                 "amount": "1.0",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0002",
        //                 "remark": "TEST DESCRIPTOR：FAIL",
        //                 "transDate": 1693804396000
        //             },
        //             {
        //                 "orderNo": "10014016987482831339",
        //                 "merNo": null,
        //                 "merOrderNo": "3424223",
        //                 "amount": "1.0",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0001",
        //                 "remark": "Success:pecker.info",
        //                 "transDate": 1698748282000
        //             },
        //             {
        //                 "orderNo": "10014017018588601296",
        //                 "merNo": null,
        //                 "merOrderNo": "mvVUh6vWU6gctKdY7fWvan2ltfpDM5",
        //                 "amount": "25.0",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0001",
        //                 "remark": "TEST DESCRIPTOR：SUCC",
        //                 "transDate": 1701858859000
        //             },
        //             {
        //                 "orderNo": "10014017018589395987",
        //                 "merNo": null,
        //                 "merOrderNo": "0de5c018ce284266952c8a199c0182",
        //                 "amount": "10.01",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0006",
        //                 "remark": "TEST DESCRIPTOR：SUCC",
        //                 "transDate": 1701858939000
        //             },
        //             {
        //                 "orderNo": "10014016938012351982",
        //                 "merNo": null,
        //                 "merOrderNo": "liuqh-169380033300050003",
        //                 "amount": "1.0",
        //                 "currency": "USD",
        //                 "tradeStatus": "S0001",
        //                 "remark": "Success:pecker.info",
        //                 "transDate": 1693801188000
        //             }
        //         ]
        //     }
        // }
        return res.status(200).send({ msg: 'Data Payment', data: response.data });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//////////////// working api //////////////
exports.initiateRebill = async (req, res) => {
    try {
        const { merNo, md5key, billNo, amount, currency, returnURL, notifyUrl, productInfo, rebillToken } = req.body;
        if (!merNo || !md5key || !billNo || !amount || !currency || !returnURL || !notifyUrl || !productInfo || !rebillToken) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const tradeUrl = 'https://testurl.carespay.com:28081/carespay/rebill';
        const md5Info =
            crypto.createHash('md5').update(`${merNo}${billNo}${currency}${amount}${returnURL}${md5key}`).digest('hex');
        const requestData = {
            merNo,
            billNo,
            amount,
            currency,
            language: 'EN',
            returnURL,
            notifyUrl,
            tradeUrl,
            productInfo,
            rebillToken,
            md5Info,
        };
        const formData = qs.stringify(requestData);
        const response = await axios.post(tradeUrl, formData);
        console.log(response);
        return res.status(200).send({ msg: 'Data Payment', data: response.data });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// not required 
exports.getRebillToken = async (req, res) => {
    try {
        const { merNo, privateCardNo, lastRebillToken, md5key } = req.body;
        if (!merNo || !privateCardNo || !lastRebillToken || !md5key) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const signature = crypto
            .createHash('md5')
            .update(`merNo=${merNo}&privateCardNo=${privateCardNo}&lastRebillToken=${lastRebillToken}&key=${md5key}`).digest('hex');
        const requestData = {
            merNo,
            privateCardNo,
            lastRebillToken,
            signature,
        };
        const formData = qs.stringify(requestData);
        const queryUrl = 'https://testurl.carespay.com:28081/getRebillToken';
        const response = await axios.post(queryUrl, formData);
        console.log(response);
        return res.status(200).send({ msg: 'Data Payment', data: response.data });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.refund = async (req, res) => {
    try {
        const { merNo, orderNo, amount, returnNotify, remark, md5key } = req.body;
        if (!merNo || !orderNo || !amount || !md5key) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const expectedSignature = crypto.createHash('md5').update(`amount=${amount}&merNo=${merNo}&orderNo=${orderNo}&key=${md5key}`).digest('hex');
        const md5String = merNo + orderNo + '1' + amount + returnNotify + '^Qdb}Kzy';
        const signature = crypto.createHash('md5').update(md5String).digest('hex');
        if (signature !== expectedSignature) {
            return res.status(400).json({ error: 'Invalid MD5 signature' });
        }
        const requestData = {
            merNo,
            orderNo,
            amount,
            signature,
            returnNotify,
            remark,
        };
        const formData = qs.stringify(requestData);
        const refundUrl = 'https://testurl.carespay.com:28081/refund';
        const response = await axios.post(refundUrl, formData);
        console.log(response);
        return res.status(200).send({ msg: 'Data Payment', data: response.data });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}