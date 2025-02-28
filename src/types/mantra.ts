export interface Mantra {
    id: string;
    text: string;
    startingCharacter: string;
    book?: string;
    chapter?: string;
    verse?: string;
}

export interface MantraResponse {
    mantras: Mantra[];
    total: number;
    page: number;
    limit: number;
}
