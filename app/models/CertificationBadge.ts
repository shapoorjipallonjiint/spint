import mongoose from "mongoose";

// Shared certification emblems (e.g. LEED Gold) managed in admin Projects > Certifications.
// A project picks one by id (Project.projects[].certificationBadgeId).
const certificationBadgeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        name_ar: { type: String },
        image: { type: String, required: true },
        alt: { type: String },
        alt_ar: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.CertificationBadge || mongoose.model("CertificationBadge", certificationBadgeSchema);
