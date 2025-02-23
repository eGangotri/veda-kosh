"use client"

import { useState, useEffect } from "react"
import { Container, Typography, Box } from "@mui/material"
import CommentaryForm from "./CommentaryForm"
import CommentaryTable from "./CommentaryTable"
import type { Commentary } from "../types/Commentary"

const API_URL = "/api/commentaries" // Adjust this to your API endpoint

export default function CommentaryView() {
  const [commentaries, setCommentaries] = useState<Commentary[]>([])
  const [editingCommentary, setEditingCommentary] = useState<Commentary | undefined>(undefined)

  useEffect(() => {
    fetchCommentaries()
  }, [])

  const fetchCommentaries = async () => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data: Commentary[] = await response.json()
      setCommentaries(data)
    } catch (error) {
      console.error("Error fetching commentaries:", error)
    }
  }

  const handleSubmit = async (commentary: Commentary) => {
    try {
      const url = editingCommentary ? `${API_URL}/${editingCommentary._id}` : API_URL
      const method = editingCommentary ? "PUT" : "POST"
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentary),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      fetchCommentaries()
      setEditingCommentary(undefined)
    } catch (error) {
      console.error("Error saving commentary:", error)
    }
  }

  const handleEdit = (commentary: Commentary) => {
    setEditingCommentary(commentary)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      fetchCommentaries()
    } catch (error) {
      console.error("Error deleting commentary:", error)
    }
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Commentary Management
      </Typography>
      <Box mb={4}>
        <CommentaryForm commentary={editingCommentary} onSubmit={handleSubmit} />
      </Box>
      <CommentaryTable commentaries={commentaries} onEdit={handleEdit} onDelete={handleDelete} />
    </Container>
  )
}

