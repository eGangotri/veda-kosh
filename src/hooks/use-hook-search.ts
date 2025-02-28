"use client"

import { Veda, VedaResultType } from "@/types/vedas"
import { useState, useEffect } from "react"

export function useVedaSearch(query: string) {
  const [results, setResults] = useState<Veda[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([])
        return
      }
      console.log(`query: ${query} ${encodeURIComponent(query)}`)
      setIsLoading(true)
      try {
        const response = await fetch(`/api/vedas/all?mantra=${encodeURIComponent(query)}`)
        const data: VedaResultType = await response.json()

        const combinedResults: Veda[] = [
          ...data.rigVedaResults.map((item) => ({ ...item, veda: "Rig Veda" as const })),
          ...data.yajurVedaResults.map((item) => ({ ...item, veda: "Yajur Veda" as const })),
          ...data.samaVedaResults.map((item) => ({ ...item, veda: "Sama Veda" as const })),
          ...data.atharvaVedaResults.map((item) => ({ ...item, veda: "Atharva Veda" as const })),
        ]

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

