import type React from "react"

const SamaVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    return (
        <div>
            <h1>Sama Veda Single Mantra</h1>
            <p>Mantra Ref Id: {mantraRefId}</p>
        </div>
    )
}

export default SamaVedaSingleMantra
