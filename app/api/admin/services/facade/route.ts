import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Facade from "@/app/models/Facade";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const facade = await Facade.findOne({});
        if (!facade) {
            return NextResponse.json({ message: "Facade not found" }, { status: 404 });
        }
        return NextResponse.json({data:facade,message:"Facade fetched successfully"}, { status: 200 });
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
        const facade = await Facade.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!facade) {
            return NextResponse.json({ message: "Facade not found" }, { status: 404 });
        }
        return NextResponse.json({data:facade,message:"Facade updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}