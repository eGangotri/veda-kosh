import { NextApiRequest, NextApiResponse } from "next";
import type { SamaVeda } from "@/types/vedas";
import type { Collection } from "mongodb";
import { getVedaKoshaDB } from "../Utils";
import { ITEM_LIMIT, SAMA_VEDA } from "../consts";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string; data?: SamaVeda[] }>
) {
    try {
        const vedaKoshaDB = await getVedaKoshaDB();
        const collection: Collection<SamaVeda> = vedaKoshaDB.collection(SAMA_VEDA);

        // Get query parameters
        const { query } = req;
        const mantra_ref_id = query.mantra_ref_id as string;
        const archik_name = query.archik_name as string;
        const archik_no = query.archik_no as string;
        const prapathak = query.prapathak as string;
        const ardh_prapathak = query.ardh_prapathak as string;
        const dashti_no = query.dashti_no as string;
        const mantra_no = query.mantra_no as string;
        const adhyay_no = query.adhyay_no as string;
        const khand_no = query.khand_no as string;
        const mantra2_no = query.mantra2_no as string;
        const mantra_sankhya = query.mantra_sankhya as string;
        const kand_name = query.kand_name as string;
        const gaan = query.gaan as string;
        const gaan_parva = query.gaan_parva as string;
        const devata = query.devata as string;
        const rishi = query.rishi as string;
        const chhanda = query.chhanda as string;
        const swara = query.swara as string;

        // New text search parameters
        const mantra = query.mantra as string;
        const mantra_swara = query.mantra_swara as string;
        const mantra_pad = query.mantra_pad as string;
        const mantra_pad_swara = query.mantra_pad_swara as string;

        // Build query object
        const queryObj: Record<string, any> = {};

        // Helper function to safely parse and add number filters
        const addNumberFilter = (param: string | null, field: keyof SamaVeda) => {
            if (param) {
                const value = Number.parseInt(param, 10);
                if (!isNaN(value)) {
                    queryObj[field] = value as any;
                }
            }
        };

        // Helper function to add text search filters
        const addTextFilter = (param: string | null, field: keyof SamaVeda) => {
            if (param && param.trim()) {
                queryObj[field] = { $regex: param.trim(), $options: "i" };
            }
        };

        // Add numeric filters
        addNumberFilter(archik_no, "archik_no");
        addNumberFilter(prapathak, "prapathak");
        addNumberFilter(ardh_prapathak, "ardh_prapathak");
        addNumberFilter(dashti_no, "dashti_no");
        addNumberFilter(mantra_no, "mantra_no");
        addNumberFilter(adhyay_no, "adhyay_no");
        addNumberFilter(khand_no, "khand_no");
        addNumberFilter(mantra2_no, "mantra2_no");
        addNumberFilter(mantra_sankhya, "mantra_sankhya");

        // Add text search filters
        addTextFilter(mantra_ref_id, "mantra_ref_id");
        addTextFilter(archik_name, "archik_name");
        addTextFilter(kand_name, "kand_name");
        addTextFilter(gaan, "gaan");
        addTextFilter(gaan_parva, "gaan_parva");
        addTextFilter(devata, "devata");
        addTextFilter(rishi, "rishi");
        addTextFilter(chhanda, "chhanda");
        addTextFilter(swara, "swara");
        addTextFilter(mantra, "mantra");
        addTextFilter(mantra_swara, "mantra_swara");
        addTextFilter(mantra_pad, "mantra_pad");
        addTextFilter(mantra_pad_swara, "mantra_pad_swara");

        // Perform the query
        const result: SamaVeda[] = await collection.find(queryObj).limit(ITEM_LIMIT).toArray();

        res.status(200).json({ message: "Data fetched successfully", data: result });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching data from the database" });
    }
}