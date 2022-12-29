const mongoose = require("mongoose");
const Path = require("path");
const Logger = require("../logger/Logger");
const logger = new Logger();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports = class Storage {

    constructor (Model) {
        this.Model = require(Path.join(__dirname, "../models/" + Model + ".js"));
        this.connect();
    }

    connect () {
        const DBUrl = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST;
        mongoose.set('strictQuery', false);
        mongoose
            .connect(DBUrl, options)
            .then(() => logger.log("connected to mongoDB"))
            .catch(err => logger.log("connection error: " + err));
    }

    find() {
        return this.Model.find({});
    }

    findItem(id) {
        return this.Model.find(id);
    }

    addItem(data) {
        const item = new this.Model(data);
        return item.save();
    }

    deleteItems(ids) {
        return this.Model.deleteMany(ids);
    }

    updateItem(id, data) {
        return this.Model.updateOne(id, data);
    }
};