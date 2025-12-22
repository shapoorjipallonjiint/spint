import DesignStudio from "@/app/models/DesignStudio";
import Engineering from "@/app/models/Engineering";
import Facade from "@/app/models/Facade";
import IntegratedFacilityManagement from "@/app/models/IntegratedFacilityManagement";
import InteriorDesign from "@/app/models/InteriorDesign";
import Mep from "@/app/models/Mep";
import Water from "@/app/models/Water";
import { Types } from "mongoose";

type ServiceLean = {
  _id: Types.ObjectId;
  pageTitle: string;
  pageTitle_ar?: string;
};

export async function getServiceMap() {
  const services = await Promise.all([
    DesignStudio.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1 }).lean<ServiceLean[]>(),
    Engineering.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1 }).lean<ServiceLean[]>(),
    Facade.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1 }).lean<ServiceLean[]>(),
    IntegratedFacilityManagement.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1 }).lean<ServiceLean[]>(),
    InteriorDesign.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1 }).lean<ServiceLean[]>(),
    Mep.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1 }).lean<ServiceLean[]>(),
    Water.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1 }).lean<ServiceLean[]>(),
  ]);

  const serviceMap = new Map<string, ServiceLean>();

  services.flat().forEach((service) => {
    serviceMap.set(service._id.toString(), service);
  });

  return serviceMap;
}
