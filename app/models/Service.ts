import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name:{type:String,required:true},
    name_ar:{type:String}
})

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);