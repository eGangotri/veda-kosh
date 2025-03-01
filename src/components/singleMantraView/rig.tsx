import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { 
    getMantraCountInSuktaForRigVeda, 
    getSuktaCountInMandalaForRigVeda,
    getAdhyayaCountInAshtakaForRigVeda,
    getVargaCountInAshtakaForRigVeda,
    getMantraCountInVargaForRigVeda
} from "@/analytics/StatsUtils"

const RigVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    const [mantra, setMantra] = useState<string>("")

    const [mandalaNo, setMandalaNo] = useState(0)
    const [suktaNo, setSuktaNo] = useState(0)
    const [mantraNo, setMantraNo] = useState(0)

    const [mandalaCount, setMandalaCount] = useState(10)
    const [suktaCount, setSuktaCount] = useState(0)
    const [mantraCount, setMantraCount] = useState(0)

    const [selectedMandala, setSelectedMandala] = useState(0);
    const [suktaCountForSelectedMandala, setSuktaCountForSelectedMandala] = useState(0)
    const [selectedSukta, setSelectedSukta] = useState(0);
    const [mantraCountForSelectedSukta, setMantraCountForSelectedSukta] = useState(0)

    const [ashtakNo, setAshtakNo] = useState(0)
    const [adhyayaNo, setAdhyayaNo] = useState(0)
    const [vargaNo, setVargaNo] = useState(0)
    const [mantraClassification2, setMantraClassification2] = useState(0)

    const [ashtakaCount] = useState(8)
    const [adhyayaCount, setAdhyayaCount] = useState(0)
    const [vargaCount, setVargaCount] = useState(0)
    const [mantraClassification2Count, setMantraClassification2Count] = useState(0)

    const [selectedAshtak, setSelectedAshtak] = useState(0);
    const [selectedAdhyaya, setSelectedAdhyaya] = useState(0);
    const [selectedVarga, setSelectedVarga] = useState(0);
    const [selectedMantraClassification2, setSelectedMantraClassification2] = useState(0);

    const [selectedAshtakCount, setSelectedAshtakCount] = useState(0);
    const [selectedAdhyayaCount, setSelectedAdhyayaCount] = useState(0);
    const [selectedVargaCount, setSelectedVargaCount] = useState(0);
    const [selectedMantraClassification2Count, setSelectedMantraClassification2Count] = useState(0);

    useEffect(() => {
        const mantra = mantraRefId.split("/");
        const veda = mantra[0];
        const currentMandala = parseInt(mantra[1]);
        const currentSukta = parseInt(mantra[2]);

        setMandalaNo(currentMandala);
        setSuktaNo(currentSukta);
        setMantraNo(parseInt(mantra[3]));

        setSelectedMandala(currentMandala);
        setSelectedSukta(currentSukta);

        const suktaCount = getSuktaCountInMandalaForRigVeda(currentMandala) ?? 0;
        const mantraCount = getMantraCountInSuktaForRigVeda(currentMandala, currentSukta) ?? 0;

        setSuktaCountForSelectedMandala(suktaCount);
        setSuktaCount(suktaCount);
        setMantraCount(mantraCount);
    }, [mantraRefId])

    const generateNumberBoxes = (count: number) => {
        return Array.from({ length: count }, (_, i) => (
            <button
                key={i}
                className="m-1 p-2 border rounded hover:bg-gray-100"
                onClick={() => console.log(`Clicked ${i + 1}`)}
            >
                {i + 1}
            </button>
        ))
    }

    return (
        <div className="flex h-screen">
            {/* Left Panel - 30% */}
            <div className="w-[30%] p-4 border-r overflow-y-auto">
                <div className="space-y-6">
                    {/* Sukta and Mantras Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Rig Ved Mandala {mandalaNo} Sukta {suktaNo} Mantras:</h2>
                        <div className="flex flex-wrap">
                            {generateNumberBoxes(mantraCount || 0)}
                        </div>
                    </div>

                    {/* Mandala Based Selection */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Choose Based on Mandala</h2>
                        <div className="space-y-2">
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => {
                                    setSelectedMandala(parseInt(e.target.value))
                                    const _suktaCount = getSuktaCountInMandalaForRigVeda(parseInt(e.target.value)) ?? 0;
                                    setSuktaCountForSelectedMandala(_suktaCount);
                                    const _mantraCount = getMantraCountInSuktaForRigVeda(parseInt(e.target.value), 1) ?? 0;
                                    setMantraCount(_mantraCount);
                                }
                                }
                            >
                                <option value="">Choose Mandala</option>
                                {Array.from({ length: mandalaCount }, (_, i) => (
                                    <option key={i} value={i + 1}>Mandala {i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => {
                                    setSelectedSukta(parseInt(e.target.value))
                                    const _mantraCount = getMantraCountInSuktaForRigVeda(selectedMandala, parseInt(e.target.value)) ?? 0;
                                    setMantraCountForSelectedSukta(_mantraCount);
                                }
                                }
                            >
                                <option value="">Choose Sukta</option>
                                {Array.from({ length: suktaCountForSelectedMandala }, (_, i) => (
                                    <option key={i} value={i + 1}>Sukta {i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => setMantraNo(parseInt(e.target.value))}
                            >
                                <option value="">Choose Mantra</option>
                                {Array.from({ length: mantraCountForSelectedSukta }, (_, i) => (
                                    <option key={i} value={i + 1}>Mantra {i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Ashtaka Based Selection */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Choose Based on Ashtaka</h2>
                        <div className="space-y-2">
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => {
                                    const ashtakNo = parseInt(e.target.value);
                                    setSelectedAshtak(ashtakNo);
                                    const adhyayaCount = getAdhyayaCountInAshtakaForRigVeda(ashtakNo) ?? 0;
                                    setAdhyayaCount(adhyayaCount);
                                }}
                            >
                                <option value="">Choose Ashtaka</option>
                                {Array.from({ length: ashtakaCount }, (_, i) => (
                                    <option key={i} value={i + 1}>Ashtaka {i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => {
                                    const adhyayaNo = parseInt(e.target.value);
                                    setAdhyayaNo(adhyayaNo);
                                    const vargaCount = getVargaCountInAshtakaForRigVeda(ashtakNo, adhyayaNo) ?? 0;
                                    setVargaCount(vargaCount);
                                }}
                            >
                                <option value="">Choose Adhyaya</option>
                                {Array.from({ length: selectedAdhyayaCount }, (_, i) => (
                                    <option key={i} value={i + 1}>Adhyaya {i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => {
                                    const vargaNo = parseInt(e.target.value);
                                    setSelectedVarga(vargaNo);    
                                    const mantraCount = getMantraCountInVargaForRigVeda(ashtakNo, adhyayaNo, vargaNo) ?? 0;
                                    setSelectedMantraClassification2Count(mantraCount);
                                }}
                            >
                                <option value="">Choose Varga</option>
                                {Array.from({ length: selectedVargaCount }, (_, i) => (
                                    <option key={i} value={i + 1}>Varga {i + 1}</option>
                                ))}
                            </select>
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => setSelectedMantraClassification2(parseInt(e.target.value))}
                            >
                                <option value="">Choose Mantra</option>
                                {Array.from({ length: selectedMantraClassification2Count }, (_, i) => (
                                    <option key={i} value={i + 1}>Mantra {i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Navigation Link */}
                    <div className="mt-4">
                        <Link
                            href="/rig-veda"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Go to Rig Veda Main Page
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Panel - 70% */}
            <div className="w-[70%] p-4 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Rig Veda Single Mantra</h1>
                <p>Mantra Ref Id: {mantraRefId}</p>
                <div className="mt-4">
                    {mantra || "Select a mantra to view its content"}
                </div>
            </div>
        </div>
    )
}

export default RigVedaSingleMantra
