import type React from "react"
import { useState } from "react"

const RigVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    const [mantra, setMantra] = useState<string>("")
    
    return (
        <div>
            <h1>Rig Veda Single Mantra</h1>
            <p>Mantra Ref Id: {mantraRefId}</p>
        </div>
    )
}

export default RigVedaSingleMantra
