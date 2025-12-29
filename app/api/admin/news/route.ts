import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/app/models/News";
import { verifyAdmin } from "@/lib/verifyAdmin";
import "@/app/models/Topic";


export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const id = request.nextUrl.searchParams.get("id");
        const slug = request.nextUrl.searchParams.get("slug");
        if (id) {
            const news = await News.findOne({}).populate("news.topic", "name name_ar _id");
            const foundNews = news?.news.find((project: { _id: string }) => project._id.toString() === id);
            if (!foundNews) {
                return NextResponse.json({ message: "News not found" }, { status: 404 });
            }
            return NextResponse.json({ data: foundNews, message: "News fetched successfully" }, { status: 200 });
        } else if (slug) {
            const news = await News.findOne({}).populate("news.topic", "name name_ar _id");
            const foundNews = news?.news.find((project: { slug: string }) => project.slug === slug);
            if (!foundNews) {
                return NextResponse.json({ message: "Project not found" }, { status: 404 });
            }
            return NextResponse.json({ data: foundNews, message: "News fetched successfully" }, { status: 200 });
        } else {
            const news = await News.findOne({}).populate("news.topic", "name name_ar _id");
            if (!news) {
                return NextResponse.json({ message: "News not found" }, { status: 404 });
            }
            return NextResponse.json({ data: news, message: "News fetched successfully" }, { status: 200 });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const isAdmin = await verifyAdmin(request);
        const id = request.nextUrl.searchParams.get("id");
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();

        const news = await News.findOne({})
        if (id) {
            const foundNews = news.news.find((news: { _id: string }) => news._id.toString() === id);
            if (!foundNews) {
                return NextResponse.json({ message: "News not found" }, { status: 404 });
            }
            console.log(body)
            foundNews.title = body.title;
            foundNews.title_ar = body.title_ar;
            foundNews.slug = body.slug;
            foundNews.date = body.date;
            foundNews.topic = body.topic;
            foundNews.content = body.content;
            foundNews.coverImage = body.coverImage;
            foundNews.coverImageAlt = body.coverImageAlt;
            foundNews.coverImageAlt_ar = body.coverImageAlt_ar;
            foundNews.thumbnail = body.thumbnail;
            foundNews.thumbnailAlt = body.thumbnailAlt;
            foundNews.thumbnailAlt_ar = body.thumbnailAlt_ar;
            foundNews.metaTitle = body.metaTitle;
            foundNews.metaDescription = body.metaDescription;
            await news.save();
            return NextResponse.json({ data: news, message: "News updated successfully" }, { status: 200 });
        }
        if (!news) {
            await News.create({ ...body });
            return NextResponse.json({ data: news, message: "News created successfully" }, { status: 200 });
        } else {
            await News.findOneAndUpdate({}, body, { upsert: true, new: true });
            return NextResponse.json({ data: news, message: "News updated successfully" }, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const news = await News.findOne({});
        news.news.push(body);
        await news.save();
        return NextResponse.json({ data: news, message: "News created successfully" }, { status: 200 });
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
        const news = await News.findOne({});
        if (!news) {
            return NextResponse.json({ message: "News not found" }, { status: 404 });
        }
        news.news = news.news.filter((news: { _id: string }) => news._id.toString() !== id);
        await news.save();
        return NextResponse.json({ data: news, message: "News deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


