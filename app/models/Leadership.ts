import mongoose from "mongoose";

const leadershipSchema = new mongoose.Schema({
    metaTitle: {
        type: String,
        required: true,
    },
    metaTitle_ar: {
        type: String,
    },
    metaDescription: {
        type: String,
        required: true,
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
    firstSection: {
        name: {
            type: String,
            required: true,
        },
        name_ar: {
            type: String,
        },
        designation: {
            type: String,
            required: true,
        },
        designation_ar: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        description_ar: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
        imageAlt: {
            type: String,
            required: true,
        },
        imageAlt_ar: {
            type: String,
        },

        /* ---- Second Leader ---- */
        nameTwo: {
            type: String,
            required: true,
        },
        nameTwo_ar: {
            type: String,
        },
        designationTwo: {
            type: String,
            required: true,
        },
        designationTwo_ar: {
            type: String,
        },
        descriptionTwo: {
            type: String,
            required: true,
        },
        descriptionTwo_ar: {
            type: String,
        },

        imageTwo: {
            type: String,
            required: true,
        },
        imageTwoAlt: {
            type: String,
            required: true,
        },
        imageTwoAlt_ar: {
            type: String,
        },
    },
    secondSection: {
        title: {
            type: String,
            required: true,
        },
        title_ar: {
            type: String,
        },

        /* ---- Departments ---- */
        departments: [
            {
                _id: false,
                name: {
                    type: String,
                    required: true,
                },
                name_ar: {
                    type: String,
                },
            },
        ],

        /* ---- People ---- */
        items: [
            {
                image: {
                    type: String,
                    required: true,
                },
                imageAlt: {
                    type: String,
                    required: true,
                },
                imageAlt_ar: {
                    type: String,
                },

                name: {
                    type: String,
                    required: true,
                },
                name_ar: {
                    type: String,
                },

                designation: {
                    type: String,
                    required: true,
                },
                designation_ar: {
                    type: String,
                },

                department: {
                    type: String,
                    required: true,
                },

                socialLink: {
                    type: String,
                },
            },
        ],
    },
});

export default mongoose.models.Leadership || mongoose.model("Leadership", leadershipSchema);
