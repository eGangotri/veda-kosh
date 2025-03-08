import { NextRequest, NextResponse } from "next/server"
import Commentary from "@/models/Commentary"

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const commentary = await Commentary.findById(context.params.id)
    if (commentary) {
      return NextResponse.json(commentary)
    } else {
      return NextResponse.json(
        { error: "Commentary not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching commentary" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updatedCommentary = await Commentary.findByIdAndUpdate(
      context.params.id,
      body,
      { new: true }
    )
    if (updatedCommentary) {
      return NextResponse.json(updatedCommentary)
    } else {
      return NextResponse.json(
        { error: "Commentary not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating commentary" },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const deletedCommentary = await Commentary.findByIdAndDelete(context.params.id)
    if (deletedCommentary) {
      return NextResponse.json({ message: "Commentary deleted successfully" })
    } else {
      return NextResponse.json(
        { error: "Commentary not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting commentary" },
      { status: 400 }
    )
  }
}
