const userAuth = require("../Controllers/userController");
const authJwt = require('../middlewares/authJwt')
module.exports = (app) => {
    app.post("/api/v1/user/signup", userAuth.registration);
    app.post("/api/v1/user/signin", userAuth.login);
    app.post("/api/v1/user/verify/:id", userAuth.verifyOtp);


}