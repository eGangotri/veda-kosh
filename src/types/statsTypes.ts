export interface SuktaStats {
    suktaNo: number;
    mantraCount: number;
}

export interface RigVedaMandalaStats {
    mandalaNo: number;
    suktaCount: number;
    suktas: SuktaStats[];
    totalMantraCount: number;
}

export interface RigVedaMantraAshtakStats {
    mantra2_no: number;
    count: number;
}

export interface RigVedaVargaStats {
    varga_no: number;
    mantraCount: number;
    mantras: RigVedaMantraAshtakStats[];
}

export interface RigVedaAdhyayStats {
    adhyay_no: number;
    vargaCount: number;
    vargas: RigVedaVargaStats[];
    totalMantraCount: number;
}

export interface RigVedaAshtakStats {
    ashtak_no: number;
    adhyayCount: number;
    adhyays: RigVedaAdhyayStats[];
    totalMantraCount: number;
}


export interface YajurVedaAdhyayaStats {
    adhyay_no: number;
    mantraCount: number;
    totalMantraCount: number;
}


export interface AtharvaVedaSuktaStats {
    sukta_no: number;
    mantraCount: number;
}

export interface AtharvaVedaKandStats {
    kand_no: number;
    suktas: AtharvaVedaSuktaStats[];
    totalMantraCount: number;
}

export interface SamaVedaSuktaStats {
    totalMantraCount: number;
}

export interface RigVedaInternalClassification {
    mandal_no: number;
    sukta_no: number;
    mantra_no: number;
    ashtak_no: number;
    adhyay_no: number;
    varga_no: number;
    mantra2_no: number;
    mandal2_no: number;
    anuvak_no: number;
    mantra3_no: number;
}
export interface RigVedaMantraRefIdToInternalClassfication {
    mantra_ref_id: string;
    position:number;
    correspondences: RigVedaInternalClassification
}