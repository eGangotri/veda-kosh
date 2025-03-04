import {  VedicMantraResult } from '@/types/vedas';
import {  GridCellParams, GridColDef } from '@mui/x-data-grid';
import { getVedaNameByVedaId, getVedaPathNameByVedaId, slashToDash } from '@/utils/Utils';
import Link from 'next/link';

export const COMBO_RESULT_COLUMNS: GridColDef<VedicMantraResult>[] = [
    {
        field: "vedaType", headerName: "Veda", width: 130, flex: 1,
        renderCell: (params: GridCellParams) => (
            <Link 
                href={`/vedas/${getVedaPathNameByVedaId(params.row.vedaType)}`}
                style={{ textDecoration: 'none', color: '#2563eb' }}
            >
                {getVedaNameByVedaId(params.row.vedaType)}
            </Link>
        )
    },
    {
        field: "mantra_ref_id",
        headerName: "Reference ID",
        width: 150,
        flex: 1,
        renderCell: (params: GridCellParams) => (
            <Link 
                href={`/vedas/mantra/${slashToDash(params.row.mantra_ref_id)}`}
                style={{ textDecoration: 'none', color: '#2563eb' }}
            >
                {params.row.mantra_ref_id}
            </Link>
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
