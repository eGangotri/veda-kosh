import React, { useState, useEffect } from 'react';
import { Mantra, MantraResponse } from '../../types/mantra';
import { Box } from '@mui/material';
import { VedaCallResponse, VedicMantraResult } from '@/types/vedas';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { getVedaNameByVedaId, getVedaPathNameByVedaId, INITIAL_PAGE_SIZE, PAGE_SIZE_OPTIONS, slashToDash } from '@/utils/Utils';
import Link from 'next/link';

//repeat
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
    const x = 50;
    const xMd = 80
    const renderRow = (chars: string[]) => (
        <div className="flex ">
            {chars.map((char, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(char)}
                    className={`
            w-${x} h-${x} md:w-${xMd} md:h-${xMd} 
            flex items-center justify-center 
            text-lg md:text-xl
            border rounded-lg
            transition-colors duration-200
            ${selectedChar === char
                            ? 'bg-blue-500 text-white border-blue-600'
                            : 'bg-white hover:bg-gray-100 border-gray-300'}
          `}
                >
                    {char}
                </button>
            ))}
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex">
                <Box>{renderRow(vowels)}</Box>XXX
                <Box>{renderRow(kaVarga)} {renderRow(chaVarga)}</Box>
                <Box> {renderRow(TaVarga)} {renderRow(taVarga)} {renderRow(paVarga)}</Box>
                <Box> {renderRow(yaToLa)} {renderRow(shaToGya)}</Box>
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
        </div>
    );
};

export default AnukramanikaView;
