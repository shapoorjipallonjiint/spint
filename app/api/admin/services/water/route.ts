import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Water from "@/app/models/Water";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const water = await Water.findOne({});
        if (!water) {
            return NextResponse.json({ message: "Water not found" }, { status: 404 });
        }
        return NextResponse.json({data:water,message:"Water fetched successfully"}, { status: 200 });
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
        const water = await Water.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!water) {
            return NextResponse.json({ message: "Water not found" }, { status: 404 });
        }
        return NextResponse.json({data:water,message:"Water updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}