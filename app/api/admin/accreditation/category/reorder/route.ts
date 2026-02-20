import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Accreditation from "@/app/models/Accreditation";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    const session = await mongoose.startSession();

    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        session.startTransaction();

        const { categories } = await request.json();

        const accreditationDoc = await Accreditation.findOne({}).session(session);

        if (!accreditationDoc) {
            return NextResponse.json(
                { message: "Accreditation document not found" },
                { status: 404 }
            );
        }

        // 🔥 Replace entire categories array
        accreditationDoc.categories = categories;

        await accreditationDoc.save({ session });
        await session.commitTransaction();

        return NextResponse.json(
            { message: "Categories reordered successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        session.endSession();
    }
}