import mongoose from "mongoose";

const accreditationSchema = new mongoose.Schema({
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
    pageTitle: {
        type: String,
        required: true,
    },
    pageTitle_ar: {
        type: String,
    },
    pageSubTitle: {
        type: String,
        required: true,
    },
    pageSubTitle_ar: {
        type: String,
    },
    pageDescription: {
        type: String,
        required: true,
    },
    pageDescription_ar: {
        type: String,
    },
    secondSection: {
        items: [
            {
                fileName: {
                    type: String
                },
                fileName_ar: {
                    type: String
                },
                fileImage: {
                    type: String
                },
                fileImageAlt: {
                    type: String
                },
                fileImageAlt_ar: {
                    type: String
                },
            },
        ],
    },
    categories: [
        {
            name: {
                type: String,
                required: true
            },
            name_ar: {
                type: String,
            },
            accreditations: [
                {
                    title: {
                        type: String
                    },
                    title_ar: {
                        type: String
                    },
                    fileImage: {
                        type: String
                    },
                    fileImageAlt: {
                        type: String
                    },
                    fileImageAlt_ar: {
                        type: String
                    },
                    file: {
                        type: String
                    },
                    category: {
                        type: String
                    }
                }
            ]
        }
    ]
});

export default mongoose.models.Accreditation || mongoose.model("Accreditation", accreditationSchema);
