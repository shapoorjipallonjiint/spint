import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Project from "@/app/models/Project";

// show / hide one project on the website: { id, isHidden }
// sets only that project's isHidden field; nothing else in the project (or any other project) is written
export async function PATCH(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const id = typeof body?.id === "string" ? body.id : "";
        if (!mongoose.Types.ObjectId.isValid(id) || typeof body?.isHidden !== "boolean") {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        await connectDB();
        const result = await Project.updateOne(
            { "projects._id": id },
            { $set: { "projects.$.isHidden": body.isHidden } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                data: { id, isHidden: body.isHidden },
                message: body.isHidden ? "Project hidden from website" : "Project shown on website",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
