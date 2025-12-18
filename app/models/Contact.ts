import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
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
        name: {
            type: String,
            required: true
        },
        name_ar: {
            type: String,
        },
        address: {
            type: String,
            required: true
        },
        address_ar: {
            type: String,
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
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
        items: [{
            name: {
                type: String,
                required: true
            },
            name_ar: {
                type: String,
            },
            address: {
                type: String,
                required: true
            },
            address_ar: {
                type: String,
            },
            phone: {
                type: String,
                required: true
            },
            fax: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            }
        }]
    }
})

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);