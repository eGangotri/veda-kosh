"use client"

import Layout from "@/components/Layout"
import RigVedaSingleMantra from "@/components/singleMantraView/rig"
import YajurVedaSingleMantra from "@/components/singleMantraView/yajur"
import SamaVedaSingleMantra from "@/components/singleMantraView/sama"
import AtharvaVedaSingleMantra from "@/components/singleMantraView/atharva"
import { useRouter } from "next/router"
import { slashToDash } from "@/utils/Utils"

export default function MantraPage() {
    const router = useRouter()
    const { mantraRefId } = router.query
    console.log("mantraRefId:", mantraRefId)

    return (
        <>
            {mantraRefId && mantraRefId.length > 0 && (
                <Layout>
                    {mantraRefId.toString().startsWith("1") ? (
                        <RigVedaSingleMantra mantraRefId={slashToDash(mantraRefId.toString())} />
                    ) : mantraRefId.toString().startsWith("2") ? (
                        <YajurVedaSingleMantra mantraRefId={slashToDash(mantraRefId.toString())} />
                    ) : mantraRefId.toString().startsWith("3") ? (
                        <SamaVedaSingleMantra mantraRefId={slashToDash(mantraRefId.toString())} />
                    ) : (   
                        <AtharvaVedaSingleMantra mantraRefId={slashToDash(mantraRefId.toString())} />
                    )}
                </Layout>
            )}
        </>
    )
}
