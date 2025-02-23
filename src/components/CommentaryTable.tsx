import type React from "react"
import { DataGrid, type GridColDef, GridActionsCellItem } from "@mui/x-data-grid"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { Commentary } from "@/types/Commentary"

interface CommentaryTableProps {
    commentaries: Commentary[]
    onEdit: (commentary: Commentary) => void
    onDelete: (id: string) => void
}

const CommentaryTable: React.FC<CommentaryTableProps> = ({ commentaries, onEdit, onDelete }) => {
    const columns: GridColDef[] = [
        { field: "VedaId", headerName: "Veda ID", width: 130 },
        { field: "Commentary_Name", headerName: "Commentary Name", width: 200 },
        { field: "Commentator", headerName: "Commentator", width: 150 },
        { field: "Language", headerName: "Language", width: 130 },
        {
            field: "Mantra_Commented_Count",
            headerName: "Mantra Commented Count",
            type: "number",
            width: 200,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ row }) => {
                return [
                    <GridActionsCellItem
                        key="edit"
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={() => onEdit(row)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key="delete"
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => onDelete(row._id)}
                        color="inherit"
                    />,
                ]
            },
        },
    ]

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={commentaries}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                getRowId={(row) => row._id}
            />
        </div>
    )
}

export default CommentaryTable

