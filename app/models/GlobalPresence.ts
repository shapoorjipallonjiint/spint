import mongoose from "mongoose";

const globalPresenceSchema = new mongoose.Schema({
    metaTitle: {
        type: String,
        required: true
    },
    metaTitle_ar: {
        type: String,
    },
    metaDescription: {
        type: String,
        required: true
    },
    metaDescription_ar: {
        type: String,
    },
    banner: {
        type: String,
        required: true
    },
    bannerAlt: {
        type: String,
    },
    bannerAlt_ar: {
        type: String,
    },
    pageTitle: {
        type: String,
        required: true
    },
    pageTitle_ar: {
        type: String,
    },
    firstSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        description: {
            type: String,
            required: true
        },
        description_ar: {
            type: String,
        },
    },
    secondSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        items: [{
            name: { type: String },
            name_ar: { type: String },
            image: { type: String, required: true },
            imageAlt: { type: String, required: true },
            imageAlt_ar: { type: String, required: true },
            projects: { type: String, required: true },
            projects_ar: { type: String, required: true },
            country: { type: String, required: true },
            country_ar: { type: String, required: true },
            countries: [{ name: { type: String }, name_ar: { type: String } }],
            link: { type: String }
        }]
    },
})

export default mongoose.models.GlobalPresence || mongoose.model("GlobalPresence", globalPresenceSchema);