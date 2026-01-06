import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/app/models/Project";
import News from "@/app/models/News";
import DesignStudio from "@/app/models/DesignStudio";
import Engineering from "@/app/models/Engineering";
import Facade from "@/app/models/Facade";
import IntegratedFacilityManagement from "@/app/models/IntegratedFacilityManagement";
import InteriorDesign from "@/app/models/InteriorDesign";
import Mep from "@/app/models/Mep";
import Water from "@/app/models/Water";

export async function POST(req: NextRequest) {
    const { searchQuery } = await req.json();
    await connectDB();
  
    const projectResults = await Project.aggregate([
      // 🔍 Atlas Search on PROJECT fields only
      {
        $search: {
          index: "projects",
          text: {
            query: searchQuery,
            path: [
              "projects.firstSection.title",
              "projects.firstSection.title_ar"
            ],
            fuzzy: { maxEdits: 2 }
          }
        }
      },
    
      // 📦 Flatten projects
      { $unwind: "$projects" },
    
      // 🌍 Location lookup
      {
        $lookup: {
          from: "countries",
          localField: "projects.secondSection.location",
          foreignField: "_id",
          as: "location"
        }
      },
      { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
    
      // 🏭 Sector lookup
      {
        $lookup: {
          from: "sectors",
          localField: "projects.secondSection.sector",
          foreignField: "_id",
          as: "sector"
        }
      },
      { $unwind: { path: "$sector", preserveNullAndEmptyArrays: true } },
    
      // 🛠 Service lookup
      {
        $lookup: {
          from: "services",
          localField: "projects.secondSection.service",
          foreignField: "_id",
          as: "service"
        }
      },
      { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
    
      // 🔎 Match title OR location OR sector OR service
      {
        $match: {
          $or: [
            { "projects.firstSection.title": { $regex: searchQuery, $options: "i" } },
            { "projects.firstSection.title_ar": { $regex: searchQuery, $options: "i" } },
    
            { "location.name": { $regex: searchQuery, $options: "i" } },
            { "location.name_ar": { $regex: searchQuery, $options: "i" } },
    
            { "sector.name": { $regex: searchQuery, $options: "i" } },
            { "sector.name_ar": { $regex: searchQuery, $options: "i" } },
    
            { "service.name": { $regex: searchQuery, $options: "i" } },
            { "service.name_ar": { $regex: searchQuery, $options: "i" } }
          ]
        }
      },
    
      // 🎯 Final shape
      {
        $project: {
          _id: 0,
          project: "$projects",
          location: "$location",
          sector: "$sector",
          service: "$service",
          score: { $meta: "searchScore" }
        }
      }
    ]);
    

      const newsResults = await News.aggregate([
        {
          $search: {
            index: "news", // your Atlas Search index name
            text: {
              query: searchQuery,
              path: {
                wildcard: "*"
              },
              fuzzy: {
                maxEdits: 2,
                prefixLength: 0
              }
            }
          }
        },
        { $unwind: "$news" },
        {
          $lookup: {
            from: "topics",
            localField: "news.topic",
            foreignField: "_id",
            as: "topic"
          }
        },
        { $unwind: { path: "$topic", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $or: [
              { "news.title": { $regex: searchQuery, $options: "i" } },
              { "news.title_ar": { $regex: searchQuery, $options: "i" } },
              { "news.content": { $regex: searchQuery, $options: "i" } },
              { "news.content_ar": { $regex: searchQuery, $options: "i" } },
              
              { "news.metaTitle": { $regex: searchQuery, $options: "i" } },
              { "news.metaDescription": { $regex: searchQuery, $options: "i" } }
            ]
          }
        },
        {
          $project: {
            _id: 0,
            type: { $literal: "news" },
            item: "$news"
          }
        }
      ]);


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
          description: item.description,
          homeImage:item.homeImage,
          homeImageAlt:item.homeImageAlt,
          link:item.link,
          type: types[index],
        }))
      );

      const serviceResults = unifiedData.filter((item) => {
        const q = searchQuery.toLowerCase();
      
        return (
          item.title?.toLowerCase().includes(q) ||
          item.pageTitle?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
        );
      });

      const formattedServiceResults = serviceResults.map((item) => ({
        type: "service",
        serviceType: item.type, // Engineering, MEP, etc.
        item
      }));
      
      
      
      
      const combined = [...projectResults, ...newsResults,...formattedServiceResults];


      console.log(combined)

    return NextResponse.json({ success: true, data: combined });
}