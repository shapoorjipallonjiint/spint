import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
    {
        label: { type: String },
        label_ar: { type: String },
        href: { type: String },
    },
    { _id: false }
);

// Single document holding the website header (admin Header page)
const headerSchema = new mongoose.Schema(
    {
        // top-level menu items, in display order; items with submenu links open a dropdown
        menu: [
            {
                _id: false,
                title: { type: String },
                title_ar: { type: String },
                href: { type: String },
                submenu: [linkSchema],
            },
        ],

        // "Employee Login" button
        portal: {
            label: { type: String },
            label_ar: { type: String },
            href: { type: String },
            hidden: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

export default mongoose.models.Header || mongoose.model("Header", headerSchema);
