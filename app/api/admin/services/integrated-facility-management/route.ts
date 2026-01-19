import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import IntegratedFacilityManagement from "@/app/models/IntegratedFacilityManagement";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const integratedFacilityManagement = await IntegratedFacilityManagement.findOne({});
        if (!integratedFacilityManagement) {
            return NextResponse.json({ message: "Integrated Facility Management not found" }, { status: 404 });
        }
        return NextResponse.json({data:integratedFacilityManagement,message:"Façade fetched successfully"}, { status: 200 });
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
        const integratedFacilityManagement = await IntegratedFacilityManagement.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!integratedFacilityManagement) {
            return NextResponse.json({ message: "Integrated Facility Management not found" }, { status: 404 });
        }
        return NextResponse.json({data:integratedFacilityManagement,message:"Integrated Facility Management updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}