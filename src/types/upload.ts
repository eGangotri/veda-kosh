export interface UploadResponse {
    success: boolean
    message: string
    error?: string
    collectionCreated?: boolean
    recordsInserted?: number
  }
  
  export interface ExcelRow {
    // eslint-disable-next-line
    [key: string]: any
  }
  
  