import { type NextRequest, NextResponse } from "next/server"
import Commentary from "@/models/Commentary"
import connectToDatabase from "@/utils/mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase()
  try {
    const commentary = await Commentary.findById(params.id)
    if (commentary) {
      return NextResponse.json(commentary)
    } else {
      return NextResponse.json({ error: "Commentary not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Error fetching commentary" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase()
  try {
    const body = await request.json()
    const updatedCommentary = await Commentary.findByIdAndUpdate(params.id, body, { new: true })
    if (updatedCommentary) {
      return NextResponse.json(updatedCommentary)
    } else {
      return NextResponse.json({ error: "Commentary not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Error updating commentary" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase()
  try {
    const deletedCommentary = await Commentary.findByIdAndDelete(params.id)
    if (deletedCommentary) {
      return NextResponse.json({ message: "Commentary deleted successfully" })
    } else {
      return NextResponse.json({ error: "Commentary not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Error deleting commentary" }, { status: 400 })
  }
}

