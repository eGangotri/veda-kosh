import UploadPage from "@/components/ExcelUpload"
import RoleProtectedRoute from "@/components/RoleProtectedRoute"

export default function UploadFilePage() {
  // Check for our custom environment variable first, then fall back to NODE_ENV
  // const isProduction = 
  //   process.env.VEDA_KOSH_ENV === 'production' || 
  //   (process.env.VEDA_KOSH_ENV !== 'development' && process.env.NODE_ENV === 'production')

  // if (isProduction) {
  //   return (<div>Under Construction</div>)
  // } else {
  //   return <UploadPage />
  // }
  return (
    <RoleProtectedRoute allowedRoles={['scholar', 'admin']}>
      <UploadPage />
    </RoleProtectedRoute>
  )
}
