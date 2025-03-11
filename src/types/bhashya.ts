export type VedaBhashyaMap = Record<string, VedaBhashyaCommonInterface[]>;

export interface VedaBhashyaCommonInterface {
    bhashya_name: string;
    mantra_ref: string;
    विषय?: string;
    पदार्थ?: string;
    भावार्थ?: string;
    टिप्पणी?: string;
  }
  