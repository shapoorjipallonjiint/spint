import Image from "next/image";

// Certification emblem (e.g. LEED Gold) picked per project from admin Projects > Certifications (resolved by the API).
// Sits top-start of the thumbnail, mirroring the hover arrow badge (top-end):
//   grid: same insets (16 / 24 / 40px) and same box (50px, 80px on xl) as the arrow, so the two line up
//   list: smaller, closer to the edge to fit the shorter thumbnail
// `start` flips to the right on the Arabic site, opposite the arrow (which uses `end`). Always visible, no hover.
const POSITION = {
    grid: "top-4 start-4 md:top-6 md:start-6 xl:top-10 xl:start-10 w-[50px] h-[50px] xl:w-[80px] xl:h-[80px]",
    list: "top-3 start-3 md:top-4 md:start-4 w-[44px] h-[44px] md:w-[56px] md:h-[56px]",
};

const CertificationBadge = ({ item, variant = "grid" }) => {
    if (!item?.certificationBadge) return null;
    return (
        <div className={`absolute z-[2] pointer-events-none ${POSITION[variant] || POSITION.grid}`}>
            <Image
                src={item.certificationBadge}
                alt={item.certificationBadgeAlt || "Certification badge"}
                fill
                sizes="80px"
                className="object-contain"
            />
        </div>
    );
};

export default CertificationBadge;
