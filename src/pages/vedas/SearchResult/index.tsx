"use client"

import Layout from "@/components/Layout"
import { SearchResultPage } from "@/components/vedas/SearchResult"
import { useRouter } from "next/router"

export default function SearchResultView() {
  const router = useRouter()
  const { mantra } = router.query || ""
  console.log("mantra", mantra)
  return (
    <>
      {mantra && mantra.length > 0 && (
        <Layout>
          <SearchResultPage searchTerm={mantra.toString()} />
        </Layout>
      )}
    </>
  )
}

