const bcrypt = require("bcrypt");
const Storage = require("../data/storage");
const Logger  = require("../logger/Logger");
const { Image } = require("../models/includesModels");
const {cloudinary} = require("../data/cloudinary");

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

async function hashPassword(plaintextPassword) {
    return await bcrypt.hash(plaintextPassword, 10);
}


module.exports = class UsersRepository {
    constructor() {
        this.storage = new Storage("userModel");
    }

    find() {
        return this.storage.find();
    }

    findUser(id, pass) {
        return pass ? this.storage.findItem({_id: id}).select("+password") : this.storage.findItem({_id: id});
    }

    async updateImage(id, img, publicID) {
        let image;
        if ( img === "delete") {
            const res = await deleteImage(publicID);
            image = new Image();
        }
        else if (img !== undefined){
            const res = await deleteImage(publicID);
            const uploadedResponse = await cloudinary.v2.uploader.upload(img, {
                upload_preset: "profile-preset"
            });
            image = new Image({
                publicId: uploadedResponse.public_id,
                secureUrl: uploadedResponse.secure_url
            });
        }
        return this.storage.updateItem({_id: id}, { image: image});
    }

    async addUser(user) {

        const imgFile  = user.hasOwnProperty("imgFile") ? user.imgFile : undefined;
        if(imgFile !== undefined)
            delete user.imgFile;

        user["password"] = await hashPassword(user["password"]);
        user["updatedAt"] = new Date();
        const { _id } = await this.storage.addItem(user);
        return await this.updateImage(_id, imgFile, undefined);
    }



    async updateUser(id, old, user) {
        user["updatedAt"] = new Date();

        const imgFile  = user.hasOwnProperty("imgFile") ? user.imgFile : undefined;
        if(imgFile !== undefined)
            delete user.imgFile;

        if (user.hasOwnProperty("createdAt"))
            delete user.createdAt;

        await this.storage.updateItem({_id: id}, user);
        await this.updateImage(id, imgFile, old.image.publicId);

    }

    async deleteUser(id, image) {
        if (image.publicId !== "publicId")
            await deleteImage(image.publicId);
        return this.storage.deleteItem({_id: id});
    }

    filter(criterias) {
        return this.storage.findItem(criterias);
    }

};