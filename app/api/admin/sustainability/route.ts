// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Sustainability from "@/app/models/Sustainability";
// import { verifyAdmin } from "@/lib/verifyAdmin";


// export async function GET() {
//     try {
//         await connectDB();
//         const sustainability = await About.findOne({});
//         if (!sustainability) {
//             return NextResponse.json({ message: "Sustainability not found" }, { status: 404 });
//         }
//         return NextResponse.json({data:sustainability,message:"Sustainability fetched successfully"}, { status: 200 });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// export async function PATCH(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const isAdmin = await verifyAdmin(request);
//         if (!isAdmin) {
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }
//         await connectDB();
//         const sustainability = await About.findOneAndUpdate({}, body,{upsert:true,new:true});
//         if (!sustainability) {
//             return NextResponse.json({ message: "Sustainability not found" }, { status: 404 });
//         }
//         return NextResponse.json({data:sustainability,message:"Sustainability updated successfully"}, { status: 200 });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }