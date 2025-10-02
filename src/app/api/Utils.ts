import { RigVeda } from "@/types/vedas"
import { addNumberFilter, addTextFilter } from "./lib/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addNumericParams = (searchParams: URLSearchParams, queryObj: Record<string, any>) => {

    // Numeric parameters
    const numericParams = [
        'mandal_no',
        'sukta_no',
        'mantra_no',
        'ashtak_no',
        'adhyay_no',
        'varga_no',
        'mantra2_no'
    ] as const

    numericParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
            addNumberFilter<RigVeda>(value, param as keyof RigVeda, queryObj)
        }
    })
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addTextParams = (searchParams: URLSearchParams, queryObj: Record<string, any>) => {
    // Text search parameters
    const textParams = [
        'devata',
        'rishi',
        'chhanda',
        'swara',
        'mantra',
        'mantra_swara',
        'mantra_pad',
        'mantra_pad_swara',
        'mantra_trans'
    ] as const

    textParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
            addTextFilter<RigVeda>(value, param as keyof RigVeda, queryObj)
        }
    })
}