import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { startingChar, page = '1', limit = '10' } = req.query;

  if (!startingChar) {
    return res.status(400).json({ message: 'Starting character is required' });
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('vedakosh'); // Adjust database name as needed

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const query = { startingCharacter: startingChar };

    const [mantras, total] = await Promise.all([
      db.collection('mantras')
        .find(query)
        .skip(skip)
        .limit(parseInt(limit as string))
        .toArray(),
      db.collection('mantras').countDocuments(query),
    ]);

    await client.close();

    return res.status(200).json({
      mantras,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error connecting to database' });
  }
}
