import { Collection } from 'mongodb';
import { RigVeda } from '../types/vedas';
import { RIG_VEDA } from '../pagesX/api/consts';
import { getVedaKoshaDB } from '@/pagesX/api/Utils';
import { RigVedaAshtakStats } from '@/types/statsTypes';

export async function getRigVedaAshtakStats(): Promise<RigVedaAshtakStats[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA);

    const ashtakStats = await collection.aggregate<RigVedaAshtakStats>([
        {
            $group: {
                _id: {
                    ashtak_no: "$ashtak_no",
                    adhyay_no: "$adhyay_no",
                    varga_no: "$varga_no",
                    mantra2_no: "$mantra2_no"
                },
                count: { $sum: 1 }
            }
        },
        {
            // Group by varga
            $group: {
                _id: {
                    ashtak_no: "$_id.ashtak_no",
                    adhyay_no: "$_id.adhyay_no",
                    varga_no: "$_id.varga_no"
                },
                mantras: {
                    $push: {
                        mantra2_no: "$_id.mantra2_no",
                        count: "$count"
                    }
                },
                mantraCount: { $sum: "$count" }
            }
        },
        {
            // Group by adhyay
            $group: {
                _id: {
                    ashtak_no: "$_id.ashtak_no",
                    adhyay_no: "$_id.adhyay_no"
                },
                vargas: {
                    $push: {
                        varga_no: "$_id.varga_no",
                        mantraCount: "$mantraCount",
                        mantras: "$mantras"
                    }
                },
                vargaCount: { $sum: 1 },
                totalMantraCount: { $sum: "$mantraCount" }
            }
        },
        {
            // Final group by ashtak
            $group: {
                _id: "$_id.ashtak_no",
                adhyays: {
                    $push: {
                        adhyay_no: "$_id.adhyay_no",
                        vargaCount: "$vargaCount",
                        vargas: "$vargas",
                        totalMantraCount: "$totalMantraCount"
                    }
                },
                adhyayCount: { $sum: 1 },
                totalMantraCount: { $sum: "$totalMantraCount" }
            }
        },
        {
            $project: {
                _id: 0,
                ashtak_no: "$_id",
                adhyayCount: 1,
                adhyays: 1,
                totalMantraCount: 1
            }
        },
        {
            $sort: { ashtak_no: 1 }
        }
    ]).toArray();

    return ashtakStats;
}
