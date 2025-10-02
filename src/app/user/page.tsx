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
  TextField,
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

  // Add/Edit Panel State
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; email: string; role: Role; password: string; confirmPassword: string }>({
    name: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string } | null>(null);

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
    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (e: any) {
      setError(e.message || "Unable to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetForm = () => {
    setFormMode("add");
    setEditingId(null);
    setForm({ name: "", email: "", role: "user", password: "", confirmPassword: "" });
    setFormErrors(null);
  };

  const startEdit = (user: UserRow) => {
    setFormMode("edit");
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email, role: user.role, password: "", confirmPassword: "" });
    setFormErrors(null);
    // Scroll to top to focus the panel
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = () => {
    const errs: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (formMode === "add") {
      if (!form.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
      if (!form.password) {
        errs.password = "Password is required";
      } else if (form.password.length < 6) {
        errs.password = "Password must be at least 6 characters";
      }
      if (!form.confirmPassword) {
        errs.confirmPassword = "Confirm your password";
      } else if (form.confirmPassword !== form.password) {
        errs.confirmPassword = "Passwords do not match";
      }
    }
    setFormErrors(Object.keys(errs).length ? errs : null);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setFormSubmitting(true);
    try {
      if (formMode === "add") {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name.trim(), email: form.email.trim().toLowerCase(), role: form.role, password: form.password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || `Failed to create user (${res.status})`);
        const created: UserRow = data.user;
        setRows((prev) => [created, ...prev]);
        setSnack({ open: true, message: `User created${data?.tempPassword ? ` (temp password: ${data.tempPassword})` : ""}`, severity: "success" });
        resetForm();
      } else if (formMode === "edit" && editingId) {
        const res = await fetch(`/api/users/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name.trim(), role: form.role }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || `Failed to update user (${res.status})`);
        const updated: UserRow = data.user;
        setRows((prev) => prev.map((r) => (r._id === updated._id ? { ...r, name: updated.name, role: updated.role } : r)));
        setSnack({ open: true, message: `User updated`, severity: "success" });
        resetForm();
      }
    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (e: any) {
      setSnack({ open: true, message: e.message || "Operation failed", severity: "error" });
    } finally {
      setFormSubmitting(false);
    }
  };

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
                {r.toUpperCase()}
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
            <Tooltip title="Edit">
              <span>
                <IconButton size="small" onClick={() => startEdit(user)}>
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

        {/* Add/Edit Panel */}
        <Box sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1, backgroundColor: "background.paper" }}>
          <Stack direction="column" spacing={2}>
            {/* Row 1: Name + Email */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Name"
                size="small"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                error={!!formErrors?.name}
                helperText={formErrors?.name}
              />
              <TextField
                label="Email"
                size="small"
                sx={{ minWidth: '250px' }}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                error={!!formErrors?.email}
                helperText={formErrors?.email}
                disabled={formMode === "edit"}
              />
              <Select
                size="small"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                sx={{ minWidth: 160 }}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            {/* Row 2: Password + Confirm Password (Add mode only) */}
            {formMode === "add" && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Password"
                  type="password"
                  size="small"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  error={!!formErrors?.password}
                  helperText={formErrors?.password}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  size="small"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  error={!!formErrors?.confirmPassword}
                  helperText={formErrors?.confirmPassword}
                />
              </Stack>
            )}

            {/* Row 3: Role + Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={handleSubmit} disabled={formSubmitting}>
                  {formMode === "add" ? "Add User" : "Save Changes"}
                </Button>
                <Button variant="outlined" onClick={resetForm} disabled={formSubmitting}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>

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
