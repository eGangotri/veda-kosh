"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material"
import type { Commentary } from "../types/Commentary"
import { getVedaNameByVedaId } from "@/utils/Utils"

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name as string]: name === "Mantra_Commented_Count" ? Number.parseInt(value as string) || 0 : value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ "& .MuiTextField-root, & .MuiFormControl-root": { m: 1, width: "25ch" } }}
        >
            <Box>
                <FormControl required>
                    <InputLabel id="veda-id-label">Veda ID</InputLabel>
                    <Select labelId="veda-id-label" name="VedaId" value={formData.VedaId}
                        label="Veda"
                        onChange={handleChange}>
                        {[1, 2, 3, 4].map((veda) => (
                            <MenuItem key={veda} value={veda}>
                                {getVedaNameByVedaId(veda)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    required
                    name="Commentary_Name"
                    label="Commentary Name"
                    value={formData.Commentary_Name}
                    onChange={handleChange}
                />
                <TextField required name="Commentator" label="Commentator" value={formData.Commentator} onChange={handleChange} />
            </Box>
            <Box><TextField required name="Language" label="Language" value={formData.Language} onChange={handleChange} />
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
        </Box>
    )
}

export default CommentaryForm

