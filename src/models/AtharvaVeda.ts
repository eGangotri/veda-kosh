import { ATHARVA_VEDA, RIG_VEDA } from "@/app/api/consts";
import { Schema, model, models, Document, Model } from "mongoose";

import type { AtharvaVeda as AtharvedaType } from "@/types/vedas";

export interface AtharvaVeda extends AtharvedaType, Document { }

const AtharvaVedaSchema = new Schema<AtharvaVeda>({
    mantra_ref_id: { type: String, required: true },
    mantra: { type: String, required: true },
    mantra_swara: { type: String, required: true },
    mantra_pad: { type: String, required: true },
    mantra_pad_swara: { type: String, required: true },
    kand_no: { type: Number, required: true },
    sukta_no: { type: Number, required: true },
    mantra_no: { type: Number, required: true },
    devata: { type: String, required: true },
    rishi: { type: String, required: true },
    chhanda: { type: String, required: true },
    suktam: { type: String, required: true },
},
    {
        collection: ATHARVA_VEDA,
    });

//export const RigVedaModel = model<RigVeda>(RIG_VEDA, RigVedaSchema);
export const RigVedaModel: Model<AtharvaVeda> = models[ATHARVA_VEDA] || model<AtharvaVeda>(ATHARVA_VEDA, AtharvaVedaSchema);
