import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/mongodb";
import Header from "@/app/models/Header";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { DEFAULT_HEADER, HEADER_TAG, normalizeHeader } from "@/lib/header";

// public: the header content (the default header until it is first saved in admin)
export async function GET() {
    try {
        await connectDB();
        const header = await Header.findOne({}).lean();
        return NextResponse.json(
            { data: header ? normalizeHeader(header) : DEFAULT_HEADER, message: "Header fetched successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const data = normalizeHeader(await request.json());
        // the website menu can never be saved empty
        if (!data.menu.length) {
            return NextResponse.json({ message: "The menu needs at least one item" }, { status: 400 });
        }
        await connectDB();
        // the admin form loads and sends back every field, so a full replace keeps all content
        const header = await Header.findOneAndUpdate({}, data, { upsert: true, new: true }).lean();
        // show the change on every page right away
        revalidateTag(HEADER_TAG, "max");
        revalidatePath("/", "layout");
        return NextResponse.json({ data: normalizeHeader(header), message: "Header updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
