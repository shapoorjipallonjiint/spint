import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Leadership from "@/app/models/Leadership";
import { verifyAdmin } from "@/lib/verifyAdmin";

/* ================= GET ================= */

export async function GET() {
  try {
    await connectDB();

    const leadership = await Leadership.findOne({});
    if (!leadership) {
      return NextResponse.json(
        { message: "Leadership not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: leadership,
        message: "Leadership fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ================= PATCH ================= */

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const leadership = await Leadership.findOneAndUpdate(
      {},
      body,
      {
        upsert: true, // create if not exists
        new: true,    // return updated doc
      }
    );

    return NextResponse.json(
      {
        data: leadership,
        message: "Leadership updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
