import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Home from "../../../../models/Home";

type HomeCitiesResult = {
  sixthSection?: {
    cities?: {
      _id: string;
      name?: string;
      name_ar?: string;
      showInProjectFilter?: boolean;
    }[];
  };
};

export async function GET() {
  try {
    await connectDB();

    const home = (await Home.findOne(
      {},
      {
        "sixthSection.cities._id": 1,
        "sixthSection.cities.name": 1,
        "sixthSection.cities.name_ar": 1,
        "sixthSection.cities.showInProjectFilter": 1,
        _id: 0,
      }
    ).lean()) as HomeCitiesResult | null;

    if (!home?.sixthSection?.cities?.length) {
      return NextResponse.json(
        { data: [], message: "No cities found" },
        { status: 200 }
      );
    }

    const cities = home.sixthSection.cities
      .map((city) => ({
        _id: city._id.toString(),
        name: city.name ?? "",
        name_ar: city.name_ar ?? "",
        showInProjectFilter: city.showInProjectFilter ?? false,
      }))
      .filter((city) => city._id && city.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(
      { data: cities, message: "Cities fetched successfully" },
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
