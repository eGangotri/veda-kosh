'use client'

import RigVedaSingleMantra from "@/components/singleMantraView/rig"
import YajurVedaSingleMantra from "@/components/singleMantraView/yajur"
import SamaVedaSingleMantra from "@/components/singleMantraView/sama"
import AtharvaVedaSingleMantra from "@/components/singleMantraView/atharva"

interface MantraPageProps {
  params: {
    mantraRefId: string
  }
}

export default function MantraPage({ params }: MantraPageProps) {
  const { mantraRefId } = params

  if (!mantraRefId) return null

  return (
    <>
      {mantraRefId.startsWith("1") ? (
        <RigVedaSingleMantra mantraRefId={mantraRefId} />
      ) : mantraRefId.startsWith("2") ? (
        <YajurVedaSingleMantra mantraRefId={mantraRefId} />
      ) : mantraRefId.startsWith("3") ? (
        <SamaVedaSingleMantra mantraRefId={mantraRefId} />
      ) : (
        <AtharvaVedaSingleMantra mantraRefId={mantraRefId} />
      )}
    </>
  )
}
