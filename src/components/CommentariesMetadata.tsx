"use client"

import { useState, useEffect } from "react"
import { Container, Typography } from "@mui/material"
import BhashyaLanguageForm from "./BhashyaLanguageForm"
import BhashyaLanguageTable from "./BhashyaLanguageTable"
import type { BhashyaLanguage } from "../types/BhashyaLanguage"

const API_URL = "/api/bhashya-language"

export default function CommentaryMetadataView() {
  const [bhashyaLanguages, setBhashyaLanguages] = useState<BhashyaLanguage[]>([])
  const [editingBhashyaLanguage, setEditingBhashyaLanguage] = useState<BhashyaLanguage | undefined>(undefined)

  useEffect(() => {
    fetchBhashyaLanguages()
  }, [])

  const fetchBhashyaLanguages = async () => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data: BhashyaLanguage[] = await response.json()
      setBhashyaLanguages(data)
    } catch (error) {
      console.error("Error fetching bhashya languages:", error)
    }
  }

  const handleSubmit = async (bhashyaLanguage: BhashyaLanguage) => {
    try {
      const url = editingBhashyaLanguage ? `${API_URL}/${editingBhashyaLanguage._id}` : API_URL
      const method = editingBhashyaLanguage ? "PUT" : "POST"
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bhashyaLanguage),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      fetchBhashyaLanguages()
      setEditingBhashyaLanguage(undefined)
    } catch (error) {
      console.error("Error saving bhashya language:", error)
    }
  }

  const handleEdit = (bhashyaLanguage: BhashyaLanguage) => {
    setEditingBhashyaLanguage(bhashyaLanguage)
    // Scroll to the top of the page to show the form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      fetchBhashyaLanguages()
      if (editingBhashyaLanguage?._id === id) {
        setEditingBhashyaLanguage(undefined)
      }
    } catch (error) {
      console.error("Error deleting bhashya language:", error)
    }
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 3 }}>
        Bhashya Language Metadata Management
      </Typography>
      <BhashyaLanguageForm bhashyaLanguage={editingBhashyaLanguage} onSubmit={handleSubmit} />
      <BhashyaLanguageTable 
        bhashyaLanguages={bhashyaLanguages} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </Container>
  )
}
