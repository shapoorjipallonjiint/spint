import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
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
    firstSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        subTitle: {
            text: { type: String },
            text_ar: { type: String },
            link: { type: String }
        },
        video: {
            type: String,
            required: true
        },
        videoAlt: {
            type: String,
            required: true
        },
        videoAlt_ar: {
            type: String,
            required: true
        },
        videoPosterImage: {
            type: String
        },
        videoPosterImageAlt: {
            type: String
        },
        videoPosterImageAlt_ar: {
            type: String
        }
    },
    secondSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        subTitle: {
            type: String,
        },
        subTitle_ar: {
            type: String,
        },
        description: {
            type: String,
        },
        description_ar: {
            type: String,
        },
        image: {
            type: String
        },
        imageAlt: {
            type: String
        },
        imageAlt_ar: {
            type: String
        },
        video: {
            type: String
        },
        videoAlt: {
            type: String
        },
        videoAlt_ar: {
            type: String
        },
        items: [{
            key: { type: String },
            key_ar: { type: String },
            value: { type: String },
            value_ar: { type: String }
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
        description: {
            type: String,
            required: true
        },
        description_ar: {
            type: String,
        },
        link: {
            type: String
        },
        image: {
            type: String,
            required: true
        },
        imageAlt: {
            type: String,
            required: true
        },
        imageAlt_ar: {
            type: String
        },
        items: [{
            key: { type: String },
            key_ar: { type: String },
            value: { type: String },
            value_ar: { type: String }
        }]
    },
    fourthSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
    },
    fifthSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
    },
    sixthSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        cities: [{
            id: { type: String },
            name: { type: String },
            name_ar: { type: String },
            left: { type: String },
            top: { type: String },
            iconicProjects: { type: String },
            completedProjects: { type: String },
            dedicatedEmployees: { type: String }
        }]
    },

    seventhSection: {
        title: { type: String },
        title_ar: { type: String },
        image: {
            type: String
        },
        imageAlt: {
            type: String
        },
        imageAlt_ar: {
            type: String
        },
        items: [{
            title: { type: String },
            title_ar: { type: String },
            description: { type: String },
            description_ar: { type: String }
        }]
    }

})

export default mongoose.models.Home || mongoose.model("HomePresence", homeSchema);