import { NextApiRequest, NextApiResponse } from 'next';
import { getRigVedaAshtakStats } from '../../analytics/ashtakStats';
import { AshtakStats } from '../../types/vedas';

type ApiResponse = AshtakStats[] | { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const stats = await getRigVedaAshtakStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching RigVeda Ashtak stats:', error);
        res.status(500).json({ message: 'Error fetching Ashtak statistics' });
    }
}
