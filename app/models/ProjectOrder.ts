import mongoose from "mongoose";

// Custom project order for one country ("AE", "SA", ...) or for all of Africa ("AFRICA").
// Holds only project ids; projects of that country without an entry follow in the global order.
const projectOrderSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true },
        projectIds: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.models.ProjectOrder || mongoose.model("ProjectOrder", projectOrderSchema);
