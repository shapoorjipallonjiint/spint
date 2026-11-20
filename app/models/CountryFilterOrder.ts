import mongoose from "mongoose";

// Single document: the order of the countries in the /projects country filter, set in admin Projects > Project List >
// Country Filter (the client orders them by project volume / cost). Items are country slugs (slugify(name) of the map
// locations with "show in project filter"). Empty = never set: the filter keeps its default order (most projects first).
const countryFilterOrderSchema = new mongoose.Schema(
    {
        order: { type: [String], default: [] },
    },
    { timestamps: true }
);

export default mongoose.models.CountryFilterOrder || mongoose.model("CountryFilterOrder", countryFilterOrderSchema);
