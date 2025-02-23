import type { NextApiRequest, NextApiResponse } from "next"
import mongoose from "mongoose"
import type { Commentary } from "../../types/Commentary"

// Connect to MongoDB (you should use environment variables for the connection string)
mongoose.connect("mongodb://localhost:27017/your_database_name")

// Create a Mongoose model based on the Commentary interface
const CommentaryModel = mongoose.model<Commentary & mongoose.Document>(
  "Commentary",
  new mongoose.Schema({
    VedaId: { type: String, required: true },
    Commentary_Name: { type: String, required: true },
    Commentator: { type: String, required: true },
    Language: { type: String, required: true },
    Description: String,
    Mantra_Commented_Count: { type: Number, required: true },
  }),
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const commentaries = await CommentaryModel.find()
        res.status(200).json(commentaries)
      } catch (error) {
        res.status(500).json({ error: "Error fetching commentaries" })
      }
      break

    case "POST":
      try {
        const newCommentary = new CommentaryModel(req.body)
        await newCommentary.save()
        res.status(201).json(newCommentary)
      } catch (error) {
        res.status(400).json({ error: "Error creating commentary" })
      }
      break

    case "PUT":
      try {
        const { id } = req.query
        const updatedCommentary = await CommentaryModel.findByIdAndUpdate(id, req.body, { new: true })
        if (updatedCommentary) {
          res.status(200).json(updatedCommentary)
        } else {
          res.status(404).json({ error: "Commentary not found" })
        }
      } catch (error) {
        res.status(400).json({ error: "Error updating commentary" })
      }
      break

    case "DELETE":
      try {
        const { id } = req.query
        const deletedCommentary = await CommentaryModel.findByIdAndDelete(id)
        if (deletedCommentary) {
          res.status(200).json({ message: "Commentary deleted successfully" })
        } else {
          res.status(404).json({ error: "Commentary not found" })
        }
      } catch (error) {
        res.status(400).json({ error: "Error deleting commentary" })
      }
      break

    default:
      res.status(405).json({ error: "Method not allowed" })
  }
}

