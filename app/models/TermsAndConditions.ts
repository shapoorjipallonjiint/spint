import mongoose from "mongoose";

// Single document holding the Terms and Conditions page (banner + rich-text content from the admin TinyMCE editor)
const termsAndConditionsSchema = new mongoose.Schema(
    {
        metaTitle: { type: String },
        metaTitle_ar: { type: String },
        metaDescription: { type: String },
        metaDescription_ar: { type: String },

        banner: { type: String },
        bannerAlt: { type: String },
        bannerAlt_ar: { type: String },

        pageTitle: { type: String },
        pageTitle_ar: { type: String },

        // HTML from the TinyMCE editor
        content: { type: String },
        content_ar: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.TermsAndConditions ||
    mongoose.model("TermsAndConditions", termsAndConditionsSchema);
