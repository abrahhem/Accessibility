const Logger = require("../logger/Logger");
const ReportsRepository = require("../repositories/reportsRepository");
const logger = new Logger();
const reportsRepository = new ReportsRepository();

const checkIfExists = async (id) => {
    const report = await reportsRepository.findReport(id);
    return report.length === 1 ? report[0] : false;
}

const checkIfExistsByUser = async (userID) => {
    const report = await reportsRepository.findReportsByUser(userID);
    return report.length === 1 ? report[0] : false;
}

exports.reportsController = {


    async getAllReports(req, res) {
        res.status(200).json(await reportsRepository.find());
    },

    getReportsByUser (req, res) {
        const report = req.params.hasOwnProperty("id") ? checkIfExistsByUser(req.params.id) : checkIfExistsByUser(req.session._id);
        if (report) {
            logger.log("");
            res.status(200).json(report);
        }
        else {
            logger.log("");
            res.status(404).json({});
        }

    },
    getReportsById  (req, res) {
        const report = checkIfExists(req.params.id);
        if (report) {
            logger.log("");
            res.status(200).json(report);
        }
        else {
            logger.log("");
            res.status(404).json({});
        }
    },

    deleteReport (req, res) {
        const { id } = req.params;
        const report = checkIfExists(req.params.id);
        if(report === false) {
            logger.log("");
            res.status(404).send("");
        }
        else {
            reportsRepository.deleteReport(id);
        }
    },

    async addReport(req, res) {
        try {
            const { _id } = req.session.userInfo;
            const report = req.body;
            report["postedBy"] = _id;
            await reportsRepository.addReport(report);
            logger.log("User" + _id + " added a report.");
            res.status(200).send("Succeeded, got your report.");

        } catch (e) {
            res.status(500).send("Error: failed to add user. " + e.message);
        }
    },

    async rateReport(req, res) {
        const {rank} = req.body;
        const { id } = req.params;
        try {
            const report = await checkIfExists(id);
            const result = await reportsRepository.rateReport(rank, report);
            if (result !== true)
                console.log("send email to the admin");
            else
                res.status(200).send("Succeeded.");
        } catch (e) {
            res.status(500).send("Error: failed to rate the report. " + e.message);
        }
    },
    async getReportStatistics(req, res) {
        try {
            const report = await checkIfExists(req.params.id);
            if (report) {
                const counts = [];
                for (let i = 1; i <= 10; i++) {
                    const key = "graded" + i;
                    counts.push(~~report.rates.counts[key]);
                }
                const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                const data = {
                    labels: labels,
                    datasets: [{
                        label:  report.severityScale,
                        data: counts,
                        backgroundColor: [
                            'rgba(66, 248, 61, 0.2)',
                            'rgba(177, 203, 2, 0.2)',
                            'rgba(172, 207, 2, 0.2)',
                            'rgba(198, 181, 2, 0.2)',
                            'rgba(216, 162, 1, 0.2)',
                            'rgba(225, 138, 7, 0.2)',
                            'rgba(230, 119, 12, 0.2)',
                            'rgba(233, 99, 23, 0.2)',
                            'rgba(228, 82, 46, 0.2)',
                            'rgba(221, 57, 67, 0.2)'
                        ],
                        borderColor: [
                            'rgb(66, 248, 61)',
                            'rgb(177, 203, 2)',
                            'rgb(172, 207, 2)',
                            'rgb(198, 181, 2)',
                            'rgb(216, 162, 1)',
                            'rgb(225, 138, 7)',
                            'rgb(230, 119, 12)',
                            'rgb(233, 99, 23)',
                            'rgb(228, 82, 46)',
                            'rgb(221, 57, 67)'
                        ],
                        borderWidth: 1
                    }]
                };
                res.status(200).json({
                    type: 'bar',
                    data: data,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            } else {
                logger.log("");
                res.status(404).json({});
            }
        } catch (e) {

        }
    }
}


