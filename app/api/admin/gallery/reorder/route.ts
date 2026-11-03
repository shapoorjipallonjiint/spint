import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/app/models/Gallery";
import { verifyAdmin } from "@/lib/verifyAdmin";

/**
 * Reorders gallery items (top level) or the categories inside one gallery item.
 *
 * Body:
 *   { order: string[] }                     -> reorder top-level gallery items
 *   { galleryId: string, order: string[] }  -> reorder categories inside that item
 *   { scope: "all", order: string[] }      -> set the album order for the public "All" tab
 *
 * Only IDs are accepted from the client. The existing subdocuments are rearranged
 * server-side, so no field (titles, categories, images, etc.) can be lost or
 * overwritten by stale client data. The request is rejected unless `order` is an
 * exact permutation of the IDs currently stored.
 */
export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const order: unknown = body?.order;
        const galleryId: unknown = body?.galleryId;

        if (!Array.isArray(order) || order.some((id) => typeof id !== "string")) {
            return NextResponse.json({ message: "Invalid order payload" }, { status: 400 });
        }

        await connectDB();
        // Work on the raw stored document (lean) so fields not declared in the schema
        // are preserved untouched when the array is written back.
        const gallery = await Gallery.findOne({}).lean<Record<string, unknown>>();
        if (!gallery) {
            return NextResponse.json({ message: "Gallery not found" }, { status: 404 });
        }

        type RawDoc = { _id: { toString(): string } } & Record<string, unknown>;
        const items = (gallery.gallery as RawDoc[] | undefined) || [];

        // "All" tab order: stored separately as a list of album IDs, so the actual
        // sections/albums/photos are never rewritten.
        if (body?.scope === "all") {
            const albumIds = items.flatMap((g) =>
                ((g.categories as RawDoc[] | undefined) || []).map((c) => c._id.toString())
            );
            const known = new Set(albumIds);
            const valid =
                order.length === albumIds.length &&
                new Set(order).size === order.length &&
                (order as string[]).every((id) => known.has(id));
            if (!valid) {
                return NextResponse.json(
                    { message: "Order is out of date. Please refresh the page and try again." },
                    { status: 409 }
                );
            }
            await Gallery.collection.updateOne({ _id: gallery._id } as Record<string, unknown>, {
                $set: { allOrder: order },
            });
            return NextResponse.json({ message: "All tab order updated successfully" }, { status: 200 });
        }

        let current: RawDoc[];
        let path: string;

        if (galleryId) {
            const index = items.findIndex((g) => g._id.toString() === galleryId);
            if (index === -1) {
                return NextResponse.json({ message: "Gallery item not found" }, { status: 404 });
            }
            current = (items[index].categories as RawDoc[] | undefined) || [];
            path = `gallery.${index}.categories`;
        } else {
            current = items;
            path = "gallery";
        }

        const byId = new Map(current.map((doc) => [doc._id.toString(), doc]));

        const isExactPermutation =
            order.length === current.length &&
            new Set(order).size === order.length &&
            (order as string[]).every((id) => byId.has(id));

        if (!isExactPermutation) {
            return NextResponse.json(
                { message: "Order is out of date. Please refresh the page and try again." },
                { status: 409 }
            );
        }

        const reordered = (order as string[]).map((id) => byId.get(id)!);

        // Guard against concurrent edits: only write if the stored array is still exactly
        // what we read (same items, same content, same order). If anything changed in
        // between (e.g. images saved in another tab), nothing is written.
        const guard: Record<string, unknown> = { _id: gallery._id, [path]: current };
        const result = await Gallery.collection.updateOne(
            guard,
            { $set: { [path]: reordered } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Gallery changed while reordering. Please refresh and try again." },
                { status: 409 }
            );
        }

        return NextResponse.json({ message: "Order updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
