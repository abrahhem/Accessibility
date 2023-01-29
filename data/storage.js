const Path = require("path");

module.exports = class Storage {

    constructor (Model) {
        this.Model = require(Path.join(__dirname, "../models/" + Model + ".js"));
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

    deleteItem(id) {
        const item = this.Model.findOne(id);
        return item.deleteOne(id);
    }

    deleteItems(ids) {
        return this.Model.deleteMany(ids);
    }

    updateItem(id, data) {
        return this.Model.updateOne(id, data, {runValidators: true});
    }
};