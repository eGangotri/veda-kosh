
import RigVedaView from "@/components/vedas/RigVedaView"
import { SearchParams } from "@/types/common"
import { Suspense } from "react"

export default async function RigVedaPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RigVedaView initialSearchParams={params} />
        </Suspense>
    )
}