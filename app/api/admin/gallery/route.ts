import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/app/models/Gallery";
import { verifyAdmin } from "@/lib/verifyAdmin";


export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const gallery = await Gallery.findOne({});
        if (!gallery) {
            return NextResponse.json({ message: "Gallery not found" }, { status: 404 });
        }
        const id = request.nextUrl.searchParams.get("id");
        const slug = request.nextUrl.searchParams.get("slug");
        if(id){
            const toUpdateGallery = gallery.gallery.find((item: { _id: string; })=>item._id.toString() === id);
            if (!toUpdateGallery) {
                return NextResponse.json({message:"Gallery not found"}, { status: 404 });
            }
            return NextResponse.json({data:toUpdateGallery,message:"Gallery fetched successfully"}, { status: 200 });
        }else if (slug){
            const toUpdateGallery = gallery.gallery.find((item: { slug: string; })=>item.slug === slug);
            if (!toUpdateGallery) {
                return NextResponse.json({message:"Gallery not found"}, { status: 404 });
            }
            return NextResponse.json({data:toUpdateGallery,message:"Gallery fetched successfully"}, { status: 200 });
        }
        return NextResponse.json({data:gallery,message:"Gallery fetched successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const id = request.nextUrl.searchParams.get("id");
        const gallery = await Gallery.findOne({})
        if (!gallery) {
            return NextResponse.json({message:"Gallery not found"}, { status: 404 });
        }
        if(id){
            const toUpdateGallery = gallery.gallery.find((item: { _id: string; })=>item._id.toString() === id);
            if (!toUpdateGallery) {
                return NextResponse.json({message:"Gallery not found"}, { status: 404 });
            }
            toUpdateGallery.images = body.images;
            await gallery.save();
            return NextResponse.json({message:"Gallery item updated successfully"}, { status: 200 });
        }else{
            gallery.gallery.push({title:body.name,title_ar:body.name_ar})
            await gallery.save();
            return NextResponse.json({message:"Gallery updated successfully"}, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const id = request.nextUrl.searchParams.get("id");
        await connectDB();
        const gallery = await Gallery.findOne({})
        if (!gallery) {
            return NextResponse.json({message:"Gallery not found"}, { status: 404 });
        }
        const toUpdateGallery = gallery.gallery.find((item: { _id: string; })=>item._id.toString() === id);
        if (!toUpdateGallery) {
            return NextResponse.json({message:"Gallery not found"}, { status: 404 });
        }
        toUpdateGallery.title = body.name;
        toUpdateGallery.title_ar = body.name_ar;
        await gallery.save();
        return NextResponse.json({message:"Gallery item updated successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const id = request.nextUrl.searchParams.get("id");
        await connectDB();
        const gallery = await Gallery.findOne({})
        if (!gallery) {
            return NextResponse.json({message:"Gallery not found"}, { status: 404 });
        }
        const toUpdateGallery = gallery.gallery.find((item: { _id: string; })=>item._id.toString() === id);
        if (!toUpdateGallery) {
            return NextResponse.json({message:"Gallery not found"}, { status: 404 });
        }
        gallery.gallery = gallery.gallery.filter((item: { _id: string; })=>item._id.toString() !== id);
        await gallery.save();
        return NextResponse.json({message:"Gallery item deleted successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

