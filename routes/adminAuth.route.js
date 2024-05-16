const auth = require("../Controllers/adminController");
const authJwt = require('../middlewares/authJwt')
module.exports = (app) => {
    app.post("/api/v1/admin/signup", auth.registration);
    app.post("/api/v1/admin/login/:id/verify", auth.verifyOtp);
    app.post("/api/v1/admin/login", auth.login);
    app.post("/api/v1/admin/resendotp/:id", auth.resendOTP);
    app.get("/api/v1/admin/getAllUser", auth.getAllUser);
    app.get("/api/v1/admin/viewUser/:id", [authJwt.verifyToken], auth.viewUser);
    app.delete("/api/v1/admin/:id", [authJwt.verifyToken], auth.deleteUser);
    app.post("/api/v1/notification/sendNotification", authJwt.verifyToken, auth.sendNotification);
    app.get("/api/v1/notification/allNotification", authJwt.verifyToken, auth.allNotification);
}