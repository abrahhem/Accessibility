const UsersRepository   = require("../repositories/usersRepository");
const ReportsRepository = require("../repositories/reportsRepository");
const reportsRepository = new ReportsRepository();
const usersRepository   = new UsersRepository();



async function findUser(userID) {
    const user = await usersRepository.findUser(userID, false);
    if (user.length !== 1)
        return false;
    return user[0];
}

async function findReport(reportID) {

    const report = await reportsRepository.findReport(reportID);
    if (report.length !== 1)
        return false;

    const user = await usersRepository.findUser(report[0].postedBy, false);
    if (user.length !== 1)
        return false;

    return {
        user: user[0],
        report: report[0]
    };

}

async function userReports(userID) {

    const user = await usersRepository.findUser(userID, false);
    if (user.length !== 1)
        return false;
    const reports = await reportsRepository.findReportsByUser(userID);

    return {
        user: user[0],
        reports: reports
    };

}

async function all(role) {
    const users = await usersRepository.find();
    const arg =  role === "admin" ? {severityScale: -1, createdAt: -1} : {createdAt: -1};
    const reports = await reportsRepository.findAndSort(arg);
    const data = [];
    reports.forEach(report => {
        const user = users.filter(user => user._id.equals(report.postedBy));
        data.push( {
            user: user[0],
            report: report
        });
    });
    return data;
}




exports.pagesController = {

    getIndex(req, res) {
        if(req.session.hasOwnProperty("userInfo"))
            res.redirect("home");
        else
            res.render("index");
    },

    async getHome(req, res) {
        if (!req.session.hasOwnProperty("userInfo"))
            res.redirect("/");
        else {
            const data = await all(req.session.userInfo.role);
            res.render("home", {user: req.session.userInfo, data: data});
        }
    },

    getMap(req, res) {
        if(!req.session.hasOwnProperty("userInfo"))
            res.redirect("/");
        else
            res.render("map", { user: req.session.userInfo });
    },
    getError(req, res) {
        res.render("404");
    },
    async getUsers(req, res) {
        if (!req.session.hasOwnProperty("userInfo"))
            res.redirect("/");
        else {
            const users = await usersRepository.find();
            res.render("usersList", {user: req.session.userInfo, users: users});
        }
    },
    getReportForm(req, res) {
        if(!req.session.hasOwnProperty("userInfo"))
            res.redirect("/");
        else
            res.render("reportForm", { user: req.session.userInfo });
    },

    async getProfile(req, res) {
        if (!req.session.hasOwnProperty("userInfo"))
            res.redirect("/");
        else {
            const { id } = req.params;
            if (req.session.userInfo._id !== id) {
                try {
                    const user = await findUser(id);

                    if (user === false)
                        res.render("404");
                    else
                        res.render("profile", {user: req.session.userInfo, info: user});
                } catch (e) {
                    res.render("404");
                }
            } else {
                res.render("profile", {user: req.session.userInfo, info: req.session.userInfo});
            }
        }
    },

    async getReport(req, res) {
        if (!req.session.hasOwnProperty("userInfo"))
            res.redirect("/");
        else {
            const {id} = req.params;
            try {
                const report = await findReport(id);
                if (report === false)
                    res.render("404");
                else
                    res.render("report", {user: req.session.userInfo, data: report});
            } catch (e) {
                res.render("404");
            }
        }
    }

}