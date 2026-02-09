import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import DesignStudio from "@/app/models/DesignStudio";
import Engineering from "@/app/models/Engineering";
import Facade from "@/app/models/Facade";
import IntegratedFacilityManagement from "@/app/models/IntegratedFacilityManagement";
import InteriorDesign from "@/app/models/InteriorDesign";
import Mep from "@/app/models/Mep";
import Water from "@/app/models/Water";

export async function GET() {
  try {
    await connectDB();

    const collections = await Promise.all([
      Engineering.find({}, { _id: 1, pageTitle: 1, pageTitle_ar:1,title: 1, title_ar:1,description: 1, description_ar:1,homeImage:1,homeImageAlt:1,link:1 }).lean(),
      Mep.find({}, { _id: 1, pageTitle: 1, pageTitle_ar:1,title: 1, title_ar:1,description: 1, description_ar:1,homeImage:1,homeImageAlt:1,link:1 }).lean(),
      InteriorDesign.find({}, { _id: 1, pageTitle: 1, pageTitle_ar:1,title: 1, title_ar:1,description: 1, description_ar:1,homeImage:1,homeImageAlt:1,link:1 }).lean(),
      Facade.find({}, { _id: 1, pageTitle: 1, pageTitle_ar:1,title: 1, title_ar:1,description: 1, description_ar:1,homeImage:1,homeImageAlt:1,link:1 }).lean(),
      IntegratedFacilityManagement.find({}, { _id: 1, pageTitle: 1, pageTitle_ar:1,title: 1, title_ar:1,description: 1, description_ar:1,homeImage:1,homeImageAlt:1,link:1 }).lean(),
      Water.find({}, { _id: 1, pageTitle: 1, pageTitle_ar:1,title: 1, title_ar:1,description: 1, description_ar:1,homeImage:1,homeImageAlt:1,link:1 }).lean(),
      DesignStudio.find({}, { _id: 1, pageTitle: 1, pageTitle_ar:1,title: 1, title_ar:1,description: 1, description_ar:1,homeImage:1,homeImageAlt:1,link:1 }).lean(),
    ]);

    const types = [
      "DesignStudio",
      "Engineering",
      "Facade",
      "IntegratedFacilityManagement",
      "InteriorDesign",
      "Mep",
      "Water",
    ];

    const unifiedData = collections.flatMap((items, index) =>
      items.map((item) => ({
        _id: item._id,
        pageTitle: item.pageTitle,
        title: item.title,
        title_ar: item.title_ar,
        description: item.description,
        homeImage:item.homeImage,
        homeImageAlt:item.homeImageAlt,
        link:item.link,
        type: types[index],
      }))
    );

    return NextResponse.json(
      {
        message: "Page services fetched successfully",
        data: unifiedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
