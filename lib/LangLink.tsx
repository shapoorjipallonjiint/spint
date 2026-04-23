"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

type LangLinkProps = ComponentProps<typeof Link>;

export default function LangLink({ href, children, className, ...props }: LangLinkProps) {
  const isArabic = useIsPreferredLanguageArabic();
  const hrefValue = typeof href === "string" ? href : href?.toString() ?? "";

  if (hrefValue.startsWith("http")) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  let finalHref = hrefValue.startsWith("/") ? hrefValue : `${hrefValue}`;

  if (!isArabic) {
    if (finalHref.startsWith("/ar/")) {
      finalHref = finalHref.replace("/ar", "");
    }

    return (
      <Link href={finalHref} className={className} {...props}>
        {children}
      </Link>
    );
  }

  if (!finalHref.startsWith("/ar") && hrefValue !== "#" && hrefValue !== "") {
    finalHref = `/ar${finalHref}`;
  }

  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  );
}
