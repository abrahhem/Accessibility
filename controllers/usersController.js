const Logger = require("../logger/Logger");
const UsersRepository = require("../repositories/usersRepository");
const logger = new Logger();
const usersRepository = new UsersRepository();


const checkIfExists = async (id) => {
    const user = await usersRepository.findUser(id, false);
    return user.length === 1 ? user[0] : false;
}

exports.usersController = {

    async getAllUsers (req, res) {
        logger.log("Getting all users.");
        res.status(200).json(await usersRepository.find());
    },

    async getUserByID(req, res) {
        const { id } = req.params;
        const user = await checkIfExists(id);
        if (user === false) {
            res.status(400).json({msg: "Error: user " + id + " is not found."});
        } else {

            if (!req.session.hasOwnProperty("userInfo") || req.session.userInfo._id !== id) {
                logger.log("Getting user " + id + ".");
                res.status(200).json(user);
            }
            else {
                logger.log("Getting user " + id + ".");
                const User = await usersRepository.findUser(id, true);
                res.status(200).json(User[0]);
            }
        }
    },

    async deleteUser(req, res) {
        const { id } = req.params;
        const user  = await checkIfExists(id);
        if (user === false) {
            res.status(400).send("Error: user " + id + " is not found.");
        } else {
            if (!req.session.hasOwnProperty("userInfo") || req.session.userInfo._id !== id) {
                res.status(200).send("Error: you don't have permission to delete others.");
            }
            else {
                const result = await usersRepository.deleteUser(id, user.image);
                if(!result)
                    res.status(400).send("Failed to delete user " + id + ".");
                else {
                    req.session.destroy();
                    logger.log("Delete user " + id + ".");
                    res.status(200).send("User " + id + " is deleted.");
                }
            }
        }
    },

    async editUser(req, res) {
        const { id } = req.params;
        if (!req.session.hasOwnProperty("userInfo") || req.session.userInfo._id !== id) {
            res.status(400).send("Error: you don't have permission to edite others.");
        }
        else {
            try {
                await usersRepository.updateUser(id, req.session.userInfo, req.body);
                req.session.userInfo = await checkIfExists(id);
                logger.log("Edit user " + id + ".");
                res.status(200).send("Succeeded to edit user " + id + ".");

            } catch (e) {
                res.status(500).send("Error: failed to edit user. " + e.message);
            }
        }
    },

    async addUser(req, res) {
        try {
            const user = req.body;
            await usersRepository.addUser(user);
            logger.log("Creating a new user.");
            res.status(200).send("Succeeded, user is added.");
        } catch (e) {
            res.status(500).send("Error: failed to add user. " + e.message);
        }
    }
}


