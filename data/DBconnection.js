const mongoose = require("mongoose");
const Logger = require("../logger/Logger");
const logger = new Logger();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connect =  () => {
    const DBUrl = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST;
    mongoose.set('strictQuery', false);
    mongoose
        .connect(DBUrl, options)
        .then(() => logger.log("connected to mongoDB"))
        .catch(err => logger.log("connection error: " + err));
};

module.exports = { connect };