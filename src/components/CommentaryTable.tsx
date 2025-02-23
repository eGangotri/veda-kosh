"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, GridActionsCellItem } from "@mui/x-data-grid"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import type { Commentary } from "@/types/Commentary"
import { getVedaNameByVedaId } from "@/utils/Utils"
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material"

interface CommentaryTableProps {
  commentaries: Commentary[]
  onEdit: (commentary: Commentary) => void
  onDelete: (id: string) => void
}

const CommentaryTable: React.FC<CommentaryTableProps> = ({ commentaries, onEdit, onDelete }) => {
  const [filteredCommentaries, setFilteredCommentaries] = useState<Commentary[]>(commentaries)
  const [filters, setFilters] = useState({
    veda: "",
    commentaryName: "",
    commentator: "",
    language: "",
  })

  useEffect(() => {
    applyFilters()
  }, [commentaries, filters])

  const applyFilters = () => {
    let filtered = commentaries
    if (filters.veda) {
      filtered = filtered.filter((c) => getVedaNameByVedaId(c.VedaId) === filters.veda)
    }
    if (filters.commentaryName) {
      filtered = filtered.filter((c) => c.Commentary_Name.toLowerCase().includes(filters.commentaryName.toLowerCase()))
    }
    if (filters.commentator) {
      filtered = filtered.filter((c) => c.Commentator.toLowerCase().includes(filters.commentator.toLowerCase()))
    }
    if (filters.language) {
      filtered = filtered.filter((c) => c.Language === filters.language)
    }
    setFilteredCommentaries(filtered)
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target
    setFilters((prev) => ({ ...prev, [name as string]: value }))
  }

  const resetFilters = () => {
    setFilters({
      veda: "",
      commentaryName: "",
      commentator: "",
      language: "",
    })
  }

  const columns: GridColDef[] = [
    {
      field: "VedaId",
      headerName: "Veda",
      width: 130,
      renderCell: (params) => <strong>{getVedaNameByVedaId(params.value)}</strong>,
    },
    { field: "Commentary_Name", headerName: "Commentary Name", width: 200 },
    { field: "Commentator", headerName: "Commentator", width: 150 },
    { field: "Language", headerName: "Language", width: 130 },
    {
      field: "Mantra_Commented_Count",
      headerName: "Mantra Commented Count",
      type: "number",
      width: 200,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => onEdit(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => onDelete(row._id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  const uniqueVedas = Array.from(new Set(commentaries.map((c) => getVedaNameByVedaId(c.VedaId))))
  const uniqueLanguages = Array.from(new Set(commentaries.map((c) => c.Language)))

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Veda</InputLabel>
          <Select sx={{minWidth:100}} value={filters.veda} onChange={handleFilterChange} label="Veda" name="veda">
            <MenuItem value="" selected>Choose</MenuItem>
            {uniqueVedas.map((veda) => (
              <MenuItem key={veda} value={veda}>
                {veda}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Commentary Name"
          variant="outlined"
          size="small"
          name="commentaryName"
          value={filters.commentaryName}
          onChange={handleFilterChange}
        />
        <TextField
          label="Commentator"
          variant="outlined"
          size="small"
          name="commentator"
          value={filters.commentator}
          onChange={handleFilterChange}
        />
        <FormControl variant="outlined" size="small">
          <InputLabel>Language</InputLabel>
          <Select sx={{minWidth:120}} value={filters.language} onChange={handleFilterChange} label="Language" name="language">
            <MenuItem value="" selected>All</MenuItem>
            {uniqueLanguages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={resetFilters}>
          Reset
        </Button>
      </Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredCommentaries}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      </div>
    </Box>
  )
}

export default CommentaryTable

