export function getVedaNameByVedaId(vedaId: number|string): string {
    switch (parseInt(vedaId.toString())) {   
        case 1:
            return "Rig Veda"
        case 2:
            return "Yajur Veda"
        case 3:
            return "Sama Veda"
        case 4:
            return "Atharva Veda"
        default:
            return "Unknown"
    }
}
export const INITIAL_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [INITIAL_PAGE_SIZE, 50, 100]