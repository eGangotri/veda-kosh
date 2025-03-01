import { AdhyayStats, AshtakStats, MandalaStats, SuktaStats, VargaStats } from "../types/vedas"
import { RIGVEDA_ASHTAKA_STATS } from "./rigVedaAshtak";
import { RIGVEDA_MANDALA_STATS } from "./rigVedaMandala"

const getMandala = (mandalaNo: number) => {
    return RIGVEDA_MANDALA_STATS.find((mandala: MandalaStats) => mandala.mandalaNo === mandalaNo);
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
    return RIGVEDA_ASHTAKA_STATS.find((ashtaka: AshtakStats) => ashtaka.ashtak_no === ashtakaNo);
}
export const getAdhyayaCountInAshtakaForRigVeda = (ashtakaNo: number) => {
    const ashtaka = getAshtaka(ashtakaNo);
    return ashtaka?.adhyayCount;
}

export const getVargaCountInAshtakaForRigVeda = (ashtakaNo: number, adhyayaNo: number) => {
    const ashtaka = getAshtaka(ashtakaNo);
    const adhyaya = ashtaka?.adhyays.find((adhyaya: AdhyayStats) => adhyaya.adhyay_no === adhyayaNo);
    return adhyaya?.vargaCount;
}

export const getMantraCountInVargaForRigVeda = (ashtakaNo: number, adhyayaNo: number, vargaNo: number) => {
    const ashtaka = getAshtaka(ashtakaNo);
    const adhyaya = ashtaka?.adhyays.find((adhyaya: AdhyayStats) => adhyaya.adhyay_no === adhyayaNo);
    const varga = adhyaya?.vargas.find((varga: VargaStats) => varga.varga_no === vargaNo);
    return varga?.mantraCount;
}

export const getTotalMantraCountInAshtakaForRigVeda = (ashtakaNo: number) => {
    const ashtaka = getAshtaka(ashtakaNo);
    return ashtaka?.totalMantraCount;
}
