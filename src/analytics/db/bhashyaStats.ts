import { Collection } from 'mongodb';
import { getVedaKoshaDB } from '@/app/api/lib/utils';
import { VedaBhashyaMap, VedaBhashyaCommonInterface } from '@/types/bhashya';


// Define the return type for the function

/**
 * Retrieves Atharvaveda bhashya data from MongoDB and returns a map with bhashya_name as key
 * and the corresponding rows as values
 * @returns A map where keys are bhashya names and values are arrays of bhashya entries
 */

const BHASHYA_COLLECTIONS = ['rigveda_bhashyas', 'sama_veda_bhashyas', 'yajur_veda_bhashyas', 'atharvaveda_bhashyas'];
const getBhashyaCollection = (index: number) => {
  return BHASHYA_COLLECTIONS[index];
}
export async function getVedaBhashyas(vedaId: number): Promise<VedaBhashyaMap[]> {
  const vedaKoshaDB = await getVedaKoshaDB();
  const collection: Collection<VedaBhashyaCommonInterface> = vedaKoshaDB.collection(getBhashyaCollection(vedaId));

  // Fetch all bhashya entries
  const bhashyas = await collection.find({}).toArray();

  // Get unique bhashya names
  const uniqueBhashyaNames = [...new Set(bhashyas.map(bhashya => bhashya.bhashya_name))];
  console.log(`Total bhashyas: ${bhashyas.length}`);
  console.log(`uniqueBhashyaNames: ${uniqueBhashyaNames}`);
  // Create an array of maps, where each map contains a single bhashya_name as key
  // and the corresponding entries as value
  const bhashyaMap: VedaBhashyaMap[] = uniqueBhashyaNames.map((bhashyaName, index) => {
    const entries = bhashyas.filter(bhashya => bhashya.bhashya_name === bhashyaName);
    console.log(`(${index}/${bhashyas.length}).Adding entries for bhashya: ${bhashyaName}`);
    return { [bhashyaName]: entries };
  });

  return bhashyaMap;
}