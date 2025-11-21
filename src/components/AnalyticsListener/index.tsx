// src/components/AnalyticsListener.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * 
 * @returns Track SPA route changes (recommended)
Because Veda Kosh is a SPA, you want page views on client-side navigation too.

Create a small client component:
 */
export function AnalyticsListener() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!pathname) return;
        const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
                page_path: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}