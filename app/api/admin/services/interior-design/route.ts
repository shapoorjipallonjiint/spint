import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import InteriorDesign from "@/app/models/InteriorDesign";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const interiorDesign = await InteriorDesign.findOne({});
        if (!interiorDesign) {
            return NextResponse.json({ message: "InteriorDesign not found" }, { status: 404 });
        }
        return NextResponse.json({data:interiorDesign,message:"InteriorDesign fetched successfully"}, { status: 200 });
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
        const interiorDesign = await InteriorDesign.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!interiorDesign) {
            return NextResponse.json({ message: "InteriorDesign not found" }, { status: 404 });
        }
        return NextResponse.json({data:interiorDesign,message:"InteriorDesign updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}