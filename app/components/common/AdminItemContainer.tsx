"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminItemContainerProps {
  children: React.ReactNode;
  // false: always open, no toggle (containers whose first child is not a section title)
  expansion?: boolean;
}

const cardClass =
  "flex flex-col rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-14px_rgba(15,23,42,0.14)] transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-[0_1px_2px_rgba(15,23,42,0.05),0_16px_36px_-14px_rgba(30,69,162,0.28)]";

// CMS section card. The first child is the header (the section title); clicking it opens / closes the rest.
// Starts collapsed. Closed content is only hidden (0 height), never unmounted, so every field keeps its value and is
// still submitted. It opens by itself when a field inside it gets focus (react-hook-form focuses the first invalid
// field) or a validation message ([data-form-error]) appears in it, so errors are never hidden in a closed section.
const AdminItemContainer = ({ children, expansion = true }: AdminItemContainerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // content is clipped only while closed or animating; once fully open, dropdowns / pickers inside can overflow
  const [isOpenSettled, setIsOpenSettled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [header, ...content] = React.Children.toArray(children);

  useEffect(() => {
    const el = contentRef.current;
    if (!expansion || !el) return;
    const observer = new MutationObserver(() => {
      if (el.querySelector("[data-form-error]")) setIsExpanded(true);
    });
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [expansion]);

  if (!expansion) {
    return <div className={cn(cardClass, "gap-2")}>{children}</div>;
  }

  return (
    <div
      className={cn(
        cardClass,
        isExpanded && "border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_18px_40px_-18px_rgba(30,69,162,0.22)]"
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => {
          setIsOpenSettled(false);
          setIsExpanded((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpenSettled(false);
            setIsExpanded((prev) => !prev);
          }
        }}
        className={cn(
          "group flex min-h-[64px] cursor-pointer select-none items-center justify-between gap-4 pr-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          // section title: roomier, the accent bar grows when open
          "[&>div>label]:cursor-pointer [&>div>label]:border-b-0 [&>div>label]:py-5 [&>div>label]:pl-6 [&>div>label]:text-[15.5px] [&>div>label]:before:transition-all [&>div>label]:before:duration-300",
          isExpanded
            ? "rounded-t-2xl bg-gradient-to-r from-primary/[0.04] via-transparent to-transparent [&>div>label]:before:h-6"
            : "rounded-2xl hover:bg-gradient-to-r hover:from-primary/[0.07] hover:via-primary/[0.03] hover:to-transparent [&>div>label]:transition-colors hover:[&>div>label]:text-primary"
        )}
      >
        <div className="min-w-0 flex-1">{header}</div>
        <span
          aria-hidden
          className={cn(
            "mr-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
            isExpanded
              ? "border-primary bg-primary text-white shadow-[0_4px_12px_-4px_rgba(30,69,162,0.55)]"
              : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isExpanded && "rotate-180")} />
        </span>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-in-out",
          isExpanded ? "border-t border-slate-100" : "border-t-0"
        )}
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget) setIsOpenSettled(isExpanded);
        }}
      >
        <div
          className={cn("min-h-0", isExpanded && isOpenSettled ? "overflow-visible" : "overflow-hidden")}
          ref={contentRef}
          onFocusCapture={() => setIsExpanded(true)}
        >
          <div className="flex flex-col gap-2">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminItemContainer;
