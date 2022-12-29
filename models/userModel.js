const { model, Schema } = require("mongoose");

const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
const dateRegex  = new RegExp(/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/);

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthDate: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male","female"]
    },
    imgUrl: {
        type: String,
        default: process.env.PROFILEURL
    },
    updatedAt: String,
    createdAt: String
}, { collection: 'Users', versionKey: false });

userSchema.
    path("email")
    .validate(email => emailRegex.test(email), "The email format is incorrect");

userSchema.
    path("birthDate")
    .validate(birthDate => dateRegex.test(birthDate), "The date of birth is format is incorrect");


module.exports  = model("User", userSchema);