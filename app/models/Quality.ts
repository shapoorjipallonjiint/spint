import mongoose from "mongoose";

const qualitySchema = new mongoose.Schema({
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
        image: {
            type: String
        },
        imageAlt: {
            type: String
        },
        imageAlt_ar: {
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
        description: {
            type: String
        },
        description_ar: {
            type: String
        },
        items: [{
            fileName: {
                type: String,
                required: true
            },
            fileName_ar: {
                type: String,
            },
            fileImage: {
                type: String
            },
            fileImageAlt: {
                type: String,
                required: true
            },
            fileImageAlt_ar: {
                type: String,
                required: true
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
        itemsOne: [{
            key: {
                type: String,
            },
            key_ar: {
                type: String,
            },
            value: {
                type: String,
            },
            value_ar: {
                type: String,
            },
        }],
        itemsTwo: [{
            image: String,
            imageAlt: String,
            imageAlt_ar: String
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
        subTitle: {
            type: String,
        },
        subTitle_ar: {
            type: String,
        },
        items: [{
            title: String,
            title_ar: String,
            description: String,
            description_ar: String,
            image: String,
            imageAlt: String,
            imageAlt_ar: String
        }]
    },
    unifiedStandardSection: {
        items: [{
            logo: {
                type: String
            },
            title: {
                type: String
            },
            title_ar: {
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
    sixthSection: {
        image: {
            type: String
        },
        imageAlt: {
            type: String
        },
        imageAlt_ar: {
            type: String
        },
        title: {
            type: String
        },
        title_ar: {
            type: String
        },
        description: {
            type: String
        },
        description_ar: {
            type: String
        },
        subTitle: {
            type: String
        },
        subTitle_ar: {
            type: String
        }
    }

})

export default mongoose.models.Quality || mongoose.model("Quality", qualitySchema);