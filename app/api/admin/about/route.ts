import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import About from "@/app/models/About";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Upload from "@/app/models/Upload";
import { extractUrlsFromBody } from "@/helpers/extractUrlsFromBody";


export async function GET() {
    try {
        await connectDB();
        const about = await About.findOne({});
        if (!about) {
            return NextResponse.json({ message: "About not found" }, { status: 404 });
        }
        return NextResponse.json({ data: about, message: "About fetched successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// export async function PATCH(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const isAdmin = await verifyAdmin(request);
//         if (!isAdmin) {
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }
//         await connectDB();
//         const about = await About.findOneAndUpdate({}, body,{upsert:true,new:true});
//         if (!about) {
//             return NextResponse.json({ message: "About not found" }, { status: 404 });
//         }
//         return NextResponse.json({data:about,message:"About updated successfully"}, { status: 200 });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }

// import { processTempImages } from "@/helpers/processTempImage";

export async function PATCH(request: NextRequest) {

    try {

        const body = await request.json();

        const isAdmin = await verifyAdmin(request);

        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // await processTempImages(body);

        const about = await About.findOneAndUpdate(
            {},
            body,
            { upsert: true, new: true }
        );

        await Upload.updateMany(
            { url: { $in: extractUrlsFromBody(body) } },
            { $set: { status: "used" } }
        );

        return NextResponse.json(
            { data: about, message: "About updated successfully" },
            { status: 200 }
        );

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );

    }

}