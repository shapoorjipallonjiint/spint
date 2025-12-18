import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quality from "@/app/models/Quality";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const quality = await Quality.findOne({});
        if (!quality) {
            return NextResponse.json({ message: "Quality not found" }, { status: 404 });
        }
        return NextResponse.json({data:quality,message:"Quality fetched successfully"}, { status: 200 });
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
        const quality = await Quality.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!quality) {
            return NextResponse.json({ message: "Quality not found" }, { status: 404 });
        }
        return NextResponse.json({data:quality,message:"Quality updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}