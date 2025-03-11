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
  Link as MuiLink,
} from "@mui/material"
import {
  DataGrid,
  type GridRenderCellParams,
  type GridColDef,
  type GridCellParams,
} from "@mui/x-data-grid"
import type { RigVeda } from "../../types/vedas"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS, slashToDash } from "@/utils/Utils"
import Link from "next/link"

interface Filters {
  kand_no: string
  sukta_no: string
  mantra_no: string
  devata: string
  rishi: string
  chhanda: string
  mantra: string
  mantra_swara: string
  mantra_pad: string
  mantra_pad_swara: string
  suktam: string
  mantra_trans: string
}

const AtharvaVedaView: React.FC = () => {
  const columns: GridColDef[] = [
    {
      field: "composite_id",
      headerName: "Kand/Sukta/Mantra No",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <MuiLink
          href={`/vedas/mantra/${slashToDash(params.row.mantra_ref_id)}`}
          underline="hover"
        >
          {params.row.kand_no}.{params.row.sukta_no}.{params.row.mantra_no}
        </MuiLink>
      ),
    },
    {
      field: "mantra_ref_id",
      headerName: "Mantra Ref ID",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <MuiLink
          href={`/vedas/mantra/${slashToDash(params.row.mantra_ref_id)}`}
          underline="hover"
        >
          {params.row.mantra_ref_id}
        </MuiLink>),
    },
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
      field: "mantra_pad",
      headerName: "Mantra Pad",
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
      field: "mantra_pad_swara",
      headerName: "Mantra Pad Swara",
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
    { field: "suktam", headerName: "Suktam", width: 150 },
  ]

  const [mantras, setMantras] = useState<RigVeda[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewContent, setViewContent] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [filters, setFilters] = useState<Filters>({
    kand_no: "",
    sukta_no: "",
    mantra_no: "",
    devata: "",
    rishi: "",
    chhanda: "",
    mantra: "",
    mantra_swara: "",
    mantra_pad: "",
    mantra_pad_swara: "",
    suktam: "",
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

        const response = await fetch(`/api/vedas/atharvaveda?${queryParams.toString()}`)
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
      kand_no: "",
      sukta_no: "",
      mantra_no: "",
      devata: "",
      rishi: "",
      chhanda: "",
      mantra: "",
      mantra_swara: "",
      mantra_pad: "",
      mantra_pad_swara: "",
      suktam: "",
      mantra_trans: "",
    })
  }

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Atharva Veda Mantras
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        {/* First row - number fields */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl>
            <TextField
              label="Kand No"
              type="number"
              value={filters.kand_no}
              onChange={handleFilterChange("kand_no")}
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
              label="Suktam"
              value={filters.suktam}
              onChange={handleFilterChange("suktam")}
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
                paginationModel: { page: 0, pageSize: INITIAL_PAGE_SIZE },
              },
            }}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
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

export default AtharvaVedaView
