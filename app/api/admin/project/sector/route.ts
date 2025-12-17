import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Sector from "@/app/models/Sector";

export async function GET() {
    try {
        await connectDB();
        const sector = await Sector.find({});
        if (!sector) {
            return NextResponse.json({ message: "Sector not found" }, { status: 404 });
        }
        return NextResponse.json({data:sector,message:"Sector fetched successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const {name,name_ar} = await request.json();
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const sector = await Sector.create({name,name_ar});
        if (!sector) {
            return NextResponse.json({ message: "Sector not found" }, { status: 404 });
        }
        return NextResponse.json({data:sector,message:"Sector created successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const {name,name_ar} = await request.json();
        const id = request.nextUrl.searchParams.get("id");
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const sector = await Sector.findByIdAndUpdate(id,{name,name_ar},{upsert:true,new:true});
        if (!sector) {
            return NextResponse.json({ message: "Sector not found" }, { status: 404 });
        }
        return NextResponse.json({data:sector,message:"Sector updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const sector = await Sector.findByIdAndDelete(id);
        if (!sector) {
            return NextResponse.json({ message: "Sector not found" }, { status: 404 });
        }
        return NextResponse.json({data:sector,message:"Sector deleted successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
