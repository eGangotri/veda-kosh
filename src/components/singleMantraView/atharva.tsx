import type React from "react"

const AtharvaVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    return (
        <div>
            <h1>Atharva Veda Single Mantra</h1>
            <p>Mantra Ref Id: {mantraRefId}</p>
        </div>
    )
}

export default AtharvaVedaSingleMantra
