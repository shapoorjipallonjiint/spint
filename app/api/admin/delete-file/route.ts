import { getDropboxInstance } from "@/lib/connectDropbox";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();
        const dropbox = await getDropboxInstance();

        const fileName = url.split("?")[0].split("/").pop();
        const filePath = `/uploads/file/${fileName}`;

        const deleteVideo = await dropbox.filesDeleteV2({
            path: filePath,
        });

        if (deleteVideo) {
            console.log("Deleted:", filePath);
            return NextResponse.json({ message: "Video deleted", success: true })
        } else {
            return NextResponse.json({ message: "Video deletion failed", success: false })
        }

    } catch (error) {
        console.error("Delete failed:", error);
        throw error;
    }
}