import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/mongodb";
import Footer from "@/app/models/Footer";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { DEFAULT_FOOTER, FOOTER_TAG, normalizeFooter } from "@/lib/footer";

// public: the footer content (the default footer until it is first saved in admin)
export async function GET() {
    try {
        await connectDB();
        const footer = await Footer.findOne({}).lean();
        return NextResponse.json(
            { data: footer ? normalizeFooter(footer) : DEFAULT_FOOTER, message: "Footer fetched successfully" },
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
        const body = await request.json();
        await connectDB();
        // the admin form loads and sends back every field, so a full replace keeps all content
        const footer = await Footer.findOneAndUpdate({}, normalizeFooter(body), { upsert: true, new: true }).lean();
        // show the change on every page right away
        revalidateTag(FOOTER_TAG, "max");
        revalidatePath("/", "layout");
        return NextResponse.json({ data: normalizeFooter(footer), message: "Footer updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
