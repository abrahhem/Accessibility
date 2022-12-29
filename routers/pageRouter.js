const  Router  = require('express');
const { pagesController } = require('../controllers/pagesController');

const pageRouter = new Router();


pageRouter.get("/index", pagesController.getIndex);
pageRouter.get("/home", pagesController.getHome);
pageRouter.get("/map", pagesController.getMap);
pageRouter.get("/*", pagesController.getError);


module.exports = { pageRouter };