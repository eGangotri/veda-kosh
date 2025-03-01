import { NextApiRequest, NextApiResponse } from 'next';
import { getRigVedaMandalaStats } from '../../analytics/mandalaStats';
import { MandalaStats } from '../../types/vedas';

type ApiResponse = MandalaStats[] | { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const stats = await getRigVedaMandalaStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching RigVeda stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
}
