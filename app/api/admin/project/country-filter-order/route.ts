import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import CountryFilterOrder from "@/app/models/CountryFilterOrder";

// order of the countries in the /projects country filter (country slugs). Public read; admin write.
export async function GET() {
    try {
        await connectDB();
        const doc = await CountryFilterOrder.findOne({}).lean<{ order?: string[] }>();
        return NextResponse.json({ data: { order: doc?.order || [] } }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        if (!Array.isArray(body?.order)) {
            return NextResponse.json({ message: "order must be a list of country slugs" }, { status: 400 });
        }
        // plain slugs only, no duplicates; an empty list resets the filter to its default order
        const order = [
            ...new Set(
                (body.order as unknown[])
                    .filter((slug): slug is string => typeof slug === "string")
                    .map((slug) => slug.trim())
                    .filter((slug) => /^[a-z0-9-]{1,80}$/.test(slug))
            ),
        ].slice(0, 300);
        await connectDB();
        await CountryFilterOrder.findOneAndUpdate({}, { order }, { upsert: true, new: true });
        return NextResponse.json(
            { data: { order }, message: order.length ? "Country filter order saved" : "Country filter order reset" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
