const Storage = require("../data/storage");
const Logger  = require("../logger/Logger");
const { Image, Point, Rate } = require("../models/includesModels");
const { cloudinary } = require("../data/cloudinary");

const logger = new Logger();

const deleteImage = async function (publicId) {
    if (publicId === "default")
        return;
    try {
        await cloudinary.v2.uploader.destroy(publicId);
    } catch (err) {
        logger.log(err);
    }
}

module.exports = class UsersRepository {
    constructor() {
        this.storage = new Storage("reportModel");
    }

    find() {
        return this.storage.find();
    }

    findAndSortAll(arg) {
        return this.storage.findAndSortAll(arg);
    }

    findAndSortByUser(userID,arg) {
        return this.storage.findAndSortItems({postedBy: userID}, arg);
    }

    findReport(id) {
        return this.storage.findItem({_id: id});
    }

    findReportsByUser(userID) {
        return this.storage.findItem({postedBy: userID});
    }

    async addReport(report) {
        report["location"] = new Point( {
            coordinates: report.coordinates
        });
        delete report.coordinates;
        const { imgFiles } = report;
        delete report.imgFiles;
        report["rates"] = new Rate();
        const { _id } = await this.storage.addItem(report);
        await this.uploadImages(_id, imgFiles);
    }

    async rateReport(rank, report) {

        if(rank < 1 || rank > 10)
            throw "Error, rating value is out of range";
        report.rates.counts["graded" + rank]++;

        let count = 0, sum = 0;

        for (let i = 1 ; i <= 10 ; i++) {
            const key = "graded" + i ;
            count += report.rates.counts[key];
            sum += report.rates.counts[key]*i;
        }
        report.severityScale = (sum/count).toFixed(4);
        await this.updateReport(report._id, report);
        if (count > 10 && sum/count > 7)
             return report;
        return true;
    }

    updateReport(id, report) {
        report["updatedAt"] = new Date();
        if(report.hasOwnProperty("createdAt"))
            delete report.createdAt;
        return this.storage.updateItem({ _id: id}, report);
    }

    deleteReports(userID) {
        return this.storage.deleteItems({ postedBy: userID });
    }

    deleteReport(id) {
        return this.storage.deleteItems({ _id: id});
    }

    filter(criterias) {
        return this.storage.findItem(criterias);
    }

    async uploadImages(id, imgs) {
        const images = [];
        for (const img in imgs) {
            const uploadedResponse = await cloudinary.v2.uploader.upload(imgs[img], {
                upload_preset: "report-preset"
            });
            images.push(new Image({
                publicId: uploadedResponse.public_id,
                secureUrl: uploadedResponse.secure_url
            }));
        }
        return await this.storage.updateItem({_id: id}, { images: images});
    }
};