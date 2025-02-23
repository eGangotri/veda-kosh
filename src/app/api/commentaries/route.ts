import { type NextRequest, NextResponse } from "next/server"
import Commentary from "@/models/Commentary"
import connectToDatabase from "@/utils/mongoose"

export async function GET() {
  await connectToDatabase()
  try {
    const commentaries = await Commentary.find({})
    return NextResponse.json(commentaries)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching commentaries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await connectToDatabase()
  try {
    const body = await request.json()
    const newCommentary = new Commentary(body)
    const savedCommentary = await newCommentary.save()
    return NextResponse.json(savedCommentary, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating commentary" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  await connectToDatabase()
  try {
    const id = request.nextUrl.searchParams.get("id")
    const body = await request.json()
    const updatedCommentary = await Commentary.findByIdAndUpdate(id, body, { new: true })
    if (updatedCommentary) {
      return NextResponse.json(updatedCommentary)
    } else {
      return NextResponse.json({ error: "Commentary not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Error updating commentary" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  await connectToDatabase()
  try {
    const id = request.nextUrl.searchParams.get("id")
    const deletedCommentary = await Commentary.findByIdAndDelete(id)
    if (deletedCommentary) {
      return NextResponse.json({ message: "Commentary deleted successfully" })
    } else {
      return NextResponse.json({ error: "Commentary not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Error deleting commentary" }, { status: 400 })
  }
}

