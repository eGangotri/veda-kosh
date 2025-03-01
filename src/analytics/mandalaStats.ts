import { Collection } from 'mongodb';
import { RigVeda, MandalaStats, AtharvaVeda, SamaVeda, YajurVeda } from '../types/vedas';
import { ATHARVA_VEDA, RIG_VEDA, SAMA_VEDA, YAJUR_VEDA } from '../pages/api/consts';
import { getVedaKoshaDB } from '@/pages/api/Utils';
import { MONGO_GROUPING_QUERY_FOR_MANDALA } from './constants';

export async function getRigVedaMandalaStats(): Promise<MandalaStats[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA);

    const mandalaStats = await collection.aggregate<MandalaStats>(MONGO_GROUPING_QUERY_FOR_MANDALA).toArray();

    return mandalaStats;
}

export async function getYajurVedaMandalaStats(): Promise<MandalaStats[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<YajurVeda> = vedaKoshaDB.collection(YAJUR_VEDA);

    const mandalaStats = await collection.aggregate<MandalaStats>(MONGO_GROUPING_QUERY_FOR_MANDALA).toArray();

    return mandalaStats;
}

export async function getSamaVedaMandalaStats(): Promise<MandalaStats[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<SamaVeda> = vedaKoshaDB.collection(SAMA_VEDA);

    const mandalaStats = await collection.aggregate<MandalaStats>(MONGO_GROUPING_QUERY_FOR_MANDALA).toArray();

    return mandalaStats;
}

export async function getAtharvaVedaMandalaStats(): Promise<MandalaStats[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<AtharvaVeda> = vedaKoshaDB.collection(ATHARVA_VEDA);

    const mandalaStats = await collection.aggregate<MandalaStats>(MONGO_GROUPING_QUERY_FOR_MANDALA).toArray();

    return mandalaStats;
}
