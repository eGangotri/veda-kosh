'use client'

import { SearchResultPage } from "@/components/vedas/SearchResult"
import { SearchParams } from "@/types/common"
import { Suspense } from "react"

interface SearchResultViewProps {
  params: {
    mantra: string
  },
  searchParams: Promise<SearchParams>
}

export default async function SearchResultView({ params, searchParams }: SearchResultViewProps) {
  const { mantra } = params
  const queryParams = await searchParams

  if (!mantra) return null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultPage searchTerm={mantra} initialSearchParams={queryParams} />
    </Suspense>
  )
}
