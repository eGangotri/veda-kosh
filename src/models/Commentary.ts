import { Document, Schema } from "mongoose";

// Interface to define the structure of a Commentary document
interface ICommentary extends Document {
  VedaId: string;
  Commentary_Name: string;
  Commentator: string;
  Language: string;
  Description?: string;
  Mantra_Commented_Count: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const commentarySchema = new Schema<ICommentary>({
  VedaId: {
    type: String,
    required: true,
    trim: true
  },
  Commentary_Name: {
    type: String,
    required: true,
    trim: true
  },
  Commentator: {
    type: String,
    required: true,
    trim: true
  },
  Language: {
    type: String,
    required: true,
    trim: true
  },
  Description: {
    type: String,
    trim: true
  },
  Mantra_Commented_Count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create and export the model
const Commentary = mongoose.model<ICommentary>('Commentary', commentarySchema);

export default Commentary;