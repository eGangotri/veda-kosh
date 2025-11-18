"use client"

import { Container } from "@mui/material";
import { useEffect, useState } from "react";

export default function Footer() {
    const [year, setYear] = useState<string>("2026");
    const [uniqueVisitorCount, setUniqueVisitorCount] = useState<number>(0);
    const [pageViewCount, setPageViewCount] = useState<number>(0);
    const [totalBhashyaRecords, setTotalBhashyaRecords] = useState<number>(0);
    useEffect(() => {
        setYear(String(new Date().getFullYear()));
        setUniqueVisitorCount(1);
        setPageViewCount(100);
        setTotalBhashyaRecords(500);
    }, []);

    return (
        <footer className="bg-gray-100 py-6 mt-8">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <div className="font-bold text-blue-600">{uniqueVisitorCount}</div>
                                <div className="text-sm text-gray-600">Unique Visitors</div>
                            </div>
                            <div>
                                <div className="font-bold text-blue-600">{pageViewCount}</div>
                                <div className="text-sm text-gray-600">Page Views</div>
                            </div>
                            <div>
                                <div className="font-bold text-blue-600">{totalBhashyaRecords}</div>
                                <div className="text-sm text-gray-600">Total Bhashya Records</div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600" suppressHydrationWarning>
                            © {year} Aryasamaj Chennai | virendra@vedakosh.com
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 md:text-right">
                        Developed & Maintained by: eGangotri Digital Preservation Trust
                    </div>
                </div>
            </Container>
        </footer>
    )
}