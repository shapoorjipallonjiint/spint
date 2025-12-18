import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/app/models/Contact";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET() {
    try {
        await connectDB();
        const contact = await Contact.findOne({});
        if (!contact) {
            return NextResponse.json({ message: "Contact not found" }, { status: 404 });
        }
        return NextResponse.json({data:contact,message:"Contact fetched successfully"}, { status: 200 });
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
        const contact = await Contact.findOneAndUpdate({}, body,{upsert:true,new:true});
        if (!contact) {
            return NextResponse.json({ message: "Contact not found" }, { status: 404 });
        }
        return NextResponse.json({data:contact,message:"Contact updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}