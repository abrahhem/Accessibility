const moment = require("moment");
const fs = require("fs");
const path = require("path");

module.exports = class Logger {
    constructor() {
        if (!Logger._instance) {
            Logger._instance = this;
        } else {
            return Logger._instance;
        }
        this.initLogger();
    }
    initLogger() {
        this.logger = console;
        this.storage = {
            write: data=> fs.appendFile(path.join(__dirname,'/logs.txt'), data,null,()=> {})
        };
        return this;
    }

    log(message = '') {
        const time = moment().format('MM-DD-YY hh:mm');
        const msg = time + " -> " + message;
        this.logToFile(msg);
        this.logger.log(msg);
    }

    logToFile(data){
        this.storage.write(data + '\n')
    }
}