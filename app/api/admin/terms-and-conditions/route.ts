import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TermsAndConditions from "@/app/models/TermsAndConditions";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function GET() {
    try {
        await connectDB();
        const terms = await TermsAndConditions.findOne({});
        if (!terms) {
            return NextResponse.json({ message: "Terms and Conditions not found" }, { status: 404 });
        }
        return NextResponse.json({ data: terms, message: "Terms and Conditions fetched successfully" }, { status: 200 });
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
        // the admin form loads and sends back every field, so a full update keeps all content
        const terms = await TermsAndConditions.findOneAndUpdate({}, body, { upsert: true, new: true });
        return NextResponse.json({ data: terms, message: "Terms and Conditions updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
