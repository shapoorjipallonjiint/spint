import mongoose, { InferSchemaType } from "mongoose";

const projectSchema = new mongoose.Schema({
    metaTitle: {
        type: String,
    },
    metaTitle_ar:{
        type:String
    },
    metaDescription: {
        type: String,
    },
    metaDescription_ar:{
        type:String
    },
    banner:{
        type:String,
        required:true
    },
    bannerAlt:{
        type:String,
    },
    bannerAlt_ar:{
        type:String,
    },
    pageTitle:{
        type:String,
    },
    pageTitle_ar:{
        type:String
    },
    firstSection:{
        items:[{
            number:{type:String},
            number_ar:{type:String},
            value:{type:String},
            value_ar:{type:String},
        }]
    },
    projects:[{
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    metaTitle: { type: String },
    metaTitle_ar: { type: String },

    metaDescription: { type: String },
    metaDescription_ar: { type: String },

    thumbnail: { type: String },
    thumbnailAlt: { type: String },
    thumbnailAlt_ar: { type: String },

    images: [{ type: String }],

    firstSection: {
      title: { type: String },
      title_ar: { type: String },

      subTitle: { type: String },
      subTitle_ar: { type: String },

      coverImage: { type: String },
      coverImageAlt: { type: String },
      coverImageAlt_ar: { type: String },

      status: { type: String },
    },

    secondSection: {
      title: { type: String },
      title_ar: { type: String },

      location: {
        type: String,
        required: true,
      },

      sector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sector",
        required: true,
      },

      service: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      }],

      status: { type: String },

      items: [
        {
          key: { type: String },
          key_ar: { type: String },
          value: { type: String },
          value_ar: { type: String },
        },
      ],
    },

    thirdSection: {
      title: { type: String },
      title_ar: { type: String },

      items: [
        {
          number: { type: String },
          number_ar: { type: String },
          value: { type: String },
          value_ar: { type: String },
        },
      ],
    },

    fourthSection: {
      title: { type: String },
      title_ar: { type: String },

      description: { type: String },
      description_ar: { type: String },
    },

    sixthSection: {
      title: { type: String },
      title_ar: { type: String },

      subTitle: { type: String },
      subTitle_ar: { type: String },

      email: { type: String },
      email_ar: { type: String },
    },
  }]
})

export type ProjectType = InferSchemaType<typeof projectSchema>;

export default mongoose.models.Project || mongoose.model("Project", projectSchema);