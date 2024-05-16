const auth = require("../Controllers/userController");
const authJwt = require('../middlewares/authJwt')
const cryptoApi = require("../Controllers/cryptoApi");
const { upload } = require('../middlewares/imageUpload')
const auth1 = require("../Controllers/thirdPartyApi");
module.exports = (app) => {
    app.post("/api/v1/auth/query", auth1.query1);
    app.post("/api/v1/auth/initiateRebill", auth1.initiateRebill);
    app.post("/api/v1/auth/queryorder", auth1.queryorder);
    app.post("/api/v1/auth/querybatchlist", auth1.querybatchlist);
    app.post("/api/v1/auth/getRebillToken", auth1.getRebillToken);
    app.post("/api/v1/auth/refund", auth1.refund);



































































    app.post("/api/v1/auth/signup", auth.registration);
    app.post("/api/v1/auth/login/:id/verify", auth.verifyOtp);
    app.post("/api/v1/auth/login", auth.login);
    app.post("/api/v1/resendotp/:id", auth.resendOTP);
    app.put("/api/v1/user/updateNotification", [authJwt.verifyToken], auth.updateNotification);
    app.put("/api/v1/user/update", [authJwt.verifyToken], upload.single('image'), auth.update);
    app.post("/api/v1/help/addQuery", auth.addQuery);
    app.get("/api/v1/help/all", auth.getAllHelpandSupport);
    app.get("/api/v1/help/:id", auth.getHelpandSupportById);
    app.delete("/api/v1/help/:id", auth.deleteHelpandSupport);
    app.post("/api/v1/user/card/new", [authJwt.verifyToken], auth.createPaymentCard);
    app.put("/api/v1/user/card/update/:id", [authJwt.verifyToken], auth.updatePaymentCard);
    app.get("/api/v1/user/card/getAllCard", [authJwt.verifyToken], auth.getPaymentCard);
    app.delete("/api/v1/user/card/delete/:id", [authJwt.verifyToken], auth.DeletePaymentCard);
    app.post("/api/v1/auth/payment", auth.networkStorePayment);
    app.post("/api/v1/auth/fastPayPayment", auth.fastPayPayment);
    app.post("/api/v1/auth/requestForRefund", auth.requestForRefund);
    app.post("/api/v1/auth/JumpPayment", auth.JumpPayment);
    app.post("/api/v1/createExchangeTransaction", [authJwt.verifyToken], cryptoApi.createExchangeTransaction);
    app.post("/api/v1/createApiv2ExchangeTransaction", [authJwt.verifyToken], cryptoApi.createApiv2ExchangeTransaction);
    app.get("/api/v1/checkTransactionStatus/:id", [authJwt.verifyToken], cryptoApi.checkTransactionStatus);
    app.get("/api/v1/listTransaction", [authJwt.verifyToken], cryptoApi.listTransaction);
    app.get("/api/v1/checkApiv2TransactionStatus1/:id", [authJwt.verifyToken], cryptoApi.checkTransactionStatus1);
    app.get("/api/v1/findExchangeRange", [authJwt.verifyToken], cryptoApi.findExchangeRange);
    app.get("/api/v1/findMinimalExchangeAmount", [authJwt.verifyToken], cryptoApi.findMinimalExchangeAmount);
    app.get("/api/v1/findAvailableCurrency", [authJwt.verifyToken], cryptoApi.findAvailableCurrency);
    app.get("/api/v1/addressValidate", [authJwt.verifyToken], cryptoApi.addressValidate);
    app.get("/api/v1/estimatedExchangeNetworkFee", [authJwt.verifyToken], cryptoApi.estimatedExchangeNetworkFee);
    app.get("/api/v1/MarketEstimateFiatandCrypto", [authJwt.verifyToken], cryptoApi.MarketEstimateFiatandCrypto);
    app.get("/api/v1/fiatCurrencies", cryptoApi.fiatCurrencies);
    app.get("/api/v1/currencyInfo", cryptoApi.currencyInfo);
    app.get("/api/v1/listofAvailablecurrencies", cryptoApi.listofAvailablecurrencies);
    app.get("/api/v1/listofAvailablecurrenciesforSpecificcurrency", cryptoApi.listofAvailablecurrenciesforSpecificcurrency);
    app.get("/api/v1/estimatedExchangeAmount", cryptoApi.estimatedExchangeAmount);
    app.get("/api/v1/minimalExchangeAmountStandardFlow", cryptoApi.minimalExchangeAmountStandardFlow);
    app.get("/api/v1/exchangeRangeStandardFlow", cryptoApi.exchangeRangeStandardFlow);
    app.get("/api/v1/listofAvailablePairsStandardFlow", cryptoApi.listofAvailablePairsStandardFlow);
}