import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Engineering from "@/app/models/Engineering";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const engineering = await Engineering.findOne({});
        if (!engineering) {
            return NextResponse.json({ message: "Engineering not found" }, { status: 404 });
        }
        return NextResponse.json({data:engineering, message:"Engineering fetched successfully"}, { status: 200 });
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
        const engineering = await Engineering.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!engineering) {
            return NextResponse.json({ message: "Engineering not found" }, { status: 404 });
        }
        return NextResponse.json({data:engineering,message:"Engineering updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}