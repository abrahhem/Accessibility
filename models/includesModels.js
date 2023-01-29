const { model, Schema } = require("mongoose");
const { cloudinary } = require("../data/cloudinary");

const pointSchema = new Schema( {
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const rateSchema = new Schema( {
    counts: {
        graded1:  { type: Number, default: 0 },
        graded2:  { type: Number, default: 0 },
        graded3:  { type: Number, default: 0 },
        graded4:  { type: Number, default: 0 },
        graded5:  { type: Number, default: 0 },
        graded6:  { type: Number, default: 0 },
        graded7:  { type: Number, default: 0 },
        graded8:  { type: Number, default: 0 },
        graded9:  { type: Number, default: 0 },
        graded10: { type: Number, default: 0 }
    }
});

const imageSchema = new Schema( {
    publicId: {
        type: String,
        default: "default"
    },
    secureUrl: {
        type: String,
        default: process.env.PROFILEURL
    }
});

const Image  = model("Image", imageSchema);
const Point  = model("Point", pointSchema);
const Rate  = model("Rate", rateSchema);


module.exports  = {
    Image,
    Point,
    Rate,
    imageSchema,
    pointSchema,
    rateSchema
};

