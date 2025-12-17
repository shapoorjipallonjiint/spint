import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Country from "@/app/models/Country";

export async function GET() {
    try {
        await connectDB();
        const country = await Country.find({});
        if (!country) {
            return NextResponse.json({ message: "Country not found" }, { status: 404 });
        }
        return NextResponse.json({data:country,message:"Country fetched successfully"}, { status: 200 });
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
        const country = await Country.create({name,name_ar});
        if (!country) {
            return NextResponse.json({ message: "Country not found" }, { status: 404 });
        }
        return NextResponse.json({data:country,message:"Country created successfully"}, { status: 200 });
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
        const country = await Country.findByIdAndUpdate(id,{name,name_ar},{upsert:true,new:true});
        if (!country) {
            return NextResponse.json({ message: "Country not found" }, { status: 404 });
        }
        return NextResponse.json({data:country,message:"Country updated successfully"}, { status: 200 });
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
        const country = await Country.findByIdAndDelete(id);
        if (!country) {
            return NextResponse.json({ message: "Country not found" }, { status: 404 });
        }
        return NextResponse.json({data:country,message:"Country deleted successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
