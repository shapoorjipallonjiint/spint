import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Project from "@/app/models/Project";
import type { Types } from "mongoose";

type ProjectsLean = { _id: Types.ObjectId; __v?: number; projects?: { _id: Types.ObjectId }[] };

// Global project order: rewrites only the order of the `projects` array, project contents are copied as stored.
// - No full-document save: that re-validated every project, so one older project missing a now-required field
//   made every reorder fail. The array is written with the native driver, exactly as it was read.
// - No transaction: a single-document update is already atomic, and transactions fail on non-replica-set databases.
// - Optimistic check on __v: if the projects changed since they were read (another admin saved), nothing is written.
export async function POST(req: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        let orderedIds: string[] = [];
        try {
            const parsed = JSON.parse(String(formData.get("projects") ?? "[]"));
            orderedIds = Array.isArray(parsed) ? parsed.map(String) : [];
        } catch {
            return NextResponse.json({ message: "Invalid project order" }, { status: 400 });
        }

        await connectDB();

        const doc = await Project.findOne({}, { projects: 1, __v: 1 }).lean<ProjectsLean>();
        if (!doc) {
            return NextResponse.json({ message: "Project document not found" }, { status: 404 });
        }

        const current = doc.projects || [];
        const byId = new Map(current.map((p) => [p._id.toString(), p]));

        const reordered = [...new Set(orderedIds)].map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);

        // never drop a project: any the admin's list didn't include (e.g. added after the page loaded) stays, at the end
        const sentIds = new Set(reordered.map((p) => p._id.toString()));
        const missing = current.filter((p) => !sentIds.has(p._id.toString()));

        // native driver: the projects are written back exactly as read (no Mongoose casting / validation of legacy data)
        const result = await Project.collection.updateOne(
            doc.__v === undefined ? { _id: doc._id, __v: { $exists: false } } : { _id: doc._id, __v: doc.__v },
            { $set: { projects: [...reordered, ...missing] }, $inc: { __v: 1 } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Projects were changed by someone else - reload the page and reorder again" },
                { status: 409 }
            );
        }

        return NextResponse.json({ success: true, message: "Projects reordered successfully" }, { status: 200 });
    } catch (err) {
        console.error("Project reorder failed:", err);
        return NextResponse.json(
            { message: err instanceof Error ? `Reorder failed: ${err.message}` : "Internal Server Error" },
            { status: 500 }
        );
    }
}
