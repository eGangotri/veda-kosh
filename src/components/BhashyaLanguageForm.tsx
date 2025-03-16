"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Button, Box, Paper, Typography } from "@mui/material"
import type { BhashyaLanguage } from "../types/BhashyaLanguage"

interface BhashyaLanguageFormProps {
  bhashyaLanguage?: BhashyaLanguage
  onSubmit: (bhashyaLanguage: BhashyaLanguage) => void
}

const initialFormData: BhashyaLanguage = {
  bhashya_name: "",
  "bhashya_name_(eng)": "",
  author: "",
  author_name_english: "",
  language: "",
}

const BhashyaLanguageForm: React.FC<BhashyaLanguageFormProps> = ({ bhashyaLanguage, onSubmit }) => {
  const [formData, setFormData] = useState<BhashyaLanguage>(initialFormData)

  useEffect(() => {
    if (bhashyaLanguage) {
      setFormData(bhashyaLanguage)
    } else {
      setFormData(initialFormData)
    }
  }, [bhashyaLanguage])

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!bhashyaLanguage) {
      setFormData(initialFormData)
    }
  }

  const handleReset = () => {
    setFormData(bhashyaLanguage || initialFormData)
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {bhashyaLanguage ? "Edit" : "Add"} Bhashya Language Metadata
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        onReset={handleReset}
        sx={{
          display: "flex",
          flexDirection: "column",
          "& .MuiTextField-root": { m: 1 },
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <TextField
            required
            name="bhashya_name"
            label="Bhashya Name"
            value={formData.bhashya_name}
            onChange={handleTextFieldChange}
            fullWidth
          />
          <TextField
            name="bhashya_name_(eng)"
            label="Bhashya Name (English)"
            value={formData["bhashya_name_(eng)"]}
            onChange={handleTextFieldChange}
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <TextField
            required
            name="author"
            label="Author"
            value={formData.author}
            onChange={handleTextFieldChange}
            fullWidth
          />
          <TextField
            name="author_name_english"
            label="Author Name (English)"
            value={formData.author_name_english}
            onChange={handleTextFieldChange}
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <TextField
            required
            name="language"
            label="Language"
            value={formData.language}
            onChange={handleTextFieldChange}
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button type="reset" variant="outlined" sx={{ m: 1 }}>
            Reset
          </Button>
          <Button type="submit" variant="contained" sx={{ m: 1 }}>
            {bhashyaLanguage ? "Update" : "Add"} Bhashya
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default BhashyaLanguageForm
