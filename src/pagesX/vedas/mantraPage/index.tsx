"use client"

import Layout from "@/components/Layout"
import RigVedaSingleMantra from "@/components/singleMantraView/rig"
import YajurVedaSingleMantra from "@/components/singleMantraView/yajur"
import SamaVedaSingleMantra from "@/components/singleMantraView/sama"
import AtharvaVedaSingleMantra from "@/components/singleMantraView/atharva"
import { useRouter } from "next/router"

export default function MantraPage() {
    const router = useRouter()
    const { mantraRefId } = router.query
    console.log("mantraRefId:", mantraRefId)

    return (
        <>
            {mantraRefId && mantraRefId.length > 0 && (
                <Layout>
                    {mantraRefId.toString().startsWith("1") ? (
                        <RigVedaSingleMantra mantraRefId={mantraRefId.toString()} />
                    ) : mantraRefId.toString().startsWith("2") ? (
                        <YajurVedaSingleMantra mantraRefId={mantraRefId.toString()} />
                    ) : mantraRefId.toString().startsWith("3") ? (
                        <SamaVedaSingleMantra mantraRefId={mantraRefId.toString()} />
                    ) : (
                        <AtharvaVedaSingleMantra mantraRefId={mantraRefId.toString()} />
                    )}
                </Layout>
            )}
        </>
    )
}
