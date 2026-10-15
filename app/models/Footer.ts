import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
    {
        label: { type: String },
        label_ar: { type: String },
        href: { type: String },
    },
    { _id: false }
);

// Single document holding the website footer (admin Footer page)
const footerSchema = new mongoose.Schema(
    {
        logo: { type: String },
        logoAlt: { type: String },
        logoAlt_ar: { type: String },

        address: { type: String },
        address_ar: { type: String },
        phone: { type: String },
        email: { type: String },

        // uploaded icon + profile link, in display order
        socials: [
            {
                _id: false,
                name: { type: String },
                icon: { type: String },
                href: { type: String },
                // kept in admin, not shown on the website
                hidden: { type: Boolean, default: false },
            },
        ],

        // link columns, in display order
        columns: [
            {
                _id: false,
                title: { type: String },
                title_ar: { type: String },
                links: [linkSchema],
            },
        ],

        copyright: { type: String },
        copyright_ar: { type: String },
        bottomLinks: [linkSchema],
    },
    { timestamps: true }
);

export default mongoose.models.Footer || mongoose.model("Footer", footerSchema);
