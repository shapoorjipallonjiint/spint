import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
    metaTitle: {
        type: String,
        required: true
    },
    metaTitle_ar: {
        type: String,
    },
    metaDescription: {
        type: String,
        required: true
    },
    metaDescription_ar: {
        type: String,
    },
    firstSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        subTitle: {
            text: { type: String },
            text_ar: { type: String },
            link: { type: String }
        },
        video: {
            type: String,
            required: true
        },
        videoAlt: {
            type: String,
            required: true
        },
        videoAlt_ar: {
            type: String,
            required: true
        },
        videoPosterImage: {
            type: String
        },
        videoPosterImageAlt: {
            type: String
        },
        videoPosterImageAlt_ar: {
            type: String
        }
    },
    secondSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        subTitle: {
            type: String,
        },
        subTitle_ar: {
            type: String,
        },
        description: {
            type: String,
        },
        description_ar: {
            type: String,
        },
        image: {
            type: String
        },
        imageAlt: {
            type: String
        },
        imageAlt_ar: {
            type: String
        },
        video: {
            type: String
        },
        videoAlt: {
            type: String
        },
        videoAlt_ar: {
            type: String
        },
        videoPosterImage: {
            type: String
        },
        videoPosterImageAlt: {
            type: String
        },
        videoPosterImageAlt_ar: {
            type: String
        },
        items: [{
            key: { type: String },
            key_ar: { type: String },
            value: { type: String },
            value_ar: { type: String }
        }],
        // highlights that cycle above the stats (icon + title). New and optional: default undefined so the
        // existing document is not touched until they are saved; the homepage falls back to its defaults until then
        highlights: {
            type: [{
                title: { type: String },
                title_ar: { type: String },
                icon: { type: String },
                iconAlt: { type: String },
                iconAlt_ar: { type: String },
            }],
            default: undefined,
        },
    },
    thirdSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        description: {
            type: String,
            required: true
        },
        description_ar: {
            type: String,
        },
        link: {
            type: String
        },
        link_ar: {
            type: String
        },
        image: {
            type: String,
            required: true
        },
        imageAlt: {
            type: String,
            required: true
        },
        imageAlt_ar: {
            type: String
        },
        items: [{
            key: { type: String },
            key_ar: { type: String },
            value: { type: String },
            value_ar: { type: String }
        }],
        // right side background video (desktop); optional, one video for both languages
        video: { type: String },
        // left side of the slide: "Our Credentials" title, description and the 11 cubes (order: lib/credentialsCubes.ts).
        // New and optional (cubes default undefined), so existing documents are not touched until saved.
        // title / description / link above are the right side ("About SP International"); image and items are no
        // longer shown on the site but are kept as they are.
        credentials: {
            title: { type: String },
            title_ar: { type: String },
            description: { type: String },
            description_ar: { type: String },
            cubes: {
                type: [{
                    value: { type: String },
                    value_ar: { type: String },
                    key: { type: String },
                    key_ar: { type: String },
                }],
                default: undefined,
            },
        },
    },
    fourthSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
    },
    fifthSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        items:[{
            image: String,
            imageAlt: String,
            imageAlt_ar: String,
            logo: String,
            logoAlt: String,
            logoAlt_ar: String,
            completedProjects: String,
            ongoingProjects: String,
            completedProjects_ar: String,
            ongoingProjects_ar: String,
            title: String,
            title_ar: String,
        }]
    },
    sixthSection: {
        title: {
            type: String,
            required: true
        },
        title_ar: {
            type: String,
        },
        cities: [{
            id: { type: String },
            name: { type: String },
            name_ar: { type: String },
            // legacy position, typed by hand (kept as-is; used until the point is re-picked on the map)
            left: { type: String },
            top: { type: String },
            // exact point picked on the map image in admin: % of the full world_map.png width / height
            x: { type: Number },
            y: { type: Number },
            completedProjects: { type: String },
            employees: { type: String },
            showInProjectFilter: { type: Boolean}
        }]
    },
    seventhSection: {
        title: { type: String },
        title_ar: { type: String },
        image: {
            type: String
        },
        imageAlt: {
            type: String
        },
        imageAlt_ar: {
            type: String
        },
        items: [{
            title: { type: String },
            title_ar: { type: String },
            description: { type: String },
            description_ar: { type: String }
        }],
        button: {
            text: { type: String },
            text_ar: { type: String },
            link: { type: String },
            link_ar: { type: String }
        }
    }

})

export default mongoose.models.HomePresence || mongoose.model("HomePresence", homeSchema);