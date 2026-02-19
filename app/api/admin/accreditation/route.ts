import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Accreditation from "@/app/models/Accreditation";
import { verifyAdmin } from "@/lib/verifyAdmin";



export async function GET() {
    try {
        await connectDB();
        const accreditation = await Accreditation.findOne({});
        if (!accreditation) {
            return NextResponse.json({ message: "Accreditation not found" }, { status: 404 });
        }
        return NextResponse.json({ data: accreditation, message: "Accreditation fetched successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const id = request.nextUrl.searchParams.get("id");
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        if (id) {
            const accreditationDoc = await Accreditation.findOne({});

            if (!accreditationDoc) {
                return NextResponse.json(
                    { message: "Accreditation document not found" },
                    { status: 404 }
                );
            }

            let movedAccreditation: any = null;

            // 1️⃣ Remove accreditation from wherever it exists
            accreditationDoc.categories.forEach((category: any) => {
                const index = category.accreditations.findIndex(
                    (acc: any) => acc._id.toString() === id
                );

                if (index !== -1) {
                    movedAccreditation = category.accreditations[index];
                    category.accreditations.splice(index, 1);
                }
            });

            if (!movedAccreditation) {
                return NextResponse.json(
                    { message: "Accreditation not found in any category" },
                    { status: 404 }
                );
            }

            // 2️⃣ Find target category
            const targetCategory = accreditationDoc.categories.find(
                (cat: any) => cat._id.toString() === body.category
            );

            if (!targetCategory) {
                return NextResponse.json(
                    { message: "Target category not found" },
                    { status: 404 }
                );
            }

            // 3️⃣ Update category field (optional but recommended)
            movedAccreditation.category = body.category;
            movedAccreditation.fileImage = body.fileImage;
            movedAccreditation.fileImageAlt = body.fileImageAlt;
            movedAccreditation.fileImageAlt_ar = body.fileImageAlt_ar;
            movedAccreditation.title = body.title;
            movedAccreditation.title_ar = body.title_ar;
            movedAccreditation.file = body.file;


            // 4️⃣ Add accreditation to target category
            targetCategory.accreditations.push(movedAccreditation);

            // 5️⃣ Save once
            await accreditationDoc.save();

            return NextResponse.json(
                {
                    data: accreditationDoc,
                    message: "Accreditation updated successfully",
                },
                { status: 200 }
            );
        }

        const accreditation = await Accreditation.findOneAndUpdate({}, body, { upsert: true, new: true });
        if (!accreditation) {
            return NextResponse.json({ message: "Accreditation not found" }, { status: 404 });
        }
        return NextResponse.json({ data: accreditation, message: "Accreditation updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(body);
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const accreditation = await Accreditation.findOne({});
        if (!accreditation) {
            return NextResponse.json({ message: "Accreditation not found" }, { status: 404 });
        }
        const foundCategory = accreditation.categories.find((category: { _id: string }) => category._id.toString() === body.category);
        if (!foundCategory) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        foundCategory.accreditations.push({ title: body.title, title_ar: body.title_ar, fileImage: body.fileImage, fileImageAlt: body.fileImageAlt, fileImageAlt_ar: body.fileImageAlt_ar, category: body.category, file: body.file });
        await accreditation.save();
        return NextResponse.json({ data: accreditation, message: "Accreditation added successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get("id");

        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const accreditation = await Accreditation.findOne({});
        if (!accreditation) {
            return NextResponse.json(
                { message: "Accreditation not found" },
                { status: 404 }
            );
        }

        // 1️⃣ Find category containing the accreditation
        const category = accreditation.categories.find((cat: any) =>
            cat.accreditations.some(
                (acc: any) => acc._id.toString() === id
            )
        );

        if (!category) {
            return NextResponse.json(
                { message: "Accreditation not found" },
                { status: 404 }
            );
        }

        // 2️⃣ Remove accreditation from that category
        category.accreditations = category.accreditations.filter(
            (acc: any) => acc._id.toString() !== id
        );

        // 3️⃣ Save once
        await accreditation.save();

        return NextResponse.json(
            { data: accreditation, message: "Accreditation deleted successfully" },
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



