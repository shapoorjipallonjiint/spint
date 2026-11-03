import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Gallery from "@/app/models/Gallery";
import { verifyAdmin } from "@/lib/verifyAdmin";

/**
 * Show / hide a gallery section or an album on the public Gallery page.
 *
 * Body:
 *   { galleryId: string, hidden: boolean }                      -> section
 *   { galleryId: string, categoryId: string, hidden: boolean }  -> album inside that section
 *
 * Only the single `isHidden` flag is written (targeted $set), so titles, albums,
 * photos and ordering are never touched. Hiding is fully reversible.
 */
export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { galleryId, categoryId, hidden } = await request.json();

        const isValidId = (v: unknown): v is string => typeof v === "string" && mongoose.Types.ObjectId.isValid(v);
        if (!isValidId(galleryId) || (categoryId !== undefined && !isValidId(categoryId)) || typeof hidden !== "boolean") {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        await connectDB();

        const g = new mongoose.Types.ObjectId(galleryId);
        let result;

        if (categoryId) {
            const c = new mongoose.Types.ObjectId(categoryId);
            result = await Gallery.collection.updateOne(
                { gallery: { $elemMatch: { _id: g, "categories._id": c } } },
                { $set: { "gallery.$[g].categories.$[c].isHidden": hidden } },
                { arrayFilters: [{ "g._id": g }, { "c._id": c }] }
            );
        } else {
            result = await Gallery.collection.updateOne(
                { "gallery._id": g },
                { $set: { "gallery.$[g].isHidden": hidden } },
                { arrayFilters: [{ "g._id": g }] }
            );
        }

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: categoryId ? "Album not found" : "Section not found" },
                { status: 404 }
            );
        }

        const what = categoryId ? "Album" : "Section";
        return NextResponse.json(
            { message: hidden ? `${what} hidden from the website` : `${what} is now visible on the website` },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
