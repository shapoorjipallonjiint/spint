import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const communitySchema = new mongoose.Schema({
    metaTitle: { type: String, required: true },
    metaTitle_ar: { type: String },

    metaDescription: { type: String, required: true },
    metaDescription_ar: { type: String },

    pageTitle: { type: String, required: true },
    pageTitle_ar: { type: String },

    banner: { type: String, required: true },
    bannerAlt: { type: String, required: true },
    bannerAlt_ar: { type: String },

    firstSection: {
        title: { type: String, required: true },
        title_ar: { type: String },

        description: { type: String, required: true },
        description_ar: { type: String },

        items: {
            leftMost: [imageSchema],
            leftColTop: [imageSchema],
            leftColBottom: [imageSchema],

            leftOfCenter: [imageSchema],
            center: [imageSchema],
            rightOfCenter: [imageSchema],

            rightColTop: [imageSchema],
            rightColBottom: [imageSchema],
            rightMost: [imageSchema],
        },
    },
    secondSection: {
        title: { type: String, required: true },
        title_ar: { type: String },
        items: [
            {
                title: { type: String, required: true },
                title_ar: { type: String },
                description: { type: String, required: true },
                description_ar: { type: String },
                icon: { type: String, required: true },
                iconAlt: { type: String, required: true },
                iconAlt_ar: { type: String },
                image: { type: String, required: true },
                imageAlt: { type: String, required: true },
                imageAlt_ar: { type: String },
            },
        ],
    },
    thirdSection: {
        title: { type: String, required: true },
        title_ar: { type: String },
        items: [
            {
                title: { type: String, required: true },
                title_ar: { type: String },
                description: { type: String, required: true },
                description_ar: { type: String },
                image: { type: String, required: true },
                imageAlt: { type: String, required: true },
                imageAlt_ar: { type: String },
            },
        ],
    },
    fourthSection: {
        title: { type: String, required: true },
        title_ar: { type: String },
        items: [
            {
                title: { type: String, required: true },
                title_ar: { type: String },
                date: { type: String, required: true },
                image: { type: String, required: true },
                imageAlt: { type: String, required: true },
                imageAlt_ar: { type: String },
            },
        ],
    },
});

export default mongoose.models.Community || mongoose.model("Community", communitySchema);
