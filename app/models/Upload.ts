import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: "misc",
        },
        status: {
            type: String,
            enum: ["unused", "used"],
            default: "unused",
        },
        path: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Upload || mongoose.model("Upload", UploadSchema);