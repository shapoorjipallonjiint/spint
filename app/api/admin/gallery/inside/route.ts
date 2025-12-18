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
        const gallerId = request.nextUrl.searchParams.get("galleryId");
        if(gallerId){
            const toUpdateGallery = gallery.gallery.find((item: { _id: string; })=>item._id.toString() === gallerId);
            if (!toUpdateGallery) {
                return NextResponse.json({message:"Gallery not found"}, { status: 404 });
            }
            const categoryId = request.nextUrl.searchParams.get("categoryId");
            if(categoryId){
                const toUpdateCategory = toUpdateGallery.categories.find((item: { _id: string; })=>item._id.toString() === categoryId);
                if (!toUpdateCategory) {
                    return NextResponse.json({message:"Category not found"}, { status: 404 });
                }
                return NextResponse.json({data:toUpdateCategory,message:"Category fetched successfully"}, { status: 200 });
            }
            return NextResponse.json({message:"Gallery fetching failed"}, { status: 400 });
        }
        return NextResponse.json({message:"Gallery fetching failed"}, { status: 400 });
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
        const galleryId = request.nextUrl.searchParams.get("galleryId");
        const categoryId = request.nextUrl.searchParams.get("categoryId");
        console.log(galleryId,categoryId);
        const gallery = await Gallery.findOne({})
        if (!gallery) {
            return NextResponse.json({message:"Gallery not found"}, { status: 404 });
        }
        if(galleryId){
            const toUpdateGallery = gallery.gallery.find((item: { _id: string; })=>item._id.toString() === galleryId);
            if (!toUpdateGallery) {
                return NextResponse.json({message:"Gallery not found"}, { status: 404 });
            }
            if(categoryId){
                const toUpdateCategory = toUpdateGallery.categories.find((item: { _id: string; })=>item._id.toString() === categoryId);
                if (!toUpdateCategory) {
                    return NextResponse.json({message:"Category not found"}, { status: 404 });
                }
                toUpdateCategory.images = body.images;
                await gallery.save();
                return NextResponse.json({message:"Category updated successfully"}, { status: 200 });
            }
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


