// import { NextRequest, NextResponse } from "next/server"
// import Commentary from "@/models/Commentary"

// export async function GET() {
//   try {
//     const commentaries = await Commentary.find({})
//     return NextResponse.json(commentaries)
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Error fetching commentaries" },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const newCommentary = new Commentary(body)
//     const savedCommentary = await newCommentary.save()
//     return NextResponse.json(savedCommentary, { status: 201 })
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Error creating commentary" },
//       { status: 400 }
//     )
//   }
// }
