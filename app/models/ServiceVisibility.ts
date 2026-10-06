import mongoose from "mongoose";

// Single document with the website settings of the services (admin Services > Main): which are hidden and their order.
// Kept separate on purpose: hiding/showing or reordering a service never writes to the service documents themselves.
const serviceVisibilitySchema = new mongoose.Schema(
    {
        // service slugs, see lib/serviceRegistry.ts (e.g. "mep", "water")
        hiddenServices: { type: [String], default: [] },
        // display order of the services on the website (service slugs); empty = never reordered, lists keep their own order
        serviceOrder: { type: [String], default: [] },
    },
    { timestamps: true }
);

export default mongoose.models.ServiceVisibility || mongoose.model("ServiceVisibility", serviceVisibilitySchema);
