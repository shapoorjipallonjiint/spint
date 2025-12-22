import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GlobalPresence from "@/app/models/GlobalPresence";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const globalPresence = await GlobalPresence.findOne({});
        if (!globalPresence) {
            return NextResponse.json({ message: "Global Presence not found" }, { status: 404 });
        }
        return NextResponse.json({ data: globalPresence, message: "Global Presence fetched successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const globalPresence = await GlobalPresence.findOneAndUpdate({}, body, { upsert: true, new: true });
        if (!globalPresence) {
            return NextResponse.json({ message: "Global Presence not found" }, { status: 404 });
        }
        return NextResponse.json({ data: globalPresence, message: "Global Presence updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}