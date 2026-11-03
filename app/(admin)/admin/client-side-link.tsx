"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { memo, useEffect } from "react";
import { ChevronDown } from "lucide-react";

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
  // only active on an exact match (the dashboard at /admin would otherwise match every admin page)
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

  // Parent active if itself OR any child is active
  const isParentActive =
    matches(pathname, href, exact) || !!children?.some((child) => matches(pathname, child.href));

  // only the closest matching child is active (/admin/projects/main is Main, not also Project List)
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
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rowClass = cn(
    "group relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors duration-200 cursor-pointer",
    isParentActive
      ? "bg-primary/[0.08] text-primary"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    className
  );

  const content = (
    <>
      {/* accent bar on the active item */}
      <span
        className={cn(
          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-opacity duration-200",
          isParentActive && !hasChild ? "opacity-100" : "opacity-0"
        )}
      />
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center transition-colors",
            isParentActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
          )}
        >
          {icon}
        </span>
        <span className="truncate">{name}</span>
      </span>
      {hasChild && (
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      )}
    </>
  );

  return (
    <div>
      {hasChild ? (
        <button type="button" className={rowClass} onClick={() => setOpenLink?.(isOpen ? null : href)} aria-expanded={isOpen}>
          {content}
        </button>
      ) : href === "/admin/logout" ? (
        <button type="button" className={rowClass} onClick={handleLogout}>
          {content}
        </button>
      ) : (
        <Link href={href} className={rowClass} onClick={() => setOpenLink?.(null)}>
          {content}
        </Link>
      )}

      {/* Child links: smooth height animation via the grid-rows trick */}
      {hasChild && children && (
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="ml-[21px] mt-1 mb-1 flex flex-col gap-0.5 border-l border-gray-200 pl-3">
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
                        ? "bg-primary/[0.06] font-semibold text-primary"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                      item.muted && "opacity-50"
                    )}
                  >
                    {isChildActive && (
                      <span className="absolute -left-[16.5px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-white" />
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
