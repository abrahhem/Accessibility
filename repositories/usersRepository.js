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

    async addUser(user) {
        const imgFile  = user?.imgFile;
        if(imgFile) {
            delete user.imgFile;
            const uploadedResponse = await cloudinary.v2.uploader.upload(imgFile, {upload_preset: "profile-preset"});
            user["image"] = new Image({
                publicId: uploadedResponse.public_id,
                secureUrl: uploadedResponse.secure_url
            });
        }
        else {
            user["image"] = new Image();
        }
        user["password"] = await hashPassword(user["password"]);
        user["updatedAt"] = new Date();
        await this.storage.addItem(user);
    }


    async updateUser(id, old, user) {
        user["updatedAt"] = new Date();

        const imgFile  = user?.imgFile;
        if(imgFile !== undefined) {
            delete user.imgFile;
            if (imgFile === "delete") {
                await deleteImage(old.image.publicID);
                user["image"] = new Image();
            }
            else {
                await deleteImage(old.image.publicID);
                const uploadedResponse = await cloudinary.v2.uploader.upload(imgFile, {upload_preset: "profile-preset"});
                user["image"] = new Image({
                    publicId: uploadedResponse.public_id,
                    secureUrl: uploadedResponse.secure_url
                });
            }
        }
        if (user.hasOwnProperty("createdAt"))
            delete user.createdAt;

        await this.storage.updateItem({_id: id}, user);
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