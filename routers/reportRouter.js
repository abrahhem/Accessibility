const Router = require("express");
const { reportsController } = require('../controllers/reportsController');
const reportRouter = new Router();

reportRouter.get("/user/:id", reportsController.getReportsByUser);
reportRouter.get("/user", reportsController.getReportsByUser);
reportRouter.get("/statistics/:id", reportsController.getReportStatistics);
reportRouter.get("/locations", reportsController.getReportLocations);
reportRouter.get("/:id", reportsController.getReportsById);
reportRouter.get('/', reportsController.getAllReports);

reportRouter.post("/", reportsController.addReport);

reportRouter.put("/rate/:id", reportsController.rateReport);

reportRouter.delete("/:id", reportsController.deleteReport);

module.exports =  { reportRouter };