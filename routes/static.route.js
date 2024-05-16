const staticContent = require('../Controllers/static.Controller');
const { authJwt, authorizeRoles } = require("../middlewares");
module.exports = (app) => {
    app.post('/api/v1/static/createAboutus', [authJwt.verifyToken], staticContent.createAboutUs);
    app.put('/api/v1/static/aboutUs/:id', [authJwt.verifyToken], staticContent.updateAboutUs);
    app.delete('/api/v1/static/aboutUs/:id', [authJwt.verifyToken], staticContent.deleteAboutUs);
    app.get('/api/v1/static/getAboutUs', staticContent.getAboutUs);
    app.get('/api/v1/static/aboutUs/:id', staticContent.getAboutUsById);
    app.post('/api/v1/static/createPrivacy', [authJwt.verifyToken], staticContent.createPrivacy);
    app.put('/api/v1/static/privacy/:id', [authJwt.verifyToken], staticContent.updatePrivacy);
    app.delete('/api/v1/static/privacy/:id', [authJwt.verifyToken], staticContent.deletePrivacy);
    app.get('/api/v1/static/getPrivacy', staticContent.getPrivacy);
    app.get('/api/v1/static/privacy/:id', staticContent.getPrivacybyId);
    app.post('/api/v1/static/createTerms', [authJwt.verifyToken], staticContent.createTerms);
    app.put('/api/v1/static/terms/:id', [authJwt.verifyToken], staticContent.updateTerms);
    app.delete('/api/v1/static/terms/:id', [authJwt.verifyToken], staticContent.deleteTerms);
    app.get('/api/v1/static/getTerms', staticContent.getTerms);
    app.get('/api/v1/static/terms/:id', staticContent.getTermsbyId);
    app.post("/api/v1/static/faq/createFaq", [authJwt.verifyToken], staticContent.createFaq);
    app.put("/api/v1/static/faq/:id", [authJwt.verifyToken], staticContent.updateFaq);
    app.delete("/api/v1/static/faq/:id", [authJwt.verifyToken], staticContent.deleteFaq);
    app.get("/api/v1/static/faq/All", staticContent.getAllFaqs);
    app.get("/api/v1/static/faq/:id", staticContent.getFaqById);
};  