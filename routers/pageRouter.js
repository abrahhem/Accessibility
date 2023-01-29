const  Router  = require('express');
const { pagesController } = require('../controllers/pagesController');

const pageRouter = new Router();


pageRouter.get("/", pagesController.getIndex);
pageRouter.get("/home", pagesController.getHome);
pageRouter.get("/reportForm", pagesController.getReportForm);
pageRouter.get("/map", pagesController.getMap);
pageRouter.get("/usersList", pagesController.getUsers);
pageRouter.get("/profile/:id", pagesController.getProfile);
pageRouter.get("/report/:id", pagesController.getReport);
pageRouter.get("/reports", pagesController.getReport);
pageRouter.get("/*", pagesController.getError);


module.exports = { pageRouter };