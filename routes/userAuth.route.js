const userAuth = require("../Controllers/userController");
const authJwt = require('../middlewares/authJwt')
module.exports = (app) => {
    app.post("/api/v1/user/signup", userAuth.registration);
}