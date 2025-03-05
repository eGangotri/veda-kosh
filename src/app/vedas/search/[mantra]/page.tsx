'use client'

import { SearchResultPage } from "@/components/vedas/SearchResult"
import { SearchParams } from "@/types/common"
import React, { Suspense } from "react"

// Define props including the params
interface SearchPageProps {
  params: Promise<{mantra:string}>;
  searchParams: Promise<SearchParams>;
}
export const SearchResultView: React.FC<SearchPageProps> =  ({ params, searchParams }) => {
  const { mantra  } = React.use(params)
  const queryParams = React.use(searchParams)

  if (!mantra) return null

  return (
    <Suspense fallback={< div > Loading...</div>}>
      <SearchResultPage searchTerm={mantra} initialSearchParams={queryParams} />
    </Suspense >
  )
}
export default SearchResultView
