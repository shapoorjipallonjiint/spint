import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DesignStudio from "@/app/models/DesignStudio";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const designStudio = await DesignStudio.findOne({});
        if (!designStudio) {
            return NextResponse.json({ message: "DesignStudio not found" }, { status: 404 });
        }
        return NextResponse.json({data:designStudio,message:"DesignStudio fetched successfully"}, { status: 200 });
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
        const designStudio = await DesignStudio.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!designStudio) {
            return NextResponse.json({ message: "DesignStudio not found" }, { status: 404 });
        }
        return NextResponse.json({data:designStudio,message:"DesignStudio updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}