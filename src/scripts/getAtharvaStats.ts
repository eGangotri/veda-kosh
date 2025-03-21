import { getAtharvaVedaKandStats } from "@/analytics/db/mandalaStats";

async function main() {
    try {
        const stats = await getAtharvaVedaKandStats();
        console.log(JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
