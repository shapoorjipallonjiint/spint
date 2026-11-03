"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

/**
 * Show / hide switch for a section or album. Only toggles the `isHidden` flag;
 * nothing is deleted. Calls `onChanged` after a successful update so the parent can refetch.
 */
const VisibilityToggle = ({
    galleryId,
    categoryId,
    hidden,
    onChanged,
    compact = false,
}: {
    galleryId: string;
    categoryId?: string;
    hidden: boolean;
    onChanged: () => void;
    compact?: boolean;
}) => {
    const [busy, setBusy] = useState(false);

    const toggle = async () => {
        setBusy(true);
        try {
            const response = await fetch("/api/admin/gallery/visibility", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ galleryId, categoryId, hidden: !hidden }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                onChanged();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setBusy(false);
        }
    };

    const label = hidden ? "Hidden" : "Visible";
    const title = hidden ? "Hidden from the website. Click to show." : "Shown on the website. Click to hide.";

    return (
        <button
            type="button"
            role="switch"
            aria-checked={!hidden}
            title={title}
            onClick={toggle}
            disabled={busy}
            className={`flex items-center gap-2 rounded-full text-xs font-medium transition disabled:opacity-50 ${
                compact ? "px-2 py-1" : "pl-1 pr-3 py-1"
            } ${hidden ? "bg-black/5 text-black/60 hover:bg-black/10" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
        >
            {!compact && (
                <span className={`relative w-8 h-4 rounded-full transition ${hidden ? "bg-black/20" : "bg-green-600"}`}>
                    <span
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${
                            hidden ? "left-0.5" : "left-[18px]"
                        }`}
                    />
                </span>
            )}
            {compact && (hidden ? <MdVisibilityOff /> : <MdVisibility />)}
            {busy ? "..." : label}
        </button>
    );
};

export default VisibilityToggle;
