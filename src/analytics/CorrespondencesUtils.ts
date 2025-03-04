import { RigVedaMantraRefIdToInternalClassfication } from "@/types/statsTypes";
import { CORRESPONDENCES_STATS } from "./stats/correspondenceData";

export function findCorrespondenceByAshtakSystem(
    ashtakNo: number,
    adhyayNo: number,
    vargaNo: number,
    mantra2No: number
): RigVedaMantraRefIdToInternalClassfication | undefined {
    return CORRESPONDENCES_STATS.find(item => {
        const corr = item.correspondences;
        return corr.ashtak_no === ashtakNo &&
               corr.adhyay_no === adhyayNo &&
               corr.varga_no === vargaNo &&
               corr.mantra2_no === mantra2No;
    });
}

export function findMantraRefIdByAshtakCorrespondences(
    ashtakNo: number,
    adhyayNo: number,
    vargaNo: number,
    mantra2No: number
): string | undefined {
    const corr = findCorrespondenceByAshtakSystem(ashtakNo, adhyayNo, vargaNo, mantra2No);
    return corr?.mantra_ref_id;
}
