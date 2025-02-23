"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { Upload as UploadIcon } from "@mui/icons-material"
import type { UploadResponse } from "@/types/upload"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [allowOverwrite, setAllowOverwrite] = useState(false)
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info"
  }>({
    open: false,
    message: "",
    severity: "success",
  })

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return

    setIsUploading(true)
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`/api/upload?allowOverwrite=${allowOverwrite}`, {
        method: "POST",
        body: formData,
      })

      const data: UploadResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setNotification({
        open: true,
        message: data.message,
        severity: data.success ? "success" : "info",
      })
    } catch (error) {
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : "Upload failed",
        severity: "error",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Upload Excel File
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Upload your Excel file. The file name will be used as the collection name (spaces will be converted to
            underscores). The first row of the Excel file will be used as the field names for the database.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={allowOverwrite}
                onChange={(e) => setAllowOverwrite(e.target.checked)}
                name="allowOverwrite"
              />
            }
            label="Allow overwrite"
          />

          <Box sx={{ position: "relative" }}>
            <Button
              variant="contained"
              component="label"
              disabled={isUploading}
              startIcon={isUploading ? <CircularProgress size={20} /> : <UploadIcon />}
              fullWidth
            >
              {isUploading ? "Uploading..." : "Choose File"}
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleUpload} disabled={isUploading} />
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  )
}

