"use client"

import { Veda, VedaCallResponse, VedicMantraResult } from "@/types/vedas"
import { useState, useEffect } from "react"

export function useVedaSearch(query: string) {
  const [results, setResults] = useState<VedicMantraResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      console.log(`useVedaSearch involed with ${query}`)
      if (!query) {
        setResults([])
        return
      }
      console.log(`query: ${query} ${encodeURIComponent(query)}`)
      setIsLoading(true)
      try {
        const response = await fetch(`/api/vedas/all?mantra=${encodeURIComponent(query)}`)
        const {data}: VedaCallResponse = await response.json()
        console.log(`data(${JSON.stringify(data)}):`);
        console.log(`data RgV(${JSON.stringify(data?.rigVedaResults)}):`);
        console.log(`data YV(${JSON.stringify(data?.yajurVedaResults)}):`)
        ;
        console.log(`data SV(${JSON.stringify(data?.samaVedaResults)}):`);
        console.log(`data AV(${JSON.stringify(data?.atharvaVedaResults)}):`);

        const combinedResults: VedicMantraResult[] = [
          ...(data?.rigVedaResults || []).map((item) => ({ ...item, vedaType: 1 })),
          ...(data?.yajurVedaResults || []).map((item) => ({ ...item, vedaType: 2 as const })),
          ...(data?.samaVedaResults || []).map((item) => ({ ...item, vedaType: 3 as const })),
          ...(data?.atharvaVedaResults || []).map((item) => ({ ...item, vedaType: 4 as const })),
        ];
        console.log(`combinedResults(${combinedResults.length}):
           ${JSON.stringify(combinedResults)}`);

        setResults(combinedResults)
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return { results, isLoading }
}
