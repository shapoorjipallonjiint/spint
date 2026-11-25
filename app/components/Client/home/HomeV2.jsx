"use client";

import { useSyncExternalStore } from "react";
import Index from "./Index";

// Home page (/, /ar, and the /home-v2 preview): the home with a rotating hero video, one per visit, in the admin order
// (admin: Home > First Section > Rotating Videos). Visit 1 -> video 1, visit 2 -> video 2, ... then back to video 1.
//  - localStorage keeps the video shown on the visitor's previous visit (survives closing the browser)
//  - sessionStorage keeps this visit's pick, so going around the site (Home -> About -> Home) or refreshing in the
//    same tab keeps the same video; a new visit (new tab / window) moves on to the next one
const LAST_INDEX_KEY = "spint.homeV2.heroVideo.lastIndex";
const VISIT_INDEX_KEY = "spint.homeV2.heroVideo.visitIndex";

// storage can be blocked (private mode, cookies disabled): reads then return null and writes do nothing,
// so the visitor simply gets video 1
const getStorage = (name) => {
    try {
        return window[name] ?? null;
    } catch {
        return null;
    }
};

const readIndex = (storage, key) => {
    try {
        const n = parseInt(storage?.getItem(key) ?? "", 10);
        return Number.isInteger(n) && n >= 0 ? n : null;
    } catch {
        return null;
    }
};

const writeIndex = (storage, key, value) => {
    try {
        storage?.setItem(key, String(value));
    } catch {
        /* storage full / blocked: the rotation just doesn't advance */
    }
};

// index of the video for this visit (count = number of videos; `% count` keeps it valid if videos were removed)
const pickVisitIndex = (count) => {
    const session = getStorage("sessionStorage");
    const local = getStorage("localStorage");

    const visitIndex = readIndex(session, VISIT_INDEX_KEY);
    if (visitIndex !== null) return visitIndex % count;

    const lastIndex = readIndex(local, LAST_INDEX_KEY);
    const next = lastIndex === null ? 0 : (lastIndex + 1) % count;
    writeIndex(local, LAST_INDEX_KEY, next);
    writeIndex(session, VISIT_INDEX_KEY, next);
    return next;
};

// the admin list ({ video, poster }), or the single First Section video + poster when the list is empty
const heroVideosOf = (data) => {
    const first = data?.firstSection;
    const rotating = (first?.rotatingVideos || []).filter((item) => item?.video);
    if (rotating.length) return rotating.map((item) => ({ video: item.video, poster: item.poster || "" }));
    return first?.video ? [{ video: first.video, poster: first.videoPosterImage || "" }] : [];
};

const noSubscribe = () => () => {};

const HomeV2 = ({ data, ...rest }) => {
    const videos = heroVideosOf(data);

    // picked in the browser (the server can't see the visitor's history): the server render and hydration use null
    // (no video loads), then React re-renders with the pick. Returns the index (a number, so it compares equal
    // across renders); calling pickVisitIndex again in the same visit returns the same index (sessionStorage).
    const index = useSyncExternalStore(
        noSubscribe,
        () => (videos.length ? pickVisitIndex(videos.length) : null),
        () => null
    );
    const hero = index === null ? null : videos[index];

    return <Index data={data} heroVideo={hero?.video ?? null} heroPoster={hero?.poster} {...rest} />;
};

export default HomeV2;
