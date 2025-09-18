"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

// Align with backend role enum
const ROLES = ["user", "admin", "moderator", "scholar"] as const;

type Role = typeof ROLES[number];

interface UserRow {
  _id: string;
  name: string;
  email: string;
  image?: string;
  provider: "credentials" | "google";
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export default function UserManagementPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmRole, setConfirmRole] = useState<{
    user?: UserRow;
    nextRole?: Role;
    open: boolean;
  }>({ open: false });

  const [confirmDelete, setConfirmDelete] = useState<{
    user?: UserRow;
    open: boolean;
  }>({ open: false });

  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users", { method: "GET" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to load users (${res.status})`);
      }
      const data = await res.json();
      const users: UserRow[] = data.users || [];
      setRows(users);
    } catch (e: any) {
      setError(e.message || "Unable to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenRoleConfirm = (user: UserRow, nextRole: Role) => {
    if (user.role === nextRole) return; // no-op
    setConfirmRole({ user, nextRole, open: true });
  };

  const handleConfirmRole = async () => {
    const user = confirmRole.user;
    const nextRole = confirmRole.nextRole;
    if (!user || !nextRole) return;
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to update role (${res.status})`);
      }
      setRows((prev) => prev.map((r) => (r._id === user._id ? { ...r, role: nextRole } : r)));
      setSnack({ open: true, message: `Role updated to ${nextRole}`, severity: "success" });
    } catch (e: any) {
      setSnack({ open: true, message: e.message || "Failed to update role", severity: "error" });
    } finally {
      setConfirmRole({ open: false });
    }
  };

  const handleOpenDeleteConfirm = (user: UserRow) => {
    setConfirmDelete({ user, open: true });
  };

  const handleConfirmDelete = async () => {
    const user = confirmDelete.user;
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to delete user (${res.status})`);
      }
      setRows((prev) => prev.filter((r) => r._id !== user._id));
      setSnack({ open: true, message: `User deleted`, severity: "success" });
    } catch (e: any) {
      setSnack({ open: true, message: e.message || "Failed to delete user", severity: "error" });
    } finally {
      setConfirmDelete({ open: false });
    }
  };

  const columns: GridColDef[] = useMemo(() => [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    { field: "provider", headerName: "Provider", width: 120 },
    {
      field: "role",
      headerName: "Role",
      width: 180,
      renderCell: (params) => {
        const user = params.row as UserRow;
        return (
          <Select
            size="small"
            value={user.role}
            onChange={(e) => handleOpenRoleConfirm(user, e.target.value as Role)}
            sx={{ minWidth: 140 }}
          >
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 160,
      valueFormatter: ({ value }) => {
        const v = value as string | undefined;
        return v ? new Date(v).toLocaleDateString() : "";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row as UserRow;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit (not implemented)">
              <span>
                <IconButton size="small" onClick={() => setSnack({ open: true, message: "Edit action is not implemented yet.", severity: "info" })}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <span>
                <IconButton size="small" color="error" onClick={() => handleOpenDeleteConfirm(user)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      },
    },
  ], []);

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          User Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ height: 600, width: "100%", position: "relative" }}>
          <DataGrid
            rows={rows}
            getRowId={(r) => r._id}
            columns={columns}
            disableRowSelectionOnClick
            loading={loading}
            pagination
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          />

          {loading && (
            <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </Box>

        {/* Confirm role change */}
        <Dialog open={confirmRole.open} onClose={() => setConfirmRole({ open: false })}>
          <DialogTitle>Confirm Role Change</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirmRole.user && confirmRole.nextRole
                ? `Change role of ${confirmRole.user.name} (${confirmRole.user.email}) to "${confirmRole.nextRole}"?`
                : "Are you sure you want to change this role?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmRole({ open: false })}>No</Button>
            <Button variant="contained" onClick={handleConfirmRole} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirm delete */}
        <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false })}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirmDelete.user
                ? `Delete user ${confirmDelete.user.name} (${confirmDelete.user.email})? This action cannot be undone.`
                : "Are you sure you want to delete this user?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete({ open: false })}>No</Button>
            <Button color="error" variant="contained" onClick={handleConfirmDelete} autoFocus>
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Box>
    </RoleProtectedRoute>
  );
}
