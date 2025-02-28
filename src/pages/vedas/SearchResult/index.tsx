"use client"

import Layout from "@/components/Layout"
import { SearchPage } from "@/components/vedas/SearchResult"
import { useRouter } from "next/router"

export default function SearchResult() {
  const router = useRouter()
  const { mantra } = router.query || ""
  console.log("mantra", mantra)
  return (
    <>
      {mantra && mantra.length > 0 && (
        <Layout>
          <SearchPage searchTerm={mantra.toString()} />
        </Layout>
      )}
    </>
  )
}

