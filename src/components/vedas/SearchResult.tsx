"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { TextField, Button, Typography, Box } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef, type GridRowsProp } from "@mui/x-data-grid"
import { Veda, VedicMantraResult } from "@/types/vedas"
import { useVedaSearch } from "@/hooks/use-hook-search"
import { getVedaNameByVedaId, getVedaPathNameByVedaId, INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS, slashToDash } from "@/utils/Utils"
import Link from "next/link"

export const columns: GridColDef<VedicMantraResult>[] = [
    {
        field: "vedaType", headerName: "Veda", width: 130, flex: 1,
        renderCell: (params: GridCellParams) => (
            <Link href={`/vedas/${getVedaPathNameByVedaId(params.row.vedaType)}`}>{getVedaNameByVedaId(params.row.vedaType)}</Link>
        )
    },
    {
        field: "mantra_ref_id",
        headerName: "Reference ID",
        width: 150,
        flex: 1,
        renderCell: (params: GridCellParams) => (
            <Link href={`/vedas/mantraPage?mantraRefId=${slashToDash(params.row.mantra_ref_id)}`}>{params.row.mantra_ref_id}</Link>
        )

    },
    { field: "mantra", headerName: "Mantra", width: 200, flex: 2 },
    { field: "mantra_swara", headerName: "Mantra Swara", width: 150, flex: 1 },
    { field: "mantra_pad", headerName: "Mantra Pad", width: 150, flex: 1 },
    { field: "mantra_pad_swara", headerName: "Mantra Pad Swara", width: 180, flex: 1 },
    { field: "mantra_no", headerName: "Mantra No.", type: "number", width: 130, flex: 1 },
    { field: "adhyay_no", headerName: "Adhyay No.", type: "number", width: 130, flex: 1 },
    { field: "devata", headerName: "Devata", width: 130, flex: 1 },
    { field: "rishi", headerName: "Rishi", width: 130, flex: 1 },
    { field: "chhanda", headerName: "Chhanda", width: 130, flex: 1 },
    { field: "swara", headerName: "Swara", width: 130, flex: 1 },
]

export const SearchResultPage: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
    const [inputTerm, setInputTerm] = useState(searchTerm)
    const [searchQuery, setSearchQuery] = useState(searchTerm)
    const { results, isLoading } = useVedaSearch(searchQuery)

    const handleSearch = () => {
        console.log(`searchQuery: ${searchQuery}`)
        console.log(`inputTerm: ${inputTerm}`)
        setSearchQuery(inputTerm) // This will trigger the useVedaSearch hook
    }

    useEffect(() => {
        console.log(`results: ${JSON.stringify(results)}`)
    }, [results])

    const rows: GridRowsProp<VedicMantraResult> = results

    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Search Results
            </Typography>
            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <TextField
                    fullWidth
                    value={inputTerm}
                    onChange={(e) => setInputTerm(e.target.value)}
                    placeholder="Search Vedas..."
                    variant="outlined"
                />
                <Button
                    onClick={handleSearch}
                    variant="contained"
                    disabled={isLoading}
                >
                    {isLoading ? "Searching..." : "Search"}
                </Button>
            </Box>
            <Button variant="outlined" sx={{ mb: 2 }}>
                Advanced Search
            </Button>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Box sx={{ height: 400, width: "100%" }}>
                    <DataGrid<VedicMantraResult>
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: INITIAL_PAGE_SIZE },
                            },
                        }}
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                        getRowId={(row) => row.mantra_ref_id}
                    />
                </Box>
            )}
        </Box>
    )
}
