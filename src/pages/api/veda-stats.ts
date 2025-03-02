import { NextApiRequest, NextApiResponse } from 'next';
import { getAtharvaVedaKandStats, 
    getRigVedaMandalaStats,
    getSamaVedaMandalaStats, 
    getYajurVedaMandalaStats } 
    from '../../analytics/stats';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { type } = req.query;
        const typeNum = type ? parseInt(type as string) : 0;

        switch (typeNum) {
            case 1: {
                const stats = await getRigVedaMandalaStats();
                res.status(200).json(stats);
                break;
            }
            case 2: {
                const stats = await getYajurVedaMandalaStats();
                res.status(200).json(stats);
                break;
            }
            case 3: {
                const stats = await getSamaVedaMandalaStats();
                res.status(200).json(stats);
                break;
            }
            case 4: {
                const stats = await getAtharvaVedaKandStats();
                res.status(200).json(stats);
                break;
            }
            default: {
                res.status(400).json({ message: "Provide a valid Veda type" });
                break;
            }
        }
    } catch (error) {
        console.error('Error fetching RigVeda stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
}
