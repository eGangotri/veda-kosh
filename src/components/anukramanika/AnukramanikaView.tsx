import React, { useState } from 'react';
import { Box } from '@mui/material';
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

    const rows: GridRowsProp<VedicMantraResult> = results

    const fetchMantras = async (char: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/mantrasWithStChar?startingChar=${encodeURIComponent(char)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch mantras');
            }

            const { data }: VedaCallResponse = await response.json()
            console.log(`data(${JSON.stringify(data)}):`);
            console.log(`data RgV(${JSON.stringify(data?.rigVedaResults)}):`);
            console.log(`data YV(${JSON.stringify(data?.yajurVedaResults)}):`)
                ;
            console.log(`data SV(${JSON.stringify(data?.samaVedaResults)}):`);
            console.log(`data AV(${JSON.stringify(data?.atharvaVedaResults)}):`);

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
        <div className="flex space-x-2 mb-3">
            {chars.map((char, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(char)}
                    className={`
            w-16 h-16 md:w-24 md:h-24 
            flex items-center justify-center 
            text-lg md:text-2xl font-semibold
            border-2 rounded-lg shadow-md
            transition-all duration-200 ease-in-out
            ${selectedChar === char
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-200'
                            : 'bg-white hover:bg-indigo-50 hover:border-indigo-300 border-gray-300 text-gray-700'}
            hover:scale-105
          `}
                >
                    {char}
                </button>
            ))}
        </div>
    );

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-wrap gap-4">
                    {renderRow(vowels)}
                    {renderRow(kaVarga)}
                    {renderRow(chaVarga)}
                    {renderRow(TaVarga)}
                    {renderRow(taVarga)}
                    {renderRow(paVarga)}
                    {renderRow(yaToLa)}
                    {renderRow(shaToGya)}
                </div>
            </div>

            <div className="mt-8">
                {loading && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-center p-4">
                        {error}
                    </div>
                )}

            </div>
            <Box sx={{ height: 400, width: "100%" }}>
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
        </div>
    );
};

export default AnukramanikaView;
