import Link from "next/link"

export const tokenizeAsLinks = (text: string) => {
    const words = text.split(" ")
    const links = words.map((word,index) => {
        return (<><Link 
            style={{ textDecoration: 'none', color: '#2563eb', paddingRight: '0.1rem' }}
            key={index} href={`/vedas/rigveda?mantra=${word}`}>{word}</Link>&nbsp;</>)
    })
    return links
}