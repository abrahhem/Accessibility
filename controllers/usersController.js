const Logger = require("../logger/Logger");
const UsersRepository = require("../repositories/usersRepository");
const {cloudinary} = require("../data/cloudinary");
const logger = new Logger();
const usersRepository = new UsersRepository();


const checkIfExists = async (email) => {
    const user = await usersRepository.findUser(email, false);
    return user.length === 1 ? user[0] : false;
}

exports.usersController = {

    async getAllUsers (req, res) {
        logger.log("Getting all users.");
        res.status(200).json(await usersRepository.find());
    },

    async getUserByEmail(req, res) {
        const { email } = req.params;
        const user  = await checkIfExists(email);
        if (user === false) {
            res.status(400).json("Error: user " + email + " is not found.");
        } else {

            if (!req.session.hasOwnProperty("userInfo") || req.session.userInfo.email !== email) {
                logger.log("Getting user " + email + ".");
                res.status(200).json(user);
            }
            else {
                logger.log("Getting user " + email + ".");
                const User = await usersRepository.findUser(email, true);
                res.status(200).json(User[0]);
            }
        }
    },

    async deleteUser(req, res) {
        const { email } = req.body;
        const user  = await checkIfExists(email);
        if (user === false) {
            res.status(400).send("Error: user " + email + " is not found.");
        } else {
            if (!req.session.hasOwnProperty("userInfo") || req.session.userInfo.email !== email) {
                res.status(200).send("Error: you don't have permission to delete others.");
            }
            else {
                const result = await usersRepository.deleteUser(email);
                if(!result)
                    res.status(400).send("Failed to delete user " + email + ".");
                else {
                    req.session.destroy();
                    logger.log("Delete user " + email + ".");
                    res.status(200).send("User " + email + " is deleted.");
                }
            }
        }
    },

    async editUser(req, res) {

        if (!req.session.hasOwnProperty("userInfo")) {
            res.status(400).send("Error: you don't have permission to edite others.");
        }
        else {
            const email = req.session.userInfo.email
            const result = await usersRepository.updateUser(email, req.body);
            if(!result)
                res.status(400).send("Failed to edit user " + email + ".");
            else {
                logger.log("Edit user " + email + ".");
                res.status(200).send("Succeeded to edit user "+ email + ".");
            }
        }
    },

    async addUser(req, res) {
        try {
            const user = req.body;
            if (user.hasOwnProperty("imgUrl")) {
                const fileStr = user.imgUrl;
                const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
                    upload_preset: "profileImages"
                });
                user.imgUrl = uploadedResponse.public_id;
            }
            await usersRepository.addUser(user);
            logger.log("Creating a new user.");
            res.status(200).send("Succeeded, user is added.");
        } catch (e) {
            res.status(500).send("Error: failed to add user. " + e);
        }
    }
}


