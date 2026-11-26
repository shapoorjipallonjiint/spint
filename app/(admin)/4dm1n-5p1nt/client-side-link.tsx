"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { memo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAdminSidebar } from "@/contexts/adminSidebar";

interface ClientSideLinkProps {
  href: string;
  name: string;
  icon: React.ReactNode;
  className?: string;
  // muted: dimmed child (e.g. a service hidden on the website)
  children?: { href: string; name: string; muted?: boolean }[];
  isOpen?: boolean;
  setOpenLink?: (href: string | null) => void;
  hasChild?: boolean;
  // only active on an exact match (the dashboard at /4dm1n-5p1nt would otherwise match every admin page)
  exact?: boolean;
}

const matches = (pathname: string, href: string, exact = false) =>
  pathname === href || (!exact && pathname.startsWith(`${href}/`));

function ClientSideLink({
  href,
  name,
  icon,
  className,
  children,
  isOpen = false,
  setOpenLink,
  hasChild = false,
  exact = false,
}: ClientSideLinkProps) {
  const pathname = usePathname() || "";
  // collapsed sidebar: icon only (name as tooltip), sub-links hidden
  const { collapsed, setCollapsed } = useAdminSidebar();

  // Parent active if itself OR any child is active
  const isParentActive =
    matches(pathname, href, exact) || !!children?.some((child) => matches(pathname, child.href));

  // only the closest matching child is active (/4dm1n-5p1nt/projects/main is Main, not also Project List)
  const activeChildHref = children
    ?.filter((child) => matches(pathname, child.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  // AUTO-OPEN DROPDOWN ON REFRESH / ROUTE CHANGE
  useEffect(() => {
    if (isParentActive && hasChild) {
      setOpenLink?.(href);
    }
  }, [isParentActive, hasChild, href, setOpenLink]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/4dm1n-5p1nt/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rowClass = cn(
    "group relative flex w-full items-center justify-between gap-3 rounded-xl px-2 py-1 text-[14px] font-medium transition-all duration-200 cursor-pointer",
    collapsed && "justify-center px-0 py-1.5",
    isParentActive
      ? "bg-white text-primary shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]"
      : "text-white/70 hover:bg-white/[0.07] hover:text-white",
    className
  );

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        {/* icon tile: solid brand gradient when active */}
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
            isParentActive
              ? "bg-gradient-to-br from-primary to-[#3b6fd8] text-white shadow-[0_3px_8px_-2px_rgba(30,69,162,0.45)]"
              : "text-white/55 group-hover:bg-white/10 group-hover:text-white"
          )}
        >
          {icon}
        </span>
        <span className={cn("truncate", collapsed && "sr-only")}>{name}</span>
      </span>
      {hasChild && !collapsed && (
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isParentActive ? "text-primary/60" : "text-white/40",
            isOpen && "rotate-180"
          )}
        />
      )}
    </>
  );

  return (
    <div>
      {hasChild ? (
        <button
          type="button"
          className={rowClass}
          title={collapsed ? name : undefined}
          onClick={() => {
            // collapsed: open the sidebar with this group expanded
            if (collapsed) {
              setCollapsed(false);
              setOpenLink?.(href);
              return;
            }
            setOpenLink?.(isOpen ? null : href);
          }}
          aria-expanded={isOpen && !collapsed}
        >
          {content}
        </button>
      ) : href === "/4dm1n-5p1nt/logout" ? (
        <button type="button" className={rowClass} onClick={handleLogout} title={collapsed ? name : undefined}>
          {content}
        </button>
      ) : (
        <Link href={href} className={rowClass} onClick={() => setOpenLink?.(null)} title={collapsed ? name : undefined}>
          {content}
        </Link>
      )}

      {/* Child links: smooth height animation via the grid-rows trick */}
      {hasChild && children && !collapsed && (
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="ml-[21px] mt-1 mb-1 flex flex-col gap-0.5 border-l border-white/15 pl-3">
              {children.map((item) => {
                const isChildActive = item.href === activeChildHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    tabIndex={isOpen ? 0 : -1}
                    className={cn(
                      "relative rounded-md px-3 py-1.5 text-[13px] transition-colors",
                      isChildActive
                        ? "bg-white/[0.12] font-semibold text-white"
                        : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                      item.muted && "opacity-50"
                    )}
                  >
                    {isChildActive && (
                      <span className="absolute -left-[16.5px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_0_3px_rgba(56,189,248,0.25)]" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ClientSideLink);
