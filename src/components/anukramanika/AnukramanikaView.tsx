import React, { useState } from 'react';
import { Box, Button, Container, Grid, CircularProgress, Typography, Paper } from '@mui/material';
import { VedaCallResponse, VedicMantraResult } from '@/types/vedas';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/utils/Utils';
import { COMBO_RESULT_COLUMNS } from '../Utils';

const AnukramanikaView: React.FC = () => {
    const [selectedChar, setSelectedChar] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<VedicMantraResult[]>([])

    const vowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ॠ', 'ऌ', 'ॡ', 'ए', 'ऐ', 'ओ', 'औ'];
    const kaVarga = ['क', 'ख', 'ग', 'घ', 'ङ'];
    const chaVarga = ['च', 'छ', 'ज', 'झ', 'ञ'];
    const TaVarga = ['ट', 'ठ', 'ड', 'ढ', 'ण'];
    const taVarga = ['त', 'थ', 'द', 'ध', 'न'];
    const paVarga = ['प', 'फ', 'ब', 'भ', 'म'];
    const yaToLa = ['य', 'र', 'ल', 'व'];
    const shaToGya = ['श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'];

    const rows: GridRowsProp<VedicMantraResult> = results;

    const fetchMantras = async (char: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/mantrasWithStChar?startingChar=${encodeURIComponent(char)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch mantras');
            }

            const { data }: VedaCallResponse = await response.json();
            const combinedResults: VedicMantraResult[] = [
                ...(data?.rigVedaResults || []).map((item) => ({ ...item, vedaType: 1 })),
                ...(data?.yajurVedaResults || []).map((item) => ({ ...item, vedaType: 2 as const })),
                ...(data?.samaVedaResults || []).map((item) => ({ ...item, vedaType: 3 as const })),
                ...(data?.atharvaVedaResults || []).map((item) => ({ ...item, vedaType: 4 as const })),
            ];
            setResults(combinedResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (char: string) => {
        setSelectedChar(char);
        fetchMantras(char);
    };

    const renderRow = (chars: string[]) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            {chars.map((char, index) => (
                <Button
                    key={index}
                    onClick={() => handleClick(char)}
                    variant={selectedChar === char ? "contained" : "outlined"}
                    color="primary"
                    sx={{
                        width: { xs: '1rem', md: '1.2rem' },
                        height: { xs: '2rem', md: '2rem' },
                        fontSize: { xs: '0.8rem', md: '1rem' },
                        fontWeight: 300,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            backgroundColor: selectedChar === char ? undefined : 'action.hover'
                        }
                    }}
                >
                    {char}
                </Button>
            ))}
        </Box>
    );

    return (
        <Container sx={{ py: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {renderRow(vowels)}
                            <Box>
                                {renderRow(kaVarga)}
                                {renderRow(chaVarga)}
                            </Box>
                            {renderRow(TaVarga)}
                            {renderRow(taVarga)}
                            {renderRow(paVarga)}
                            {renderRow(yaToLa)}
                            {renderRow(shaToGya)}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {error && (
                            <Typography color="error" align="center" sx={{ p: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Box sx={{ height: 400, width: "100%", mt: 2 }}>
                            <DataGrid<VedicMantraResult>
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
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AnukramanikaView;
