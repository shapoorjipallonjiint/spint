import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    metaTitle: {
        type: String,
    },
    metaTitle_ar: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    metaDescription_ar: {
        type: String,
    },
    pageTitle: { type: String },
    pageTitle_ar: { type: String },
    gallery: [{
        title: { type: String },
        title_ar: { type: String },
        categories: [{
            title: { type: String },
            title_ar: { type: String },
            images: [{ type: String }],
            type: { type: String, default: "Gallery" }
        }]
    }]
})

export default mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);