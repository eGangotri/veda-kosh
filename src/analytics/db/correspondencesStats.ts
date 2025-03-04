import { Collection } from 'mongodb';
import { getVedaKoshaDB } from '@/app/api/lib/utils';
import { RigVedaMantraRefIdToInternalClassfication } from '@/types/statsTypes';
import { RigVeda } from '@/types/vedas';
import { RIG_VEDA } from '@/app/api/lib/consts';


export async function getRigVedaCorrespondencesStats(): Promise<RigVedaMantraRefIdToInternalClassfication[]> {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA);

    const correspondences = await collection.find({}, {
        projection: {
            mantra_ref_id: 1,
            mandal_no: 1,
            sukta_no: 1,
            mantra_no: 1,
            ashtak_no: 1,
            adhyay_no: 1,
            varga_no: 1,
            mantra2_no: 1,
            mandal2_no: 1,
            anuvak_no: 1,
            mantra3_no: 1
        }
    }).toArray();

    return correspondences.map(doc => ({
        mantra_ref_id: doc.mantra_ref_id,
        correspondences: {
            mandal_no: doc.mandal_no,
            sukta_no: doc.sukta_no,
            mantra_no: doc.mantra_no,
            ashtak_no: doc.ashtak_no,
            adhyay_no: doc.adhyay_no,
            varga_no: doc.varga_no,
            mantra2_no: doc.mantra2_no,
            mandal2_no: doc.mandal2_no,
            anuvak_no: doc.anuvak_no,
            mantra3_no: doc.mantra3_no
        }
    }));
}
