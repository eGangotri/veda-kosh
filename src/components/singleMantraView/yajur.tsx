import type React from "react"

const YajurVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    return (
        <div>
            <h1>Yajur Veda Single Mantra</h1>
            <p>Mantra Ref Id: {mantraRefId}</p>
        </div>
    )
}

export default YajurVedaSingleMantra
