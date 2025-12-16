import mongoose from "mongoose";

const sustainabilitySchema = new mongoose.Schema({
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
        },
        videoPosterImage: {
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
        image: {
            type: String,
            required: true
        },
        imageAlt: {
            type: String,
        },
        imageAlt_ar: {
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
            },
            icon: {
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
            },
            image: {
                type: String
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
            description: {
                type: String,
            },
            description_ar: {
                type: String,
            },
            icon: {
                type: String
            },
            iconAlt: {
                type: String
            },
            iconAlt_ar: {
                type: String
            }
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

export default mongoose.models.Sustainability || mongoose.model("Sustainability", sustainabilitySchema);