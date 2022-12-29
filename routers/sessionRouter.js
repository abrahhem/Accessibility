const  Router = require('express');
const { sessionsController } = require('../controllers/sessionsController');
const sessionRouter = new Router();


sessionRouter.get('/logout', sessionsController.logout);
sessionRouter.get('/getInfo', sessionsController.getUser);
sessionRouter.get('/login', sessionsController.login);


module.exports = { sessionRouter };