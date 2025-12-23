import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
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
        button: {
            text: { type: String, required: true },
            text_ar: { type: String },
            link: { type: String },
            link_ar: { type: String }
        },
        items: [{
            image: { type: String }
        }]
    },
    secondSection: {
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
        items: [{
            key: { type: String, required: true },
            key_ar: { type: String },
            value: { type: String, required: true },
            value_ar: { type: String },
        }]
    },
    thirdSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        items: [{
            title: { type: String, required: true },
            title_ar: { type: String },
            image: { type: String, required: true },
            imageAlt: { type: String, required: true },
            imageAlt_ar: { type: String },
        }],
    },
    fourthSection: {
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
        image: {
            type: String,
            required: true
        },
        imageAlt: {
            type: String,
        },
        imageAlt_ar: {
            type: String,
        }
    },
    fifthSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        items: [{
            name: { type: String, required: true },
            name_ar: { type: String },
            designation: { type: String, required: true },
            designation_ar: { type: String },
            video: { type: String },
            videoAlt: { type: String },
            videoAlt_ar: { type: String },
            videoPosterImage: { type: String, required: true },
            videoPosterImageAlt: { type: String },
            videoPosterImageAlt_ar: { type: String },
        }]
    },
    sixthSection: {
        title: { type: String, required: true },
        title_ar: { type: String },
        description: { type: String, required: true },
        description_ar: { type: String },
        image: { type: String, required: true },
        imageAlt: { type: String, required: true },
        imageAlt_ar: { type: String },
        button: {
            text: { type: String, required: true },
            text_ar: { type: String },
            btnLink: { type: String, required: true },
            btnLink_ar: { type: String, required: true },
        }
    }
})

export default mongoose.models.Career || mongoose.model("Career", careerSchema);