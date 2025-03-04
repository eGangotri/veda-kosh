import RigVedaView from "@/components/vedas/RigVedaView"
import { type SearchParams } from "@/types/common"

export default function RigVedaPage({ searchParams }: { searchParams: SearchParams }) {
  return <RigVedaView initialSearchParams={searchParams} />
}
