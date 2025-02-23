"use client"

import type React from "react"
import { useEffect, useState, type ChangeEvent, useCallback } from "react"
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  FormControl,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material"
import { DataGrid, type GridRenderCellParams, type GridColDef } from "@mui/x-data-grid"
import type { RigVeda } from "../types/mantra"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import VisibilityIcon from "@mui/icons-material/Visibility"

interface Filters {
  mandal_no: string
  sukta_no: string
  mantra_no: string
  ashtak_no: string
  adhyay_no: string
  varga_no: string
  mantra2_no: string
  devata: string
  rishi: string
  chhanda: string
  swara: string
  mantra: string
  mantra_swara: string
  mantra_pad: string
  mantra_pad_swara: string
  mantra_trans: string
}

const RigVedaView: React.FC = () => {
  const columns: GridColDef[] = [
    {
      field: "composite_id",
      headerName: "Mandal/Sukta/Mantra No",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box>
            {params.row.mandal_no}.{params.row.sukta_no}.{params.row.mantra_no}
          </Box>
        )
      },
    },
    {
      field: "composite_id2",
      headerName: "Ashtak/Adhyay/Varga/Mantra No",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box>
            {params.row.ashtak_no}.{params.row.adhyay_no}.{params.row.varga_no}.{params.row.mantra2_no}
          </Box>
        )
      },
    },
    { field: "mantra_ref_id", headerName: "Mantra Ref ID", width: 150 },
    {
      field: "mantra",
      headerName: "Mantra",
      width: 300,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Typography variant="body2" noWrap style={{ marginRight: "8px" }}>
            {params.value}
          </Typography>
          <Tooltip title="Copy">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(params.value)
                handleSnackbarOpen("Copied to clipboard")
              }}
            >
              <FileCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setViewContent(params.value)
                setIsDialogOpen(true)
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "mantra_swara",
      headerName: "Mantra (Swara)",
      width: 300,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Typography variant="body2" noWrap style={{ marginRight: "8px" }}>
            {params.value}
          </Typography>
          <Tooltip title="Copy">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(params.value)
                handleSnackbarOpen("Copied to clipboard")
              }}
            >
              <FileCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setViewContent(params.value)
                setIsDialogOpen(true)
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "mantra_trans",
      headerName: "Translation",
      width: 300,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Typography variant="body2" noWrap style={{ marginRight: "8px" }}>
            {params.value}
          </Typography>
          <Tooltip title="Copy">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(params.value)
                handleSnackbarOpen("Copied to clipboard")
              }}
            >
              <FileCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setViewContent(params.value)
                setIsDialogOpen(true)
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    { field: "rishi", headerName: "Rishi", width: 150 },
    { field: "devata", headerName: "Devata", width: 150 },
    { field: "chhanda", headerName: "Chhanda", width: 150 },
  ]

  const [mantras, setMantras] = useState<RigVeda[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewContent, setViewContent] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [filters, setFilters] = useState<Filters>({
    mandal_no: "",
    sukta_no: "",
    mantra_no: "",
    ashtak_no: "",
    adhyay_no: "",
    varga_no: "",
    mantra2_no: "",
    devata: "",
    rishi: "",
    chhanda: "",
    swara: "",
    mantra: "",
    mantra_swara: "",
    mantra_pad: "",
    mantra_pad_swara: "",
    mantra_trans: "",
  })

  const handleSnackbarOpen = useCallback((message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }, [])

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  useEffect(() => {
    const fetchMantras = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value)
        })

        const response = await fetch(`/api/mantras?${queryParams.toString()}`)
        const data: { data: RigVeda[] } = await response.json()
        setMantras(data.data)
      } catch (error) {
        console.error("Error fetching mantras:", error)
        handleSnackbarOpen("Error fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchMantras()
  }, [filters, handleSnackbarOpen])

  const handleFilterChange = (field: keyof Filters) => (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleReset = () => {
    setFilters({
      mandal_no: "",
      sukta_no: "",
      mantra_no: "",
      ashtak_no: "",
      adhyay_no: "",
      varga_no: "",
      mantra2_no: "",
      devata: "",
      rishi: "",
      chhanda: "",
      swara: "",
      mantra: "",
      mantra_swara: "",
      mantra_pad: "",
      mantra_pad_swara: "",
      mantra_trans: "",
    })
  }

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Rigveda Database
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        {/* First row - existing number fields */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl>
            <TextField
              label="Mandal No"
              type="number"
              value={filters.mandal_no}
              onChange={handleFilterChange("mandal_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>

          <FormControl>
            <TextField
              label="Sukta No"
              type="number"
              value={filters.sukta_no}
              onChange={handleFilterChange("sukta_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>

          <FormControl>
            <TextField
              label="Mantra No"
              type="number"
              value={filters.mantra_no}
              onChange={handleFilterChange("mantra_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl>
            <TextField
              label="Ashtak No"
              type="number"
              value={filters.ashtak_no}
              onChange={handleFilterChange("ashtak_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>

          <FormControl>
            <TextField
              label="Adhyay No"
              type="number"
              value={filters.adhyay_no}
              onChange={handleFilterChange("adhyay_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>

          <FormControl>
            <TextField
              label="Varga No"
              type="number"
              value={filters.varga_no}
              onChange={handleFilterChange("varga_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>

          <FormControl>
            <TextField
              label="Mantra2 No"
              type="number"
              value={filters.mantra2_no}
              onChange={handleFilterChange("mantra2_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>
        </Box>

        {/* Second row - devata, rishi, etc */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl>
            <TextField
              label="Devata"
              value={filters.devata}
              onChange={handleFilterChange("devata")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Rishi"
              value={filters.rishi}
              onChange={handleFilterChange("rishi")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Chhanda"
              value={filters.chhanda}
              onChange={handleFilterChange("chhanda")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Swara"
              value={filters.swara}
              onChange={handleFilterChange("swara")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
        </Box>

        {/* Third row - mantra fields */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl>
            <TextField
              label="Mantra"
              value={filters.mantra}
              onChange={handleFilterChange("mantra")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Mantra Swara"
              value={filters.mantra_swara}
              onChange={handleFilterChange("mantra_swara")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Mantra Pad"
              value={filters.mantra_pad}
              onChange={handleFilterChange("mantra_pad")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Mantra Pad Swara"
              value={filters.mantra_pad_swara}
              onChange={handleFilterChange("mantra_pad_swara")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Mantra Translation"
              value={filters.mantra_trans}
              onChange={handleFilterChange("mantra_trans")}
              size="small"
              sx={{ width: "150px" }}
            />
          </FormControl>
        </Box>

        {/* Reset button at bottom */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={handleReset} sx={{ height: "40px" }}>
            Reset
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid<RigVeda>
            rows={mantras}
            columns={columns}
            getRowId={(row: RigVeda) => row.mantra_ref_id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
          />
        </Box>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Full Content</DialogTitle>
        <DialogContent>
          <Typography style={{ whiteSpace: "pre-wrap", maxHeight: "60vh", overflowY: "auto" }}>
            {viewContent}
          </Typography>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default RigVedaView

