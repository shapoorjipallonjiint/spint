import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    name:{type:String,required:true},
    name_ar:{type:String}
})

export default mongoose.models.Topic || mongoose.model("Topic", topicSchema);