import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Country from "@/app/models/Country";
import DesignStudio from "@/app/models/DesignStudio";
import Engineering from "@/app/models/Engineering";
import Facade from "@/app/models/Facade";
import IntegratedFacilityManagement from "@/app/models/IntegratedFacilityManagement";
import InteriorDesign from "@/app/models/InteriorDesign";
import Mep from "@/app/models/Mep";
import News from "@/app/models/News";
import Project from "@/app/models/Project";
import Sector from "@/app/models/Sector";
import Service from "@/app/models/Service";
import Water from "@/app/models/Water";

const MIN_MULTI_TOKEN_MATCH_COVERAGE = 0.75;
const MIN_SCORE_SINGLE_TOKEN_SHORT = 100;
const MIN_SCORE_SINGLE_TOKEN = 85;
const MIN_SCORE_MULTI_TOKEN = 90;

const normalizeText = (value: unknown) =>
    String(value ?? "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();

const tokenize = (value: unknown) => normalizeText(value).split(" ").filter(Boolean);

const isScoreEligible = (query: string, score: number) => {
    const queryTokens = tokenize(query);

    if (!queryTokens.length) return false;
    if (queryTokens.length === 1) {
        return queryTokens[0].length <= 4 ? score >= MIN_SCORE_SINGLE_TOKEN_SHORT : score >= MIN_SCORE_SINGLE_TOKEN;
    }

    return score >= MIN_SCORE_MULTI_TOKEN;
};

const levenshteinDistance = (a: string, b: string) => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const prev = Array.from({ length: b.length + 1 }, (_, i) => i);

    for (let i = 1; i <= a.length; i += 1) {
        let diagonal = prev[0];
        prev[0] = i;

        for (let j = 1; j <= b.length; j += 1) {
            const upper = prev[j];
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diagonal + cost);
            diagonal = upper;
        }
    }

    return prev[b.length];
};

const tokenSimilarity = (queryToken: string, candidateToken: string) => {
    if (!queryToken || !candidateToken) return 0;
    if (queryToken === candidateToken) return 1;
    if (candidateToken.startsWith(queryToken) || candidateToken.includes(queryToken)) return 0.94;
    if (queryToken.length >= 4 && queryToken.includes(candidateToken)) return 0.82;
    if (queryToken.length >= 4 && candidateToken.length > queryToken.length) {
        const candidatePrefix = candidateToken.slice(0, queryToken.length);
        const prefixDistance = levenshteinDistance(queryToken, candidatePrefix);
        if (prefixDistance <= 1) return 0.88;
    }

    const maxEdits = queryToken.length >= 8 ? 2 : queryToken.length >= 5 ? 1 : 0;
    if (maxEdits === 0 || Math.abs(queryToken.length - candidateToken.length) > maxEdits) return 0;

    const distance = levenshteinDistance(queryToken, candidateToken);
    if (distance > maxEdits) return 0;

    return distance === 1 ? 0.78 : 0.64;
};

const scoreField = (query: string, fieldValue: unknown) => {
    const normalizedField = normalizeText(fieldValue);
    if (!query || !normalizedField) return 0;

    if (normalizedField === query) return 180;
    if (normalizedField.includes(query)) return 150;

    const queryTokens = tokenize(query);
    const fieldTokens = tokenize(normalizedField);
    if (!queryTokens.length || !fieldTokens.length) return 0;

    let matchedTokens = 0;
    let score = 0;

    for (const queryToken of queryTokens) {
        let bestTokenScore = 0;

        for (const fieldToken of fieldTokens) {
            bestTokenScore = Math.max(bestTokenScore, tokenSimilarity(queryToken, fieldToken));
            if (bestTokenScore === 1) break;
        }

        if (bestTokenScore > 0) {
            matchedTokens += 1;
            score += bestTokenScore;
        }
    }

    const coverage = matchedTokens / queryTokens.length;
    if (queryTokens.length > 1 && coverage < MIN_MULTI_TOKEN_MATCH_COVERAGE) return 0;
    if (queryTokens.length === 1 && coverage === 0) return 0;

    const orderBonus = queryTokens.every((token) => normalizedField.includes(token)) ? 12 : 0;
    return Math.round(coverage * 100 + score * 20 + orderBonus);
};

const scoreWeightedEntry = (query: string, fields: Array<{ value: unknown; weight?: number }>) =>
    fields.reduce<number>((bestScore, field) => {
        const weightedScore = scoreField(query, field.value) * (field.weight ?? 1);
        return Math.max(bestScore, weightedScore);
    }, 0);

export async function POST(req: NextRequest) {
    const { searchQuery } = await req.json();
    const normalizedQuery = normalizeText(searchQuery);

    if (!normalizedQuery) {
        return NextResponse.json({ success: true, data: [] });
    }

    await connectDB();

    const [
        projectDocs,
        newsDocs,
        countryDocs,
        sectorDocs,
        serviceDocs,
        engineeringDocs,
        mepDocs,
        interiorDesignDocs,
        facadeDocs,
        ifmDocs,
        waterDocs,
        designStudioDocs,
    ] = await Promise.all([
        Project.find({}, { projects: 1 }).lean(),
        News.find({}, { news: 1 }).lean(),
        Country.find({}, { _id: 1, name: 1, name_ar: 1 }).lean(),
        Sector.find({}, { _id: 1, name: 1, name_ar: 1 }).lean(),
        Service.find({}, { _id: 1, name: 1, name_ar: 1 }).lean(),
        Engineering.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1, title: 1, title_ar: 1, description: 1, description_ar: 1, homeImage: 1, homeImageAlt: 1, link: 1 }).lean(),
        Mep.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1, title: 1, title_ar: 1, description: 1, description_ar: 1, homeImage: 1, homeImageAlt: 1, link: 1 }).lean(),
        InteriorDesign.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1, title: 1, title_ar: 1, description: 1, description_ar: 1, homeImage: 1, homeImageAlt: 1, link: 1 }).lean(),
        Facade.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1, title: 1, title_ar: 1, description: 1, description_ar: 1, homeImage: 1, homeImageAlt: 1, link: 1 }).lean(),
        IntegratedFacilityManagement.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1, title: 1, title_ar: 1, description: 1, description_ar: 1, homeImage: 1, homeImageAlt: 1, link: 1 }).lean(),
        Water.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1, title: 1, title_ar: 1, description: 1, description_ar: 1, homeImage: 1, homeImageAlt: 1, link: 1 }).lean(),
        DesignStudio.find({}, { _id: 1, pageTitle: 1, pageTitle_ar: 1, title: 1, title_ar: 1, description: 1, description_ar: 1, homeImage: 1, homeImageAlt: 1, link: 1 }).lean(),
    ]);

    const countryMap = new Map(countryDocs.map((item: any) => [String(item._id), item]));
    const sectorMap = new Map(sectorDocs.map((item: any) => [String(item._id), item]));
    const serviceMap = new Map(serviceDocs.map((item: any) => [String(item._id), item]));

    const projectResults = projectDocs
        .flatMap((doc: any) => (doc.projects ?? []).map((project: any) => {
            const location = countryMap.get(String(project?.secondSection?.location ?? ""));
            const sectors = (project?.secondSection?.sector ?? [])
                .map((id: unknown) => sectorMap.get(String(id)))
                .filter(Boolean);
            const services = (project?.secondSection?.service ?? [])
                .map((id: unknown) => serviceMap.get(String(id)))
                .filter(Boolean);

            const score = scoreWeightedEntry(normalizedQuery, [
                { value: project?.firstSection?.title, weight: 1.4 },
                { value: project?.firstSection?.title_ar, weight: 1.4 },
                { value: project?.metaTitle, weight: 1.2 },
                { value: project?.metaTitle_ar, weight: 1.2 },
                { value: project?.firstSection?.subTitle, weight: 1 },
                { value: project?.firstSection?.subTitle_ar, weight: 1 },
                { value: project?.secondSection?.project, weight: 1 },
                { value: project?.secondSection?.project_ar, weight: 1 },
                { value: location?.name, weight: 0.9 },
                { value: location?.name_ar, weight: 0.9 },
                ...sectors.flatMap((item: any) => [
                    { value: item?.name, weight: 0.85 },
                    { value: item?.name_ar, weight: 0.85 },
                ]),
                ...services.flatMap((item: any) => [
                    { value: item?.name, weight: 0.85 },
                    { value: item?.name_ar, weight: 0.85 },
                ]),
                { value: project?.secondSection?.status, weight: 0.7 },
                { value: project?.metaDescription, weight: 0.45 },
                { value: project?.metaDescription_ar, weight: 0.45 },
            ]);

            if (!isScoreEligible(normalizedQuery, score)) return null;

            return {
                score,
                result: {
                    project,
                    location,
                    sector: sectors,
                    service: services,
                },
            };
        }))
        .filter(Boolean)
        .sort((a: any, b: any) => b.score - a.score);

    const newsResults = newsDocs
        .flatMap((doc: any) => (doc.news ?? []).map((item: any) => {
            const score = scoreWeightedEntry(normalizedQuery, [
                { value: item?.title, weight: 1.4 },
                { value: item?.title_ar, weight: 1.4 },
                { value: item?.metaTitle, weight: 1.2 },
                { value: item?.metaTitle_ar, weight: 1.2 },
                { value: item?.metaDescription, weight: 0.5 },
                { value: item?.metaDescription_ar, weight: 0.5 },
                { value: item?.content, weight: 0.35 },
                { value: item?.content_ar, weight: 0.35 },
            ]);

            if (!isScoreEligible(normalizedQuery, score)) return null;

            return {
                score,
                result: {
                    type: "news",
                    item,
                },
            };
        }))
        .filter(Boolean)
        .sort((a: any, b: any) => b.score - a.score);

    const serviceCollections = [
        { type: "Engineering", items: engineeringDocs },
        { type: "Mep", items: mepDocs },
        { type: "InteriorDesign", items: interiorDesignDocs },
        { type: "Facade", items: facadeDocs },
        { type: "IntegratedFacilityManagement", items: ifmDocs },
        { type: "Water", items: waterDocs },
        { type: "DesignStudio", items: designStudioDocs },
    ];

    const serviceResults = serviceCollections
        .flatMap(({ type, items }) => items.map((item: any) => {
            const score = scoreWeightedEntry(normalizedQuery, [
                { value: item?.title, weight: 1.35 },
                { value: item?.title_ar, weight: 1.35 },
                { value: item?.pageTitle, weight: 1.2 },
                { value: item?.pageTitle_ar, weight: 1.2 },
                { value: item?.description, weight: 0.4 },
                { value: item?.description_ar, weight: 0.4 },
            ]);

            if (!isScoreEligible(normalizedQuery, score)) return null;

            return {
                score,
                result: {
                    type: "service",
                    serviceType: type,
                    item,
                },
            };
        }))
        .filter(Boolean)
        .sort((a: any, b: any) => b.score - a.score);

    const combined = [...projectResults, ...newsResults, ...serviceResults]
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 20)
        .map((entry: any) => entry.result);

    return NextResponse.json({ success: true, data: combined });
}
