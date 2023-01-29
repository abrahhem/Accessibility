const { model, Schema } = require("mongoose");
const { imageSchema, pointSchema, rateSchema } = require("./includesModels");

const reportSchema = new Schema( {
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: pointSchema,
        required: true
    },
    images: [imageSchema],
    severityScale : {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    rates: {
        type: rateSchema,
    },
    status : {
        type: String,
        enum: ["active", "closed"],
        default: "active"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },

    updatedAt: {
        type: Date,
        default: new Date()
    }

}, { collection: "Reports", versionKey: false });

reportSchema.
path("images")
    .validate(images => images.length <= 4, "A report cannot contain more than 4 images.");

const Report  = model("Report", reportSchema);

module.exports  = Report ;

