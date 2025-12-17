import { NextRequest, NextResponse } from "next/server";
import { uploadToDropbox } from "@/lib/connectDropbox";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function POST(request: NextRequest) {
    const isAdmin = verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const formData = await request.formData();
      const files = formData.getAll("files") as File[];
      let fileType = formData.get("fileType") as string;
  
      if (!fileType) {
        fileType = "misc";
      }
  
      if (!files || files.length === 0) {
        return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
      }
  
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const filePath = `/uploads/${fileType}/${Date.now()}-${file.name}`;
          return await uploadToDropbox(file, filePath); // assuming it returns URL
        })
      );
  
      return NextResponse.json({ urls: uploadResults }, { status: 200 });
    } catch (error) {
      console.error("Error uploading files:", error);
      return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
    }
  }
  