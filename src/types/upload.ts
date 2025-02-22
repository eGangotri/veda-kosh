export interface UploadResponse {
    success: boolean
    message: string
    error?: string
    collectionCreated?: boolean
    recordsInserted?: number
  }
  
  export interface ExcelRow {
    [key: string]: any
  }
  
  