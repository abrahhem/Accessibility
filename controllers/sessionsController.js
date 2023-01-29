const SessionsRepository = require("../repositories/sessionsRepository");
const Logger = require("../logger/Logger");
const bcrypt = require("bcrypt")
const logger = new Logger();
const sessionsRepository = new SessionsRepository();


async function comparePassword(plaintextPassword, hash) {
    return await bcrypt.compare(plaintextPassword, hash);
}


exports.sessionsController = {

    async login(req, res) {
        const { email, password } = req.query;

        const user = await sessionsRepository.findUser(email);
        if (user.length === 1) {
            if (await comparePassword(password, user[0].password)) {
                req.session.userInfo = user[0];
                logger.log(email + " logged in successfully.");
                res.status(200).send("success");
            }
            else {
                logger.log(email + " failed to login");
                res.status(400).send(email + " failed to login, password is not right.");
            }
        }
        else {
            logger.log("User " + email + " is not found!.");
            res.status(404).send("User " + email + " is not found!.");
        }
    },
    //destroy the session
    logout(req, res) {
        logger.log( req.session.userInfo._id + " logged out.");
        req.session.destroy();
        res.redirect("/");
    },
    //Get user details from session
    getUser(req, res) {
        if (req.session.hasOwnProperty("userInfo"))
            res.status(200).json(req.session.userInfo);
        else
            res.status(404).json( {} );
    }
}
