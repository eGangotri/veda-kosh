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
