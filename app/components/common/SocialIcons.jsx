"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import { FooterLink } from "@/app/components/common/FooterTwo";
import { DEFAULT_FOOTER } from "@/lib/footer";

const CIRCLE = "flex items-center justify-center border border-[#30B6F9] cursor-pointer w-[34px] h-[34px] bg-[#00000030] rounded-full";

// "Stay Connected" icons (home first section, hamburger menu, search slider): the same icons + links as the footer
// (admin > Footer > socials); hidden ones are left out. With `motionDelay`, each icon moves up in turn
// (delay, +0.15s, +0.3s ...), like the menus did before.
const SocialIcons = ({ socials = DEFAULT_FOOTER.socials, motionDelay }) => {
    const visible = (socials || []).filter((item) => item && !item.hidden && item.icon);

    return (
        <div className="flex items-center gap-2">
            {visible.map((item, index) => {
                const icon = <Image src={item.icon} alt={item.name} width={16} height={16} className="w-[16px] h-auto" />;

                if (typeof motionDelay !== "number") {
                    return (
                        <FooterLink key={index} href={item.href} aria-label={item.name} className={CIRCLE}>
                            {icon}
                        </FooterLink>
                    );
                }

                return (
                    <motion.div
                        key={index}
                        variants={moveUp(motionDelay + 0.15 * index)}
                        initial="hidden"
                        whileInView="show"
                        className={CIRCLE}
                    >
                        <FooterLink href={item.href} aria-label={item.name} className="w-full h-full flex items-center justify-center rounded-full">
                            {icon}
                        </FooterLink>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default SocialIcons;
