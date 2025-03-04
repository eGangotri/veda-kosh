'use client'

import { use } from 'react'
import RigVedaSingleMantra from "@/components/singleMantraView/rig"
import YajurVedaSingleMantra from "@/components/singleMantraView/yajur"
import SamaVedaSingleMantra from "@/components/singleMantraView/sama"
import AtharvaVedaSingleMantra from "@/components/singleMantraView/atharva"
import { dashToSlash } from '@/utils/Utils'

interface MantraPageProps {
  params: Promise<{
    mantraRefId: string
  }>
}

export default function MantraPage({ params }: MantraPageProps) {
  const { mantraRefId } = use(params)
  const reSlashedMantraRefId = dashToSlash(mantraRefId)
  if (!reSlashedMantraRefId) return null

  return (
    <>
      {mantraRefId.startsWith("1") ? (
        <RigVedaSingleMantra mantraRefId={reSlashedMantraRefId} />
      ) : mantraRefId.startsWith("2") ? (
        <YajurVedaSingleMantra mantraRefId={reSlashedMantraRefId} />
      ) : mantraRefId.startsWith("3") ? (
        <SamaVedaSingleMantra mantraRefId={reSlashedMantraRefId} />
      ) : (
        <AtharvaVedaSingleMantra mantraRefId={reSlashedMantraRefId} />
      )}
    </>
  )
}
