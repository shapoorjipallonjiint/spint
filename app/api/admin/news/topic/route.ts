import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Topic from "@/app/models/Topic";

export async function GET() {
    try {
        await connectDB();
        const topic = await Topic.find({});
        if (!topic) {
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
        }
        return NextResponse.json({data:topic,message:"Topic fetched successfully"}, { status: 200 });
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
        const topic = await Topic.create({name,name_ar});
        if (!topic) {
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
        }
        return NextResponse.json({data:topic,message:"Topic created successfully"}, { status: 200 });
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
        const topic = await Topic.findByIdAndUpdate(id,{name,name_ar},{upsert:true,new:true});
        if (!topic) {
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
        }
        return NextResponse.json({data:topic,message:"Topic updated successfully"}, { status: 200 });
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
        const topic = await Topic.findByIdAndDelete(id);
        if (!topic) {
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
        }
        return NextResponse.json({data:topic,message:"Topic deleted successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
