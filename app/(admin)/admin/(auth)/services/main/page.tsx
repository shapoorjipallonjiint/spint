"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { Label } from "@/components/ui/label";
import { SERVICE_REGISTRY } from "@/lib/serviceRegistry";
import { SERVICE_VISIBILITY_EVENT } from "@/app/components/AdminNavbar/Index";

// Services > Main: show / hide each service on the website.
// Hiding only adds the service to a small "hidden" list - its content and project links are never changed or deleted.
const ServicesMainPage = () => {
    const [hidden, setHidden] = useState<string[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/services/visibility", { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then((json) => {
                setHidden(json?.data?.hiddenServices || []);
                setStatus("ready");
            })
            .catch(() => setStatus("error"));
    }, []);

    const toggle = async (slug: string) => {
        if (status !== "ready" || saving) return;
        const hide = !hidden.includes(slug);

        setSaving(slug);
        try {
            const res = await fetch("/api/admin/services/visibility", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, hidden: hide }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Could not update");
            setHidden(json?.data?.hiddenServices || []);
            window.dispatchEvent(new Event(SERVICE_VISIBILITY_EVENT));
            toast.success(json?.message || "Updated");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not update");
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <AdminItemContainer>
                <Label main>Services - Show / Hide on Website</Label>
                <div className="p-5 flex flex-col gap-1">
                    <p className="text-sm text-black/60 mb-3">
                        Click the eye to hide a service from the whole website. Hidden services stay editable in the admin and
                        nothing is deleted - click again to show it.
                    </p>

                    {status === "loading" && <p className="text-black/60">Loading...</p>}
                    {status === "error" && (
                        <p className="text-red-600">Could not load the current status. Please refresh - nothing has been changed.</p>
                    )}

                    {status === "ready" &&
                        SERVICE_REGISTRY.map((service) => {
                            const isHidden = hidden.includes(service.slug);
                            const busy = saving === service.slug;
                            return (
                                <div
                                    key={service.slug}
                                    className="flex items-center justify-between border border-black/20 rounded-md shadow-sm p-3"
                                >
                                    <div className="flex flex-col">
                                        <Link href={service.adminHref} className={`font-medium hover:underline ${isHidden ? "text-black/40" : ""}`}>
                                            {service.name}
                                        </Link>
                                        <span className={`text-xs ${isHidden ? "text-red-600" : "text-green-700"}`}>
                                            {isHidden ? "Hidden on website" : "Visible on website"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toggle(service.slug)}
                                        disabled={!!saving}
                                        title={isHidden ? "Show on website" : "Hide from website"}
                                        aria-label={isHidden ? `Show ${service.name} on website` : `Hide ${service.name} from website`}
                                        className="p-2 rounded-full border border-black/20 hover:bg-black/5 disabled:opacity-40 cursor-pointer"
                                    >
                                        {busy ? "..." : isHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </AdminItemContainer>
        </div>
    );
};

export default ServicesMainPage;
