const SessionsRepository = require("../repositories/sessionsRepository");
const Logger = require("../logger/Logger");
const logger = new Logger();
const sessionsRepository = new SessionsRepository();

exports.sessionsController = {

    async login(req, res) {
        const { email, password } = req.query;

        const user = await sessionsRepository.findUser(email);
        if (user.length === 1 && user[0].password === password) {
            req.session.userInfo = user[0];
            logger.log(email + " logged in successfully");
            res.status(200).send("succeeded");
        }
        else {
            if(user.length === 0) {
                logger.log("User " + email + " is not found!.");
                res.status(404).send("User " + email + " is not found!.");
            }
            else {
                logger.log(email + " failed to login");
                res.status(400).send(email + " failed to login, password is not right.");
            }
        }
    },
    //destroy the session
    logout(req, res) {
        req.session.destroy();
        res.status(200).send("Goodbye");
    },
    //Get user details from session
    getUser(req, res) {
        if (req.session.hasOwnProperty("userInfo"))
            res.status(200).json(req.session.userInfo);
        else
            res.status(404).json( {} );
    }
}