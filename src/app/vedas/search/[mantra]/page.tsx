'use client'

import { SearchResultPage } from "@/components/vedas/SearchResult"

interface SearchResultViewProps {
  params: {
    mantra: string
  }
}

export default function SearchResultView({ params }: SearchResultViewProps) {
  const { mantra } = params

  if (!mantra) return null

  return <SearchResultPage searchTerm={mantra} />
}
