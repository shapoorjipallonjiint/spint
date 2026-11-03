"use client";

import Link from "next/link";
import React from "react";
import { MdChevronRight, MdOpenInNew } from "react-icons/md";

export type Crumb = { label: string; href?: string };

/**
 * Page header used on every Gallery CMS screen:
 * breadcrumb, title and actions.
 */
const GalleryHeader = ({
    crumbs,
    title,
    subtitle,
    actions,
    onNavigate,
}: {
    crumbs: Crumb[];
    title: string;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    /** Optional guard (e.g. unsaved changes). Return false to cancel navigation. */
    onNavigate?: (href: string) => boolean;
}) => {
    return (
        <div className="flex flex-col gap-4">
            <nav className="flex items-center gap-1 text-sm text-black/60 flex-wrap">
                {crumbs.map((c, i) => (
                    <span key={i} className="flex items-center gap-1">
                        {i > 0 && <MdChevronRight className="text-base" />}
                        {c.href ? (
                            <Link
                                href={c.href}
                                className="hover:text-black hover:underline"
                                onClick={(e) => {
                                    if (onNavigate && !onNavigate(c.href!)) e.preventDefault();
                                }}
                            >
                                {c.label}
                            </Link>
                        ) : (
                            <span className="text-black font-medium">{c.label}</span>
                        )}
                    </span>
                ))}
            </nav>

            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {subtitle && <div className="text-sm text-black/60">{subtitle}</div>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {actions}
                    <a
                        href="/gallery"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sm border border-black/20 rounded-md px-3 py-2 hover:bg-gray-50"
                    >
                        View live page <MdOpenInNew />
                    </a>
                </div>
            </div>

        </div>
    );
};

export default GalleryHeader;
