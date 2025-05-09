"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
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
import { DataGrid, GridCellParams, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS, slashToDash } from "@/utils/Utils"
import Link from "next/link"

interface SamaVeda {
  _id: {
    $oid: string
  }
  mantra_ref_id: string
  mantra: string
  mantra_swara: string
  mantra_pad: string
  mantra_pad_swara: string
  archik_name: string
  archik_no: number
  prapathak: number
  ardh_prapathak: number
  dashti_no: number
  mantra_no: number
  adhyay_no: number
  khand_no: number
  mantra2_no: number
  mantra_sankhya: number
  kand_name: string
  gaan: string
  gaan_parva: string
  devata: string
  rishi: string
  chhanda: string
  swara: string
}

interface Filters {
  archik_no: string
  prapathak: string
  ardh_prapathak: string
  dashti_no: string
  mantra_no: string
  adhyay_no: string
  khand_no: string
  mantra2_no: string
  devata: string
  rishi: string
  chhanda: string
  swara: string
  mantra: string
  mantra_swara: string
  mantra_pad: string
  mantra_pad_swara: string
}

const SamaVedaView: React.FC = () => {
  const columns: GridColDef[] = [
    {
      field: "composite_id",
      headerName: "Archik/Prapathak/Mantra No",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <MuiLink
          href={`/vedas/mantra/${slashToDash(params.row.mantra_ref_id)}`}
          underline="hover"
        >
          {params.row.archik_no}.{params.row.prapathak}.{params.row.mantra_no}
        </MuiLink>
      ),
    },
    {
      field: "composite_id2",
      headerName: "Adhyay/Khand/Mantra2 No",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          {params.row.adhyay_no}.{params.row.khand_no}.{params.row.mantra2_no}
        </Box>
      ),
    },
    {
      field: "mantra_ref_id", headerName: "Mantra Ref ID", width: 150,
      renderCell: (params: GridCellParams) => (
        <MuiLink
          href={`/vedas/mantra/${slashToDash(params.row.mantra_ref_id)}`}
          underline="hover"
        >
          {params.row.mandal_no}.{params.row.sukta_no}.{params.row.mantra_no}
        </MuiLink>)
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
    { field: "rishi", headerName: "Rishi", width: 150 },
    { field: "devata", headerName: "Devata", width: 150 },
    { field: "chhanda", headerName: "Chhanda", width: 150 },
    { field: "gaan", headerName: "Gaan", width: 150 },
    { field: "gaan_parva", headerName: "Gaan Parva", width: 150 },
  ]

  const [mantras, setMantras] = useState<SamaVeda[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewContent, setViewContent] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [filters, setFilters] = useState<Filters>({
    archik_no: "",
    prapathak: "",
    ardh_prapathak: "",
    dashti_no: "",
    mantra_no: "",
    adhyay_no: "",
    khand_no: "",
    mantra2_no: "",
    devata: "",
    rishi: "",
    chhanda: "",
    swara: "",
    mantra: "",
    mantra_swara: "",
    mantra_pad: "",
    mantra_pad_swara: "",
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

        const response = await fetch(`/api/vedas/samaveda?${queryParams.toString()}`)
        const data: { data: SamaVeda[] } = await response.json()
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

  const handleFilterChange = (field: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleReset = () => {
    setFilters({
      archik_no: "",
      prapathak: "",
      ardh_prapathak: "",
      dashti_no: "",
      mantra_no: "",
      adhyay_no: "",
      khand_no: "",
      mantra2_no: "",
      devata: "",
      rishi: "",
      chhanda: "",
      swara: "",
      mantra: "",
      mantra_swara: "",
      mantra_pad: "",
      mantra_pad_swara: "",
    })
  }

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sama Veda Database
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        {/* First row - number fields */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl>
            <TextField
              label="Archik No"
              type="number"
              value={filters.archik_no}
              onChange={handleFilterChange("archik_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Prapathak"
              type="number"
              value={filters.prapathak}
              onChange={handleFilterChange("prapathak")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Ardh Prapathak"
              type="number"
              value={filters.ardh_prapathak}
              onChange={handleFilterChange("ardh_prapathak")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Dashti No"
              type="number"
              value={filters.dashti_no}
              onChange={handleFilterChange("dashti_no")}
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              sx={{ width: "120px" }}
            />
          </FormControl>
        </Box>

        {/* Second row - more number fields */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
              label="Khand No"
              type="number"
              value={filters.khand_no}
              onChange={handleFilterChange("khand_no")}
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

        {/* Third row - text fields */}
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

        {/* Fourth row - mantra fields */}
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
        </Box>

        {/* Reset button */}
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
          <DataGrid<SamaVeda>
            rows={mantras}
            columns={columns}
            getRowId={(row: SamaVeda) => row.mantra_ref_id}
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

export default SamaVedaView
