import { RigVedaMantraRefIdToInternalClassfication } from "@/types/statsTypes";
import { CORRESPONDENCES_STATS } from "./stats/correspondenceData";
import { getMantraCountInYajurvedaByAdhyaya } from "./StatsUtils";
import { YAJURVEDA_TOTAL_ADHYAYA_COUNT } from "./stats/yajurVedaAdhyayaData";
import { ATHARVA_SERIAL_NO, SAMAVEDA_SERIAL_NO, YAJURVEDA_SERIAL_NO } from "./constants";

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

export function findCorrespondenceByPosition(
    position: number
): RigVedaMantraRefIdToInternalClassfication | undefined {
    return CORRESPONDENCES_STATS.find(item => {
        return item.position === position;
    });
}

export function findCorrespondenceByMandalaSystem(
    mandalaNo: number,
    suktaNo: number,
    mantraNo: number
): RigVedaMantraRefIdToInternalClassfication | undefined {
    return CORRESPONDENCES_STATS.find(item => {
        const corr = item.correspondences;
        return corr.mandal_no === mandalaNo &&
            corr.sukta_no === suktaNo &&
            corr.mantra_no === mantraNo;
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

export function findMantraRefIdByMandalaCorrespondences(
    mandalaNo: number,
    suktaNo: number,
    mantraNo: number
): string | undefined {
    const corr = findCorrespondenceByMandalaSystem(mandalaNo, suktaNo, mantraNo);
    console.log(`corr: ${JSON.stringify(corr)}`);
    return corr?.mantra_ref_id;
}

export function findNextMantraByMandala(
    mandalaNo: number,
    suktaNo: number,
    mantraNo: number
): string | undefined {
    const corr = findCorrespondenceByMandalaSystem(mandalaNo, suktaNo, mantraNo);
    console.log(`findNextMantraByMandala: ${mandalaNo} ${suktaNo} ${mantraNo} ${JSON.stringify(corr)}`);
    if (corr?.position) {
        return findCorrespondenceByPosition(corr?.position + 1)?.mantra_ref_id || undefined;
    }
    else return undefined;
}

export function findPrevMantraByMandala(
    mandalaNo: number,
    suktaNo: number,
    mantraNo: number
): string | undefined {
    const corr = findCorrespondenceByMandalaSystem(mandalaNo, suktaNo, mantraNo);
    if (corr?.position && corr?.position > 1) {
        return findCorrespondenceByPosition(corr?.position - 1)?.mantra_ref_id || undefined;
    }
    else return undefined;
}




export function findNextYajurvedaMantraByAdhyaya(
    adhyayaNo: number,
    mantraNo: number
): string {
    const mantraCount = getMantraCountInYajurvedaByAdhyaya(adhyayaNo);
    if (mantraNo >= mantraCount) {
        if (adhyayaNo < YAJURVEDA_TOTAL_ADHYAYA_COUNT) {
            return `2/${adhyayaNo + 1}/1`;
        }
        else {
            return '2-0-0';
        }
    }
    else {
        return `${YAJURVEDA_SERIAL_NO}/${adhyayaNo}/${mantraNo + 1}`;
    }
}

export function findPrevYajurvedaMantraByAdhyaya(
    adhyayaNo: number,
    mantraNo: number
): string {
    if (mantraNo === 1) {
        if (adhyayaNo > 1) {
            const mantraCount = getMantraCountInYajurvedaByAdhyaya(adhyayaNo);
            return `2/${adhyayaNo - 1}/${mantraCount}`;
        }
        else {
            return '2/0/0';
        }
    }
    else {
        return `2/${adhyayaNo}/${mantraNo - 1}`;
    }
}

export function findNextAtharvavedaMantraByAdhyaya(
    kandNo: number,
    suktaNo: number,
    mantraNo: number
): string {
    return `${ATHARVA_SERIAL_NO}-${kandNo}-${suktaNo}-${mantraNo}`
}

export function findPrevAtharvavedaMantraByAdhyaya(
    kandNo: number,
    suktaNo: number,
    mantraNo: number
): string {
    return `${ATHARVA_SERIAL_NO}-${kandNo}-${suktaNo}-${mantraNo}`
}

export const TOTAL_MANTRAS_IN_SAMAVED = 1875

export function findNextSamaVedaMantra(
    mantraNo: number
): string {
    if (mantraNo < TOTAL_MANTRAS_IN_SAMAVED) {
        return `${SAMAVEDA_SERIAL_NO}/${mantraNo + 1}`;
    }
    else {
        return `${SAMAVEDA_SERIAL_NO}-0`;
    }
}

export function findPrevSamaVedaMantra(
    mantraNo: number
): string {
    if (mantraNo === 1) {
        return `${SAMAVEDA_SERIAL_NO}/0`;
    }
    else {
        return `${SAMAVEDA_SERIAL_NO}/${mantraNo - 1}`;
    }
}

