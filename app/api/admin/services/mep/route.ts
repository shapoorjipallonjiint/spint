import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Mep from "@/app/models/Mep";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const mep = await Mep.findOne({});
        if (!mep) {
            return NextResponse.json({ message: "Mep not found" }, { status: 404 });
        }
        return NextResponse.json({data:mep,message:"Mep fetched successfully"}, { status: 200 });
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
        const mep = await Mep.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!mep) {
            return NextResponse.json({ message: "Mep not found" }, { status: 404 });
        }
        return NextResponse.json({data:mep,message:"Mep updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}