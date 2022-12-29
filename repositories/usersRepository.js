const Storage = require("../data/storage");
const { cloudinary } = require("../data/cloudinary");
const moment = require("moment");

module.exports = class UsersRepository {
    constructor() {
        this.storage = new Storage("userModel");
    }

    find() {
        return this.storage.find();
    }

    findUser(email, pass) {
        return pass ? this.storage.findItem({email: email}).select("+password") : this.storage.findItem({email: email});
    }

    addUser(user) {
        user["createdAt"] = moment().format("MM-DD-YY hh:mm");
        user["updatedAt"] = moment().format("MM-DD-YY hh:mm");
        console.log(user);
        return this.storage.addItem(user);
    }

    updateUser(email, user) {
        user["updatedAt"] = moment().format("MM-DD-YY hh:mm");
        if(user.hasOwnProperty("createdAt"))
            delete user.createdAt;
        return this.storage.updateItem({ email: email}, user);
    }

    deleteUser(email) {
        return this.storage.deleteItems({ email: { $in: email}});
    }

};