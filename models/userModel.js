const { model, Schema } = require("mongoose");
const { imageSchema, Image } = require("./includesModels");
const {cloudinary} = require("../data/cloudinary");

const minAge = 13;

const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
const dateRegex  = new RegExp(/^[0-9]{1,2}(\/|\.)[0-9]{1,2}(\/|\.)[0-9]{4}$/);

const calculateAge = (DOB) => {
    const dob = new Date(DOB);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return age_dt.getUTCFullYear() - 1970;
}


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
    role: {
        type: String,
        enum: ["user","admin"],
        default: "user"
    },
    image: {
        type: imageSchema
    },
    updatedAt: Date,
    createdAt: {
        type: Date,
        default: new Date()
    }
}, { collection: 'Users', versionKey: false });

userSchema.
    path("email")
    .validate(email => emailRegex.test(email), "The email format is incorrect");

userSchema.
    path("birthDate")
    .validate(birthDate => dateRegex.test(birthDate), "The date of birth is format is incorrect");

userSchema.
path("birthDate")
    .validate(birthDate => calculateAge(birthDate) >= minAge, "You must be at least 13 years old to register");

const User =  model("User", userSchema);

module.exports  = User;