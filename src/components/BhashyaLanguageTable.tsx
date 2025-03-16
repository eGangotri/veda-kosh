"use client"

import type React from "react"
import { DataGrid, type GridColDef, GridActionsCellItem } from "@mui/x-data-grid"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import type { BhashyaLanguage } from "@/types/BhashyaLanguage"
import { Box, Paper, Typography } from "@mui/material"

interface BhashyaLanguageTableProps {
  bhashyaLanguages: BhashyaLanguage[]
  onEdit: (bhashyaLanguage: BhashyaLanguage) => void
  onDelete: (id: string) => void
}

const BhashyaLanguageTable: React.FC<BhashyaLanguageTableProps> = ({ bhashyaLanguages, onEdit, onDelete }) => {
  const columns: GridColDef[] = [
    { 
      field: "bhashya_name", 
      headerName: "Bhashya Name", 
      width: 300,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}
          onClick={() => onEdit(params.row)}
        >
          {params.value}
        </div>
      ),
    },
    { field: "bhashya_name_(eng)", headerName: "Bhashya Name (English)", width: 300 },
    { field: "author", headerName: "Author", width: 200 },
    { field: "author_name_english", headerName: "Author Name (English)", width: 200 },
    { field: "language", headerName: "Language", width: 150 },
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

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Bhashya Language Metadata
      </Typography>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={bhashyaLanguages}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row._id || Math.random().toString()}
        />
      </Box>
    </Paper>
  )
}

export default BhashyaLanguageTable
