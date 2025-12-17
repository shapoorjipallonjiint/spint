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
    const file = formData.get("file") as File;
    let fileType = formData.get("fileType") as string;

    if (!fileType) {
      fileType = "misc";
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filePath = `/uploads/${fileType}/${Date.now()}${file.name}`;
    const uploadResult = await uploadToDropbox(file, filePath);

    return NextResponse.json(
      {
        url: uploadResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
