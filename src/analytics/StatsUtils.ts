import { AtharvaVedaKandStats, AtharvaVedaSuktaStats, RigVedaAdhyayStats, RigVedaAshtakStats, RigVedaMandalaStats, RigVedaVargaStats, SuktaStats, YajurVedaAdhyayaStats } from "@/types/statsTypes";
import { RIGVEDA_ASHTAKA_STATS } from "./stats/rigVedaAshtakData";
import { RIGVEDA_MANDALA_STATS } from "./stats/rigVedaMandalaData"
import { SAMAVEDA_STATS } from "./stats/samaVedaData";
import { YAJURVEDA_ADHYAYA_STATS } from "./stats/yajurVedaAdhyayaData";
import { ATHARVA_KAND_STATS } from "./stats/atharvaData";

const getMandala = (mandalaNo: number) => {
    return RIGVEDA_MANDALA_STATS.find((mandala: RigVedaMandalaStats) => mandala.mandalaNo === mandalaNo);
}
export const getSuktaCountInMandalaForRigVeda = (mandalaNo: number) => {
    const mandala = getMandala(mandalaNo);
    return mandala?.suktaCount;
}

export const getMantraCountInSuktaForRigVeda = (mandalaNo: number, suktaNo: number) => {
    const mandala = getMandala(mandalaNo);
    const sukta = mandala?.suktas.find((sukta: SuktaStats) => sukta.suktaNo === suktaNo);
    return sukta?.mantraCount;
}

export const getTotalMantraCountInMandalaForRigVeda = (mandalaNo: number) => {
    const mandala = getMandala(mandalaNo);
    return mandala?.totalMantraCount;
}

const getAshtaka = (ashtakaNo: number) => {
    return RIGVEDA_ASHTAKA_STATS.find((ashtaka: RigVedaAshtakStats) => ashtaka.ashtak_no === ashtakaNo);
}
export const getAdhyayaCountInAshtakaForRigVeda = (ashtakaNo: number) => {
    const ashtaka:RigVedaAshtakStats|undefined = getAshtaka(ashtakaNo);
    return ashtaka?.adhyayCount;
}

export const getVargaCountInAshtakaForRigVeda = (ashtakaNo: number, adhyayaNo: number) => {
    const ashtaka:RigVedaAshtakStats|undefined = getAshtaka(ashtakaNo);
    const adhyaya = ashtaka?.adhyays.find((adhyaya: RigVedaAdhyayStats) => adhyaya.adhyay_no === adhyayaNo);
    console.log(
        `ashtakaNo ${ashtakaNo}, adhyayaNo ${adhyayaNo},     vargaCount ${adhyaya?.vargaCount}`
    );
    return adhyaya?.vargaCount;
}

export const getMantraCountInVargaForRigVeda = (ashtakaNo: number, adhyayaNo: number, vargaNo: number) => {
    const ashtaka = getAshtaka(ashtakaNo);
    const adhyaya = ashtaka?.adhyays.find((adhyaya: RigVedaAdhyayStats) => adhyaya.adhyay_no === adhyayaNo);
    const varga = adhyaya?.vargas.find((varga: RigVedaVargaStats) => varga.varga_no === vargaNo);
    return varga?.mantraCount;
}

export const getTotalMantraCountInAshtakaForRigVeda = (ashtakaNo: number) => {
    const ashtaka = getAshtaka(ashtakaNo);
    return ashtaka?.totalMantraCount;
}

export const getTotalMantraCountForSamaVeda = () => {
    return SAMAVEDA_STATS.totalMantraCount;
}

export const getMantraCountInYajurvedaByAdhyaya = (adhyayaNo: number) => {
    return YAJURVEDA_ADHYAYA_STATS.find((adhyaya: YajurVedaAdhyayaStats) => adhyaya.adhyay_no === adhyayaNo)?.mantraCount || 0;
}


export function getMantraCountInAtharvavedaBySukta(
    kandNo: number,
    suktNo: number
): number {
    return ATHARVA_KAND_STATS.find((kand: AtharvaVedaKandStats) => kand.kand_no === kandNo)?.suktas.find((sukta: AtharvaVedaSuktaStats) => suktNo === suktNo)?.mantraCount || 0;
}

export function getSuktaCountInAtharvavedaByKand(
    kandNo: number
): number {
    return ATHARVA_KAND_STATS.find((kand: AtharvaVedaKandStats) => kand.kand_no === kandNo)?.suktas.length || 0;
}
