import { Collection } from 'mongodb';
import { RigVeda, AtharvaVeda, SamaVeda, YajurVeda } from '../types/vedas';
import { ATHARVA_VEDA, RIG_VEDA, SAMA_VEDA, YAJUR_VEDA } from '../pagesX/api/consts';
import { getVedaKoshaDB } from '@/pagesX/api/Utils';
import { MONGO_GROUPING_QUERY_FOR_MANDALA } from './constants';
import { AtharvaVedaKandStats, RigVedaMandalaStats } from '@/types/statsTypes';

export async function getRigVedaMandalaStats(): Promise<RigVedaMandalaStats[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA);

    const mandalaStats = await collection.aggregate<RigVedaMandalaStats>(MONGO_GROUPING_QUERY_FOR_MANDALA).toArray();

    return mandalaStats;
}

export async function getYajurVedaMandalaStats(): Promise<RigVedaMandalaStats[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<YajurVeda> = vedaKoshaDB.collection(YAJUR_VEDA);
    const mandalaStats = await collection.aggregate<RigVedaMandalaStats>(
        [
            {
                $group: {
                    _id: "$adhyay_no",
                    mantraCount: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $group: {
                    _id: null,
                    stats: {
                        $push: {
                            adhyay_no: "$_id",
                            mantraCount: "$mantraCount",
                            totalMantraCount: { $sum: "$mantraCount" }
                        }
                    }
                }
            }
        ]
    ).toArray();

    return mandalaStats;
}

export async function getAtharvaVedaKandStats(): Promise<AtharvaVedaKandStats[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<AtharvaVeda> = vedaKoshaDB.collection(ATHARVA_VEDA);

    const kandStats = await collection.aggregate<AtharvaVedaKandStats>([
        {
            $group: {
                _id: {
                    kandNo: "$kand_no",
                    suktaNo: "$sukta_no"
                },
                mantraCount: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.kandNo",
                totalMantraCount: { $sum: "$mantraCount" },
                suktas: {
                    $push: {
                        sukta_no: "$_id.suktaNo",
                        mantraCount: "$mantraCount"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                kand_no: "$_id",
                suktas: 1,
                totalMantraCount: 1
            }
        },
        {
            $sort: { kand_no: 1 }
        }
    ]).toArray();

    return kandStats;
}
