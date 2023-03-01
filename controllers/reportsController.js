const nodemailer = require("nodemailer");
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

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.AUTOEMAIL,
        pass: process.env.EMAILPASS
    }
});



const sendEmail = (report) => {

    const mailOptions = {
        from: process.env.AUTOEMAIL,
        to: 'accessibilitydb42@gmail.com',
        subject: 'New Report with High Severity Rating',
        text: `Dear System Administrator,
        
I'm writing to notify you of a new report that was received with a very high severity rating. This alert was generated automatically by our system, which detected the severity rating of the report.

The details of the report are as follows:

Report ID: ${report._id}
Severity Rating: ${report.severityScale}
Description: ${report.description}

We recommend that you take immediate action to address this issue. Please review the full report and take appropriate steps to remediate the vulnerability as soon as possible.

If you have any questions or need further information, please don't hesitate to contact us.

Best regards,

[Your Company Name] Security Team

Note that in this message, we've indicated that the alert was generated automatically by our system. This helps the system administrator understand the context of the message and the urgency of the situation. We've also provided all the necessary details of the report, so the administrator can quickly assess the severity of the vulnerability and take appropriate action.`

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.log(error);
        } else {
            logger.log("Email sent: " + info.response);
        }
    });

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
            logger.log("Error: Report by " + id + " ID was not found");
            res.status(404).send("Error: Report by " + id + " ID was not found");
        }
        else {
            reportsRepository.deleteReport(report);
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
            if (result !== true) {
                sendEmail(result)
            }
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
    },
    async getReportLocations(req, res) {
        const reports = await reportsRepository.find();
        const locations = [];
        reports.forEach(report => {
            locations.push({
                _id: report["_id"],
                coordinates: report.location.coordinates
            });
        });
        res.status(200).json(locations);
    }
}


