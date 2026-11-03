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
    // Custom order of albums (category _ids) for the "All" tab on the public Gallery page.
    // Albums not listed here are appended in their default (section) order.
    allOrder: [{ type: String }],
    gallery: [{
        title: { type: String },
        title_ar: { type: String },
        // Hidden sections are kept with all their albums but not shown on the public page.
        isHidden: { type: Boolean, default: false },
        categories: [{
            title: { type: String },
            title_ar: { type: String },
            images: [{ type: String }],
            // Hidden albums are kept with all their photos but not shown on the public page.
            isHidden: { type: Boolean, default: false },
            type: { type: String, default: "Gallery" }
        }]
    }]
})

export default mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);