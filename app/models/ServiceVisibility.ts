import mongoose from "mongoose";

// Single document listing the services hidden from the website (admin Services > Main).
// Kept separate on purpose: hiding/showing a service never writes to the service documents themselves.
const serviceVisibilitySchema = new mongoose.Schema(
    {
        // service slugs, see lib/serviceRegistry.ts (e.g. "mep", "water")
        hiddenServices: { type: [String], default: [] },
    },
    { timestamps: true }
);

export default mongoose.models.ServiceVisibility || mongoose.model("ServiceVisibility", serviceVisibilitySchema);
