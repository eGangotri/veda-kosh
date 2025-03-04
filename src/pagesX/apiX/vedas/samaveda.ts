import { NextApiRequest, NextApiResponse } from "next";
import type { SamaVeda } from "@/types/vedas";
import type { Collection } from "mongodb";
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "@/app/api/lib/utils";
import { ITEM_LIMIT, SAMA_VEDA } from "@/app/api/lib/consts";

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

        // Add numeric filters
        addNumberFilter<SamaVeda>(archik_no, "archik_no", queryObj);
        addNumberFilter<SamaVeda>(prapathak, "prapathak", queryObj);
        addNumberFilter<SamaVeda>(ardh_prapathak, "ardh_prapathak", queryObj);
        addNumberFilter<SamaVeda>(dashti_no, "dashti_no", queryObj);
        addNumberFilter<SamaVeda>(mantra_no, "mantra_no", queryObj);
        addNumberFilter<SamaVeda>(adhyay_no, "adhyay_no", queryObj);
        addNumberFilter<SamaVeda>(khand_no, "khand_no", queryObj);
        addNumberFilter<SamaVeda>(mantra2_no, "mantra2_no", queryObj);
        addNumberFilter<SamaVeda>(mantra_sankhya, "mantra_sankhya", queryObj);

        // Add text search filters
        addTextFilter<SamaVeda>(mantra_ref_id, "mantra_ref_id", queryObj);
        addTextFilter<SamaVeda>(archik_name, "archik_name", queryObj);
        addTextFilter<SamaVeda>(kand_name, "kand_name", queryObj);
        addTextFilter<SamaVeda>(gaan, "gaan", queryObj);
        addTextFilter<SamaVeda>(gaan_parva, "gaan_parva", queryObj);
        addTextFilter<SamaVeda>(devata, "devata", queryObj);
        addTextFilter<SamaVeda>(rishi, "rishi", queryObj);
        addTextFilter<SamaVeda>(chhanda, "chhanda", queryObj);
        addTextFilter<SamaVeda>(swara, "swara", queryObj);
        addTextFilter<SamaVeda>(mantra, "mantra", queryObj);
        addTextFilter<SamaVeda>(mantra_swara, "mantra_swara", queryObj);
        addTextFilter<SamaVeda>(mantra_pad, "mantra_pad", queryObj);
        addTextFilter<SamaVeda>(mantra_pad_swara, "mantra_pad_swara", queryObj);

        // Perform the query
        const result: SamaVeda[] = await collection.find(queryObj).limit(ITEM_LIMIT).toArray();

        res.status(200).json({ message: "Data fetched successfully", data: result });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching data from the database" });
    }
}