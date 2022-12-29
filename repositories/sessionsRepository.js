const Storage = require("../data/storage");

module.exports = class Sessions {
    constructor() {
        this.storage = new Storage("userModel");
    }

    findUser(email) {
        return this.storage.findItem({email: email}).select("+password");
    }

};