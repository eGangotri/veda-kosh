// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { CircularProgress, Snackbar, Alert } from '@mui/material';
// import { INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/utils/Utils';

// const SearchResultsPage = () => {
//     const router = useRouter();
//     const { mantra } = router.query;
//     const [mantras, setMantras] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');

//     useEffect(() => {
//         if (mantra) {
//             fetchMantras(mantra as string);
//         }
//     }, [mantra]);

//     const fetchMantras = async (searchTerm: string) => {
//         try {
//             const response = await fetch(`/api/vedas/all?mantra=${searchTerm}`);
//             const data: { data: any[] } = await response.json();
//             setMantras(data.data);
//         } catch (error) {
//             console.error("Error fetching mantras:", error);
//             setSnackbarMessage("Error fetching data");
//             setSnackbarOpen(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSnackbarClose = () => {
//         setSnackbarOpen(false);
//     };

//     // Define columns for the DataGrid
//     const columns: GridColDef[] = [
//         { field: 'id', headerName: 'ID', width: 90 },
//         { field: 'mantra_ref_id', headerName: 'Mantra Ref ID', width: 150 },
//         { field: 'mantra', headerName: 'Mantra', width: 400 },
//     ];

//     return (
//         <div style={{ height: 400, width: '100%' }}>
//             {loading ? (
//                 <CircularProgress />
//             ) : (
//                 <DataGrid
//                     rows={mantras}
//                     columns={columns}
//                     initialState={{
//                         pagination: {
//                             paginationModel: {
//                                 page: 0,
//                                 pageSize: INITIAL_PAGE_SIZE
//                             },
//                         },
//                     }}
//                     pageSizeOptions={PAGE_SIZE_OPTIONS}
//                     checkboxSelection
//                 />
//             )}
//             <Snackbar
//                 open={snackbarOpen}
//                 autoHideDuration={6000}
//                 onClose={handleSnackbarClose}
//             >
//                 <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
//                     {snackbarMessage}
//                 </Alert>
//             </Snackbar>
//         </div>
//     );
// };

// export default SearchResultsPage;

"use client"

import type React from "react"

import { use, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { TextField, Button, Typography, Box } from "@mui/material"
import { DataGrid, GridColDef, type GridRowsProp } from "@mui/x-data-grid"
import { Veda } from "@/types/vedas"
import { useVedaSearch } from "@/hooks/use-hook-search"
import { INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/utils/Utils"


export const columns: GridColDef<Veda>[] = [
    { field: "veda", headerName: "Veda", width: 130, flex: 1 },
    { field: "mantra_ref_id", headerName: "Reference ID", width: 150, flex: 1 },
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


export const SearchPage: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
    const [_searchTerm, setSearchTerm] = useState(searchTerm)
    const { results, isLoading } = useVedaSearch(_searchTerm)

    const handleSearch = (e: React.FormEvent) => {
        console.log("searchTerm", _searchTerm, encodeURIComponent(_searchTerm))
        e.preventDefault()
        window.history.pushState(null, "", `/search?mantra=${encodeURIComponent(_searchTerm)}`)
    }

    useEffect(() => {
        setSearchTerm(_searchTerm)
    }, [])

    const rows: GridRowsProp<Veda> = results

    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Search Results
            </Typography>
            <Box component="form" onSubmit={handleSearch} sx={{ mb: 2, display: "flex", gap: 2 }}>
                <TextField
                    fullWidth
                    value={_searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Vedas..."
                    variant="outlined"
                />
                <Button type="submit" variant="contained">
                    Search
                </Button>
            </Box>
            <Button variant="outlined" sx={{ mb: 2 }}>
                Advanced Search
            </Button>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Box sx={{ height: 400, width: "100%" }}>
                    <DataGrid<Veda>
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

