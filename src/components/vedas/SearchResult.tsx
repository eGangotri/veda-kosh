"use client"

import React from "react"
import { useEffect, useState } from "react"
import { 
    TextField, 
    Button, 
    Typography, 
    Box, 
    FormControl, 
    Select, 
    MenuItem, 
    InputLabel, 
    Collapse, 
    Snackbar, 
    Alert 
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useVedaSearch } from "@/hooks/use-hook-search"
import { INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/utils/Utils"
import { COMBO_RESULT_COLUMNS } from "../Utils"
import { SearchParams } from "@/types/common"

// Define the filter interface similar to RigVedaView
interface AdvancedFilters {
    vedaType: string;
    mandal_no: string;
    sukta_no: string;
    mantra_no: string;
    ashtak_no: string;
    adhyay_no: string;
    varga_no: string;
    mantra2_no: string;
    devata: string;
    rishi: string;
    chhanda: string;
    swara: string;
    mantra: string;
    mantra_swara: string;
    mantra_pad: string;
    mantra_pad_swara: string;
    mantra_trans: string;
}

export const SearchResultPage: React.FC<{ 
    searchTerm: string,
    initialSearchParams?: SearchParams 
}> = ({ searchTerm, initialSearchParams = {} }) => {
    const [inputTerm, setInputTerm] = useState(searchTerm)
    const [searchQuery, setSearchQuery] = useState(searchTerm)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    
    // Initialize advanced filters
    const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(() => {
        // Initialize filters from URL search params if provided
        const initialFilters: AdvancedFilters = {
            vedaType: "",
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
        }

        // Apply any search params from URL
        Object.keys(initialFilters).forEach((key) => {
            const value = initialSearchParams[key]
            if (value !== undefined) {
                initialFilters[key as keyof AdvancedFilters] = Array.isArray(value) ? value[0] : value
            }
        })

        return initialFilters
    })
    
    // Combine the search term with advanced filters
    const combinedParams = { 
        ...advancedFilters,
        ...(searchQuery ? { mantra: searchQuery } : {})
    }
    
    const { results, isLoading } = useVedaSearch(searchQuery, combinedParams)

    const handleSearch = () => {
        setSearchQuery(inputTerm) // This will trigger the useVedaSearch hook
    }
    
    const handleAdvancedFilterChange = (field: keyof AdvancedFilters) => (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        setAdvancedFilters((prev) => ({
            ...prev,
            [field]: e.target.value as string,
        }))
    }
    
    const handleReset = () => {
        setAdvancedFilters({
            vedaType: "",
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
        setSnackbarMessage("Filters have been reset")
        setSnackbarOpen(true)
    }
    
    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return
        }
        setSnackbarOpen(false)
    }

    useEffect(() => {
        console.log(`results: ${JSON.stringify(results)}`)
        console.log(`initialSearchParams: ${JSON.stringify(initialSearchParams)}`)
    }, [])

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
            <Button 
                variant="outlined" 
                sx={{ mb: 2 }}
                onClick={() => setShowAdvanced(!showAdvanced)}
            >
                {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
            </Button>
            
            {/* Advanced Search Panel */}
            <Collapse in={showAdvanced}>
                <Box sx={{ 
                    p: 2, 
                    mb: 2, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 1,
                    backgroundColor: '#f5f5f5'
                }}>
                    <Typography variant="h6" gutterBottom>Advanced Filters</Typography>
                    
                    {/* Veda Type Selector */}
                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="veda-type-label">Type of Vedas</InputLabel>
                            <Select
                                labelId="veda-type-label"
                                value={advancedFilters.vedaType}
                                label="Type of Vedas"
                                onChange={(e) => handleAdvancedFilterChange("vedaType")(e as any)}
                            >
                                <MenuItem value="">ALL (Default)</MenuItem>
                                <MenuItem value="1">Rig Veda</MenuItem>
                                <MenuItem value="2">Yajur Veda</MenuItem>
                                <MenuItem value="3">Sama Veda</MenuItem>
                                <MenuItem value="4">Atharva Veda</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
                    {/* First row - Mandal/Sukta/Mantra numbering */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                        <FormControl>
                            <TextField
                                label="Mandal No"
                                type="number"
                                value={advancedFilters.mandal_no}
                                onChange={(e) => handleAdvancedFilterChange("mandal_no")(e as any)}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                sx={{ width: "120px" }}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                label="Sukta No"
                                type="number"
                                value={advancedFilters.sukta_no}
                                onChange={(e) => handleAdvancedFilterChange("sukta_no")(e as any)}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                sx={{ width: "120px" }}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                label="Mantra No"
                                type="number"
                                value={advancedFilters.mantra_no}
                                onChange={(e) => handleAdvancedFilterChange("mantra_no")(e as any)}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                sx={{ width: "120px" }}
                            />
                        </FormControl>
                    </Box>

                    {/* Second row - Ashtak system */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                        <FormControl>
                            <TextField
                                label="Ashtak No"
                                type="number"
                                value={advancedFilters.ashtak_no}
                                onChange={(e) => handleAdvancedFilterChange("ashtak_no")(e as any)}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                sx={{ width: "120px" }}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                label="Adhyay No"
                                type="number"
                                value={advancedFilters.adhyay_no}
                                onChange={(e) => handleAdvancedFilterChange("adhyay_no")(e as any)}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                sx={{ width: "120px" }}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                label="Varga No"
                                type="number"
                                value={advancedFilters.varga_no}
                                onChange={(e) => handleAdvancedFilterChange("varga_no")(e as any)}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                sx={{ width: "120px" }}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                label="Mantra2 No"
                                type="number"
                                value={advancedFilters.mantra2_no}
                                onChange={(e) => handleAdvancedFilterChange("mantra2_no")(e as any)}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                sx={{ width: "120px" }}
                            />
                        </FormControl>
                    </Box>

                    {/* Third row - devata, rishi, etc */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                        <FormControl>
                            <TextField
                                label="Devata"
                                value={advancedFilters.devata}
                                onChange={(e) => handleAdvancedFilterChange("devata")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Rishi"
                                value={advancedFilters.rishi}
                                onChange={(e) => handleAdvancedFilterChange("rishi")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Chhanda"
                                value={advancedFilters.chhanda}
                                onChange={(e) => handleAdvancedFilterChange("chhanda")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Swara"
                                value={advancedFilters.swara}
                                onChange={(e) => handleAdvancedFilterChange("swara")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                    </Box>

                    {/* Fourth row - mantra fields */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                        <FormControl>
                            <TextField
                                label="Mantra Swara"
                                value={advancedFilters.mantra_swara}
                                onChange={(e) => handleAdvancedFilterChange("mantra_swara")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Mantra Pad"
                                value={advancedFilters.mantra_pad}
                                onChange={(e) => handleAdvancedFilterChange("mantra_pad")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Mantra Pad Swara"
                                value={advancedFilters.mantra_pad_swara}
                                onChange={(e) => handleAdvancedFilterChange("mantra_pad_swara")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Mantra Translation"
                                value={advancedFilters.mantra_trans}
                                onChange={(e) => handleAdvancedFilterChange("mantra_trans")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                    </Box>

                    {/* Reset button */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleReset} 
                            sx={{ height: "40px" }}
                        >
                            Reset
                        </Button>
                    </Box>
                </Box>
            </Collapse>
            
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
            
            {/* Snackbar for notifications */}
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
