import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Home from "../../../models/Home";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const home = await Home.findOne({});
        if (!home) {
            return NextResponse.json({ message: "Home not found" }, { status: 404 });
        }
        return NextResponse.json({ data: home, message: "Home fetched successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
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
        const home = await Home.findOneAndUpdate({}, body, { upsert: true, new: true });
        if (!home) {
            return NextResponse.json({ message: "Home not found" }, { status: 404 });
        }
        return NextResponse.json({ data: home, message: "Home updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}