import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";


/***
 * 
  Set GA service account env vars
In your GA / GCP setup:

Create a service account in Google Cloud.
Grant it access to your GA4 property (add its email as a user with at least Read & Analyze).
Create a JSON key for that service account.


 * 
 */

type GaStatsResponse = {
    pageViews: number;
    uniqueVisitors: number;
};

const propertyId = process.env.GA_PROPERTY_ID;
const clientEmail = process.env.GA_CLIENT_EMAIL;
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n");

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient {
    if (!propertyId || !clientEmail || !privateKey) {
        throw new Error("GA credentials are not fully configured in environment variables");
    }

    if (!analyticsDataClient) {
        analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });
    }

    return analyticsDataClient;
}

export async function GET(): Promise<NextResponse<GaStatsResponse | { error: string }>> {
    try {
        const client = getClient();

        const [report] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: "2025-01-01",
                    endDate: "today",
                },
            ],
            metrics: [
                { name: "screenPageViews" },
                { name: "totalUsers" },
            ],
        });

        const row = report.rows?.[0];
        const metrics = row?.metricValues ?? [];

        const pageViews = Number(metrics[0]?.value ?? 0);
        const uniqueVisitors = Number(metrics[1]?.value ?? 0);

        return NextResponse.json({
            pageViews,
            uniqueVisitors,
        });
    } catch (error) {
        console.error("GA stats error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch GA stats",
                pageViews: 0,
                uniqueVisitors: 0,
            } as any,
            { status: 500 }
        );
    }
}

