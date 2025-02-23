"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Button, Box } from "@mui/material"
import type { Commentary } from "../types/Commentary"

interface CommentaryFormProps {
  commentary?: Commentary
  onSubmit: (commentary: Commentary) => void
}

const CommentaryForm: React.FC<CommentaryFormProps> = ({ commentary, onSubmit }) => {
  const [formData, setFormData] = useState<Commentary>({
    VedaId: "",
    Commentary_Name: "",
    Commentator: "",
    Language: "",
    Description: "",
    Mantra_Commented_Count: 0,
  })

  useEffect(() => {
    if (commentary) {
      setFormData(commentary)
    }
  }, [commentary])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Mantra_Commented_Count" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}>
      <TextField required name="VedaId" label="Veda ID" value={formData.VedaId} onChange={handleChange} />
      <TextField
        required
        name="Commentary_Name"
        label="Commentary Name"
        value={formData.Commentary_Name}
        onChange={handleChange}
      />
      <TextField required name="Commentator" label="Commentator" value={formData.Commentator} onChange={handleChange} />
      <TextField required name="Language" label="Language" value={formData.Language} onChange={handleChange} />
      <TextField
        name="Description"
        label="Description"
        value={formData.Description}
        onChange={handleChange}
        multiline
        rows={4}
      />
      <TextField
        required
        name="Mantra_Commented_Count"
        label="Mantra Commented Count"
        type="number"
        value={formData.Mantra_Commented_Count}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" sx={{ m: 1 }}>
        {commentary ? "Update" : "Add"} Commentary
      </Button>
    </Box>
  )
}

export default CommentaryForm

