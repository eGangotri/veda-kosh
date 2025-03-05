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
  const { mantra } = React.use(params)
  const queryParams = React.use(searchParams)

  // Decode the mantra parameter from URL encoding
  const decodedMantra = mantra ? decodeURIComponent(mantra) : ""
  console.log(`Received mantra: ${mantra}, decoded as: ${decodedMantra}`)

  if (!decodedMantra) return null

  return (
    <Suspense fallback={< div > Loading...</div>}>
      <SearchResultPage searchTerm={decodedMantra} initialSearchParams={queryParams} />
    </Suspense >
  )
}
export default SearchResultView
