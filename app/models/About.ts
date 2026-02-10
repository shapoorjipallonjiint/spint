import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
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
        items: [{
            number: {
                type: String,
            },
            number_ar: {
                type: String,
            },
            value: {
                type: String,
            },
            value_ar: {
                type: String,
            },
        }]
    },
    secondSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
            required: true
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
        items: [{
            letter: {
                type: String
            },
            letter_ar: {
                type: String
            },
            title: {
                type: String
            },
            title_ar: {
                type: String
            },
            subTitle: {
                type: String
            },
            subTitle_ar: {
                type: String
            },
            description: {
                type: String
            },
            description_ar: {
                type: String
            }
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
            title: {
                type: String,
            },
            title_ar: {
                type: String,
            },
            description: {
                type: String,
            },
            description_ar: {
                type: String,
            }
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
        items: [{
            year: {
                type: String,
            },
            year_ar: {
                type: String,
            },
            description: {
                type: String,
            },
            description_ar: {
                type: String,
            },
            images: []
        }],
    },
    fifthSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String
        },
        buttonText: {
            type: String,
            required: true
        },
        buttonText_ar: {
            type: String,
        },
        buttonLink: {
            type: String,
            required: true
        },
        buttonLink_ar: {
            type: String,
        }
    }
})

export default mongoose.models.About || mongoose.model("About", aboutSchema);