import { NextRequest, NextResponse } from "next/server";
import { uploadToDropbox } from "@/lib/connectDropbox";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Upload from "@/app/models/Upload";
import connectDB from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const formData = await request.formData();
    const file = formData.get("file") as File;
    let fileType = formData.get("fileType") as string;

    if (!fileType) {
      fileType = "misc";
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Dropbox rejects some characters in paths (e.g. the narrow no-break space macOS puts in screenshot
    // names before "AM/PM"), so keep the name to plain letters, digits, dot, dash and underscore.
    const safeName =
      file.name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Za-z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-(?=\.[^.]+$)|-$/g, "") || "file";
    const filePath = `/uploads/${fileType}/${Date.now()}${safeName}`;
    console.log("FILEPATH", filePath);

    const uploadResult = await uploadToDropbox(file, filePath);

    await Upload.create({
      url: uploadResult,
      type: fileType,
      status: "unused",
      path: filePath
    });

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
