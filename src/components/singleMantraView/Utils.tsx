import Link from "next/link"

export const tokenizeAsLinks = (text: string) => {
    if (!text) return null;
    
    const words = text.split(" ")
    return words.map((word, index) => {
        return (
            <Link 
                style={{ textDecoration: 'none', color: '#2563eb', paddingRight: '0.1rem' }}
                key={`word-${index}-${word}`} 
                href={`/vedas/rigveda?mantra=${word}`}
            >
                {word}{index < words.length - 1 ? ' ' : ''}
            </Link>
        )
    })
}