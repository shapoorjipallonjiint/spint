import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/app/models/Community";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const community = await Community.findOne({});
        if (!community) {
            return NextResponse.json({ message: "Community not found" }, { status: 404 });
        }
        return NextResponse.json({ data: community, message: "Community fetched successfully" }, { status: 200 });
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
        const community = await Community.findOneAndUpdate({}, body, { upsert: true, new: true });
        if (!community) {
            return NextResponse.json({ message: "Community not found" }, { status: 404 });
        }
        return NextResponse.json({ data: community, message: "Community updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}