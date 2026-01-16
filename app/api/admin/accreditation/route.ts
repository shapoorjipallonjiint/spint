import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Accreditation from "@/app/models/Accreditation";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const accreditation = await Accreditation.findOne({});
        if (!accreditation) {
            return NextResponse.json({ message: "Accreditation not found" }, { status: 404 });
        }
        return NextResponse.json({data:accreditation,message:"Accreditation fetched successfully"}, { status: 200 });
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
        const accreditation = await Accreditation.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!accreditation) {
            return NextResponse.json({ message: "Accreditation not found" }, { status: 404 });
        }
        return NextResponse.json({data:accreditation,message:"Accreditation updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}