import mongoose from "mongoose";

const sectorSchema = new mongoose.Schema({
    name:{type:String,required:true},
    name_ar:{type:String}
})

export default mongoose.models.Sector || mongoose.model("Sector", sectorSchema);