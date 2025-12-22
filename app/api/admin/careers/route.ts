import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Career from "../../../models/Career";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const career = await Career.findOne({});
        if (!career) {
            return NextResponse.json({ message: "Career not found" }, { status: 404 });
        }
        return NextResponse.json({ data: career, message: "Career fetched successfully" }, { status: 200 });
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
        const career = await Career.findOneAndUpdate({}, body, { upsert: true, new: true });
        if (!career) {
            return NextResponse.json({ message: "Career not found" }, { status: 404 });
        }
        return NextResponse.json({ data: career, message: "Career updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}