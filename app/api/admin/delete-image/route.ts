import { getDropboxInstance } from "@/lib/connectDropbox";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();
        const dropbox = await getDropboxInstance();

        const fileName = url.split("?")[0].split("/").pop();
        const filePath = `/uploads/image/${fileName}`;

        const deleteImage = await dropbox.filesDeleteV2({
            path: filePath,
        });

        if (deleteImage) {
            console.log("Deleted:", filePath);
            return NextResponse.json({ message: "Image deleted", success: true })
        } else {
            return NextResponse.json({ message: "Image deletion failed", success: false })
        }

    } catch (error) {
        console.error("Delete failed:", error);
        throw error;
    }
}