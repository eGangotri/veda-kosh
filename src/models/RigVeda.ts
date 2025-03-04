import { Schema, model, models, Document, Model } from "mongoose";

import type { RigVeda as RigVedaType } from "@/types/vedas";
import { RIG_VEDA } from  "@/lib/consts";

export interface RigVeda extends RigVedaType, Document {}

const RigVedaSchema = new Schema<RigVeda>({
  mantra_ref_id: { type: String, required: true, unique: true },
  mantra: { type: String, required: true },
  mantra_swara: { type: String, required: true },
  mantra_pad: { type: String, required: true },
  mantra_pad_swara: { type: String, required: true },
  mantra_trans: { type: String, required: true },
  mandal_no: { type: Number, required: true },
  sukta_no: { type: Number, required: true },
  mantra_no: { type: Number, required: true },
  ashtak_no: { type: Number, required: true },
  adhyay_no: { type: Number, required: true },
  varga_no: { type: Number, required: true },
  mantra2_no: { type: Number, required: true },
  mandal2_no: { type: Number, required: true },
  anuvak_no: { type: Number, required: true },
  mantra3_no: { type: Number, required: true },
  devata: { type: String, required: true },
  rishi: { type: String, required: true },
  chhanda: { type: String, required: true },
  swara: { type: String, required: true },
},
{
    collection: RIG_VEDA,
});

//export const RigVedaModel = model<RigVeda>(RIG_VEDA, RigVedaSchema);
export const RigVedaModel: Model<RigVeda> = models[RIG_VEDA] || model<RigVeda>(RIG_VEDA, RigVedaSchema);
