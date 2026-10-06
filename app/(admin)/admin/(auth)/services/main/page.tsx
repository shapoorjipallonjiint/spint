"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { Label } from "@/components/ui/label";
import { normalizeServiceOrder, SERVICE_REGISTRY, SERVICE_SLUGS } from "@/lib/serviceRegistry";
import { SERVICE_VISIBILITY_EVENT } from "@/app/components/AdminNavbar/Index";

// Services > Main: show / hide each service on the website and set the order they are listed in.
// Hiding only adds the service to a small "hidden" list and the order is a small list of service names - the service
// content and project links are never changed or deleted.
const ServicesMainPage = () => {
    const [hidden, setHidden] = useState<string[]>([]);
    // order on screen / last saved order (never saved = registry order)
    const [order, setOrder] = useState<string[]>(SERVICE_SLUGS);
    const [savedOrder, setSavedOrder] = useState<string[]>(SERVICE_SLUGS);
    const [savingOrder, setSavingOrder] = useState(false);
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
                const saved = normalizeServiceOrder(json?.data?.serviceOrder);
                setOrder(saved.length ? saved : SERVICE_SLUGS);
                setSavedOrder(saved.length ? saved : SERVICE_SLUGS);
                setStatus("ready");
            })
            .catch(() => setStatus("error"));
    }, []);

    const orderChanged = order.join() !== savedOrder.join();

    const move = (index: number, step: -1 | 1) => {
        const target = index + step;
        if (target < 0 || target >= order.length) return;
        const next = [...order];
        [next[index], next[target]] = [next[target], next[index]];
        setOrder(next);
    };

    const saveOrder = async () => {
        if (status !== "ready" || savingOrder || !orderChanged) return;
        setSavingOrder(true);
        try {
            const res = await fetch("/api/admin/services/visibility", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Could not save the order");
            const saved = normalizeServiceOrder(json?.data?.serviceOrder);
            setSavedOrder(saved.length ? saved : order);
            window.dispatchEvent(new Event(SERVICE_VISIBILITY_EVENT));
            toast.success(json?.message || "Order saved");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not save the order");
        } finally {
            setSavingOrder(false);
        }
    };

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
                <Label main>Services - Show / Hide and Order on Website</Label>
                <div className="p-5 flex flex-col gap-1">
                    <p className="text-sm text-black/60 mb-3">
                        Click the eye to hide a service from the whole website. Hidden services stay editable in the admin and
                        nothing is deleted - click again to show it. Use the arrows to change the order services are listed in
                        across the website (menus, footer, home page, project filters and project service tabs), then click
                        Save Order.
                    </p>

                    {status === "loading" && <p className="text-black/60">Loading...</p>}
                    {status === "error" && (
                        <p className="text-red-600">Could not load the current status. Please refresh - nothing has been changed.</p>
                    )}

                    {status === "ready" &&
                        order.map((slug, index) => {
                            const service = SERVICE_REGISTRY.find((s) => s.slug === slug);
                            if (!service) return null;
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
                                    <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => move(index, -1)}
                                        disabled={savingOrder || index === 0}
                                        title="Move up"
                                        aria-label={`Move ${service.name} up`}
                                        className="p-2 rounded-full border border-black/20 hover:bg-black/5 disabled:opacity-40 cursor-pointer"
                                    >
                                        <ChevronUp className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => move(index, 1)}
                                        disabled={savingOrder || index === order.length - 1}
                                        title="Move down"
                                        aria-label={`Move ${service.name} down`}
                                        className="p-2 rounded-full border border-black/20 hover:bg-black/5 disabled:opacity-40 cursor-pointer"
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </button>
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
                                </div>
                            );
                        })}

                    {status === "ready" && (
                        <div className="flex items-center justify-end gap-3 mt-3">
                            {orderChanged && <span className="text-sm text-black/60">Order changed - not saved yet</span>}
                            <button
                                type="button"
                                onClick={() => setOrder(savedOrder)}
                                disabled={!orderChanged || savingOrder}
                                className="px-4 py-2 rounded-md border border-black/20 hover:bg-black/5 disabled:opacity-40 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveOrder}
                                disabled={!orderChanged || savingOrder}
                                className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/80 disabled:opacity-40 cursor-pointer"
                            >
                                {savingOrder ? "Saving..." : "Save Order"}
                            </button>
                        </div>
                    )}
                </div>
            </AdminItemContainer>
        </div>
    );
};

export default ServicesMainPage;
