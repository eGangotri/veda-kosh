export interface RigVeda {
  mantra_ref_id: string;
  mantra: string;
  mantra_swara: string;
  mantra_pad: string;
  mantra_pad_swara: string;
  mantra_trans: string;
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
  devata: string;
  rishi: string;
  chhanda: string;
  swara: string;
}

export interface YajurVeda {
  mantra_ref_id: string;
  mantra: string;
  mantra_swara: string;
  mantra_pad: string;
  mantra_pad_swara: string;
  adhyay_no: number;
  mantra_no: number;
  devata: string;
  rishi: string;
  chhanda: string;
  swara: string;
}

export interface AtharvaVeda {
  mantra_ref_id: string;
  mantra: string;
  mantra_swara: string;
  mantra_pad: string;
  mantra_pad_swara: string;
  kand_no: number;
  sukta_no: number;
  mantra_no: number;
  devata: string;
  rishi: string;
  chhanda: string;
  suktam: string;
}

export interface SamaVeda {
  mantra_ref_id: string;
  mantra: string;
  mantra_swara: string;
  mantra_pad: string;
  mantra_pad_swara: string;
  archik_name: string;
  archik_no: number;
  prapathak: number;
  ardh_prapathak: number;
  dashti_no: number;
  mantra_no: number;
  adhyay_no: number;
  khand_no: number;
  mantra2_no: number;
  mantra_sankhya: number;
  kand_name: string;
  gaan: string;
  gaan_parva: string;
  devata: string;
  rishi: string;
  chhanda: string;
  swara: string;
}

//discard
export interface VedaResultType {
  rigVedaResults: RigVeda[];
  yajurVedaResults: YajurVeda[];
  samaVedaResults: SamaVeda[];
  atharvaVedaResults: AtharvaVeda[];
}

export interface CommonVedicFields {
  mantra_ref_id: string
  mantra: string
  mantra_swara: string
  mantra_pad: string
  mantra_pad_swara: string
  mantra_no: number
  adhyay_no: number
  devata: string
  rishi: string
  chhanda: string
  swara: string
}


export type Veda = (RigVeda | YajurVeda | AtharvaVeda | SamaVeda) & {
  veda?: "Rig Veda" | "Yajur Veda" | "Sama Veda" | "Atharva Veda"
}


export type VedicMantraResult = {
  _id: string;
  mantra_ref_id: string;
  mantra: string;
  mantra_swara: string;
  mantra_pad: string;
  mantra_pad_swara: string;
  mantra_trans?: string;
  mandal_no?: number;
  sukta_no?: number;
  mantra_no: number;
  ashtak_no?: number;
  adhyay_no?: number;
  varga_no?: number;
  mantra2_no?: number;
  mandal2_no?: number;
  anuvak_no?: number;
  mantra3_no?: number;
  devata: string;
  rishi: string;
  chhanda: string;
  swara: string;
  archik_name?: string;
  archik_no?: number;
  prapathak?: number;
  ardh_prapathak?: number;
  dashti_no?: number;
  khand_no?: number;
  mantra_sankhya?: number;
  kand_name?: string;
  gaan?: string;
  gaan_parva?: string;
  suktam?: string;
  vedaType?:number;
};

export type VedicData = {
  rigVedaResults: VedicMantraResult[];
  yajurVedaResults: VedicMantraResult[];
  samaVedaResults: VedicMantraResult[];
  atharvaVedaResults: VedicMantraResult[];
};


export type VedaCallResponse = {
  message: string;
  data: VedicData;
};

