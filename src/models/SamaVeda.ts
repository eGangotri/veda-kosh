import mongoose, { type Document, model, Model, models, Schema } from "mongoose"
import type { SamaVeda as SamaVedaType } from "@/types/vedas";
import { SAMA_VEDA } from "@/app/api/lib/consts";

export interface SamaVeda extends SamaVedaType, Document {}

// Sama Veda Schema
const SamaVedaSchema: Schema = new Schema(
  {
    mantra_ref_id: { type: String, required: true, unique: true },
    mantra: { type: String, required: true },
    mantra_swara: { type: String, required: true },
    mantra_pad: { type: String, required: true },
    mantra_pad_swara: { type: String, required: true },
    archik_name: { type: String, required: true },
    archik_no: { type: Number, required: true },
    prapathak: { type: Number, required: true },
    ardh_prapathak: { type: Number, required: true },
    dashti_no: { type: Number, required: true },
    mantra_no: { type: Number, required: true },
    adhyay_no: { type: Number, required: true },
    khand_no: { type: Number, required: true },
    mantra2_no: { type: Number, required: true },
    mantra_sankhya: { type: Number, required: true },
    kand_name: { type: String, required: true },
    gaan: { type: String, required: true },
    gaan_parva: { type: String, required: true },
    devata: { type: String, required: true },
    rishi: { type: String, required: true },
    chhanda: { type: String, required: true },
    swara: { type: String, required: true },
  },
  {
      collection: SAMA_VEDA,
  },
)

// Index for faster queries
SamaVedaSchema.index({ mantra_ref_id: 1, archik_no: 1, prapathak: 1, mantra_no: 1 })

export const SamaVedaModel: Model<SamaVeda> = models[SAMA_VEDA] || model<SamaVeda>(SAMA_VEDA, SamaVedaSchema);
