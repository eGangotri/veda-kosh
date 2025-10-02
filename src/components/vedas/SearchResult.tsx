"use client"

import React, { useMemo, useState } from "react"
import { useEffect } from "react"
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
    vedaType: string[];
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
    const [showAdvanced, setShowAdvanced] = useState(initialSearchParams?.showAdvSearch === "true")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    // Initialize advanced filters
    const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(() => {
        // Initialize filters from URL search params if provided
        const initialFilters: AdvancedFilters = {
            vedaType: ["1", "2", "3", "4"], // Default to all Vedas selected
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
                if (key === 'vedaType') {
                    // Handle vedaType as array
                    initialFilters.vedaType = Array.isArray(value)
                        ? value
                        : value.toString().split(',').filter(Boolean);
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (initialFilters as any)[key] = Array.isArray(value) ? value[0] : value;
                }
            }
        })

        return initialFilters
    })

    // Combine the search term with advanced filters
    const combinedParams = useMemo(() => ({
        ...advancedFilters,
        ...(searchQuery ? { mantra: searchQuery } : {})
    }), [advancedFilters, searchQuery]);

    // Use a separate state to track when to trigger a search
    const [searchTrigger, setSearchTrigger] = useState(0);

    // Pass searchTrigger to useVedaSearch to force a new search when filters change
    const { results, isLoading } = useVedaSearch(searchQuery, combinedParams, searchTrigger)

    // Debug effect to log when filters or search params change
    useEffect(() => {
        console.log('Advanced filters changed:', advancedFilters);
        console.log('Combined params:', combinedParams);
        console.log('Search trigger:', searchTrigger);
    }, [advancedFilters, combinedParams, searchTrigger, searchQuery]);

    const handleSearch = () => {
        setSearchQuery(inputTerm) // This will trigger the useVedaSearch hook
    }

    const handleAdvancedFilterChange = (field: keyof AdvancedFilters) => (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        const newValue: string | string[] = e.target.value as string | string[];

        // Create a new filters object with the updated value
        const newFilters = {
            ...advancedFilters,
            [field]: newValue,
        };

        // Update the filters
        setAdvancedFilters(newFilters);

        // Log the change for debugging
        console.log(`Filter changed: ${field} = ${JSON.stringify(newValue)}`);

        // Force an immediate search with the updated filters
        // This is crucial for the search to update when filters change
        setSearchTrigger(prev => prev + 1);
    }

    const handleReset = () => {
        // Reset all filters to empty values
        setAdvancedFilters({
            vedaType: ["1", "2", "3", "4"],
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
        });

        // Force a new search with the reset filters
        setTimeout(() => {
            setSearchTrigger((prev) => prev + 1);
        }, 0);

        setSnackbarMessage("Filters have been reset");
        setSnackbarOpen(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                onClick={() => {
                    handleReset()
                    setShowAdvanced(!showAdvanced)
                }}
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
                                multiple
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => handleAdvancedFilterChange("vedaType")(e as any)}
                                renderValue={(selected) => {
                                    const selectedTypes = (selected as string[]);
                                    if (selectedTypes.length === 0) return "Select Veda Types";
                                    if (selectedTypes.length === 4) return "ALL Vedas";

                                    const vedaNames = {
                                        "1": "Rig Veda",
                                        "2": "Yajur Veda",
                                        "3": "Sama Veda",
                                        "4": "Atharva Veda"
                                    };

                                    return selectedTypes
                                        .map(type => vedaNames[type as keyof typeof vedaNames])
                                        .join(", ");
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 224,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                <MenuItem 
                                    value="all"
                                    onClick={() => {
                                        // If all are currently selected, deselect all
                                        // Otherwise, select all
                                        const allVedaTypes = ["1", "2", "3", "4"];
                                        const newValue = 
                                            advancedFilters.vedaType.length === 4 
                                                ? [] 
                                                : allVedaTypes;
                                        
                                        setAdvancedFilters({
                                            ...advancedFilters,
                                            vedaType: newValue,
                                        });
                                        
                                        // Force an immediate search with the updated filters
                                        setSearchTrigger(prev => prev + 1);
                                    }}
                                >
                                    <Box display="flex" alignItems="center">
                                        <input
                                            type="checkbox"
                                            checked={advancedFilters.vedaType.length === 4}
                                            readOnly
                                            style={{ marginRight: 8 }}
                                        />
                                        <span>ALL</span>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="1">
                                    <Box display="flex" alignItems="center">
                                        <input
                                            type="checkbox"
                                            checked={advancedFilters.vedaType.includes("1")}
                                            readOnly
                                            style={{ marginRight: 8 }}
                                        />
                                        <span>Rig Veda</span>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="2">
                                    <Box display="flex" alignItems="center">
                                        <input
                                            type="checkbox"
                                            checked={advancedFilters.vedaType.includes("2")}
                                            readOnly
                                            style={{ marginRight: 8 }}
                                        />
                                        <span>Yajur Veda</span>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="3">
                                    <Box display="flex" alignItems="center">
                                        <input
                                            type="checkbox"
                                            checked={advancedFilters.vedaType.includes("3")}
                                            readOnly
                                            style={{ marginRight: 8 }}
                                        />
                                        <span>Sama Veda</span>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="4">
                                    <Box display="flex" alignItems="center">
                                        <input
                                            type="checkbox"
                                            checked={advancedFilters.vedaType.includes("4")}
                                            readOnly
                                            style={{ marginRight: 8 }}
                                        />
                                        <span>Atharva Veda</span>
                                    </Box>
                                </MenuItem>
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => handleAdvancedFilterChange("devata")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Rishi"
                                value={advancedFilters.rishi}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => handleAdvancedFilterChange("rishi")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Chhanda"
                                value={advancedFilters.chhanda}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => handleAdvancedFilterChange("chhanda")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Swara"
                                value={advancedFilters.swara}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => handleAdvancedFilterChange("mantra_swara")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Mantra Pad"
                                value={advancedFilters.mantra_pad}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => handleAdvancedFilterChange("mantra_pad")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Mantra Pad Swara"
                                value={advancedFilters.mantra_pad_swara}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => handleAdvancedFilterChange("mantra_pad_swara")(e as any)}
                                size="small"
                                sx={{ width: "150px" }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Mantra Translation"
                                value={advancedFilters.mantra_trans}
                                // eslint-disable-next-line
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
