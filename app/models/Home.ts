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
        // home hero (/ and /home-v2): videos shown one per visit in this order (visit 1 -> video 1, visit 2 -> video 2, ...,
        // then back to video 1). Empty / missing = the single `video` above. No default, so existing data is untouched.
        // poster: optional image shown while that video loads
        rotatingVideos: {
            type: [{ video: { type: String }, poster: { type: String } }],
            default: undefined,
        },
        // label above the social icons in the hero (desktop). Optional: empty = "Stay Connected"
        socialLabel: { type: String },
        socialLabel_ar: { type: String },
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
        // "READ MORE" button. Optional: empty text = "READ MORE", empty link = the third section's link (as before)
        button: {
            text: { type: String },
            text_ar: { type: String },
            link: { type: String },
            link_ar: { type: String },
        },
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
        // text of the "READ MORE" button that uses `link`. Optional: empty = "READ MORE"
        buttonText: { type: String },
        buttonText_ar: { type: String },
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
        // optional still shown until the background video loads
        videoPosterImage: { type: String },
        // left side of the slide: "Our Credentials" title, description and the cubes (order: lib/credentialsCubes.ts).
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
            // cubes per column, left to right (cubes fill each column bottom to top). Optional: documents without it
            // keep the original [4, 3, 2, 1, 1] top-to-bottom layout.
            columns: {
                type: [Number],
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
            completedProjects_ar: String,
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
        // map legend labels; spGroup is also the label on the SP Group map dot.
        // Optional: empty = "SP Group" / "SP International"
        legend: {
            spGroup: { type: String },
            spGroup_ar: { type: String },
            spInternational: { type: String },
            spInternational_ar: { type: String },
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
            showInProjectFilter: { type: Boolean},
            // ISO 3166-1 alpha-2 (e.g. "AE"): matched against the visitor's country to list its projects first
            code: { type: String }
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