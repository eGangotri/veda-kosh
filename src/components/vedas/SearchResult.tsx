"use client"

import React from "react"
import { useEffect, useState } from "react"
import { TextField, Button, Typography, Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useVedaSearch } from "@/hooks/use-hook-search"
import { INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/utils/Utils"
import { COMBO_RESULT_COLUMNS } from "../Utils"
import { SearchParams } from "@/types/common"

export const SearchResultPage: React.FC<{ 
    searchTerm: string,
    initialSearchParams?: SearchParams 
}> = ({ searchTerm, initialSearchParams = {} }) => {
    const [inputTerm, setInputTerm] = useState(searchTerm)
    const [searchQuery, setSearchQuery] = useState(searchTerm)
    const { results, isLoading } = useVedaSearch(searchQuery, initialSearchParams)

    const handleSearch = () => {
        setSearchQuery(inputTerm) // This will trigger the useVedaSearch hook
    }

    useEffect(() => {
        console.log(`results: ${JSON.stringify(results)}`)
        console.log(`initialSearchParams: ${JSON.stringify(initialSearchParams)}`)
    }, [results, initialSearchParams])

    const rows = results

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
                    <DataGrid
                        rows={rows}
                        columns={COMBO_RESULT_COLUMNS}
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
