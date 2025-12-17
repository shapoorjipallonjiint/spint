import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    name:{type:String,required:true},
    name_ar:{type:String}
})

export default mongoose.models.Country || mongoose.model("Country", countrySchema);