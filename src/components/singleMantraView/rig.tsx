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

import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Button,
    Typography,
    Box,
    Grid,
    Paper,
    SelectChangeEvent
} from '@mui/material';

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
            <Button
                key={i}
                variant="outlined"
                sx={{ m: 0.5 }}
                onClick={() => console.log(`Clicked ${i + 1}`)}
            >
                {i + 1}
            </Button>
        ))
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Sukta and Mantras Section */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Rig Ved Mandala {mandalaNo} Sukta {suktaNo} Mantras:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {generateNumberBoxes(mantraCount || 0)}
                        </Box>
                    </Grid>

                    {/* Mandala Based Selection */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Choose Based on Mandala
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Choose Mandala</InputLabel>
                                <Select
                                    value={selectedMandala || ''}
                                    label="Choose Mandala"
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setSelectedMandala(value);
                                        const _suktaCount = getSuktaCountInMandalaForRigVeda(value) ?? 0;
                                        setSuktaCountForSelectedMandala(_suktaCount);
                                        const _mantraCount = getMantraCountInSuktaForRigVeda(value, 1) ?? 0;
                                        setMantraCount(_mantraCount);
                                    }}
                                >
                                    <MenuItem value=""><em>Choose Mandala</em></MenuItem>
                                    {Array.from({ length: mandalaCount }, (_, i) => (
                                        <MenuItem key={i} value={i + 1}>Mandala {i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Choose Sukta</InputLabel>
                                <Select
                                    value={selectedSukta || ''}
                                    label="Choose Sukta"
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setSelectedSukta(value);
                                        const _mantraCount = getMantraCountInSuktaForRigVeda(selectedMandala, value) ?? 0;
                                        setMantraCountForSelectedSukta(_mantraCount);
                                    }}
                                >
                                    <MenuItem value=""><em>Choose Sukta</em></MenuItem>
                                    {Array.from({ length: suktaCountForSelectedMandala }, (_, i) => (
                                        <MenuItem key={i} value={i + 1}>Sukta {i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Choose Mantra</InputLabel>
                                <Select
                                    value={mantraNo || ''}
                                    label="Choose Mantra"
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setMantraNo(value);
                                    }}
                                >
                                    <MenuItem value=""><em>Choose Mantra</em></MenuItem>
                                    {Array.from({ length: mantraCountForSelectedSukta }, (_, i) => (
                                        <MenuItem key={i} value={i + 1}>Mantra {i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    {/* Ashtaka Based Selection */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Choose Based on Ashtaka
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Choose Ashtaka</InputLabel>
                                <Select
                                    value={selectedAshtak || ''}
                                    label="Choose Ashtaka"
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setSelectedAshtak(value);
                                        const adhyayaCount = getAdhyayaCountInAshtakaForRigVeda(value) ?? 0;
                                        setSelectedAdhyayaCount(adhyayaCount);
                                    }}
                                >
                                    <MenuItem value=""><em>Choose Ashtaka</em></MenuItem>
                                    {Array.from({ length: ashtakaCount }, (_, i) => (
                                        <MenuItem key={i} value={i + 1}>Ashtaka {i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Choose Adhyaya</InputLabel>
                                <Select
                                    value={selectedAdhyaya || ''}
                                    label="Choose Adhyaya"
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setSelectedAdhyaya(value);
                                        const vargaCount = getVargaCountInAshtakaForRigVeda(selectedAshtak, value) ?? 0;
                                        setSelectedVargaCount(vargaCount);
                                    }}
                                >
                                    <MenuItem value=""><em>Choose Adhyaya</em></MenuItem>
                                    {Array.from({ length: selectedAdhyayaCount }, (_, i) => (
                                        <MenuItem key={i} value={i + 1}>Adhyaya {i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Choose Varga</InputLabel>
                                <Select
                                    value={selectedVarga || ''}
                                    label="Choose Varga"
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setSelectedVarga(value);
                                        const mantraCount2 = getMantraCountInVargaForRigVeda(selectedAshtak, selectedAdhyaya, value) ?? 0;
                                        setSelectedMantraClassification2Count(mantraCount2);
                                    }}
                                >
                                    <MenuItem value=""><em>Choose Varga</em></MenuItem>
                                    {Array.from({ length: selectedVargaCount }, (_, i) => (
                                        <MenuItem key={i} value={i + 1}>Varga {i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Choose Mantra</InputLabel>
                                <Select
                                    value={selectedMantraClassification2 || ''}
                                    label="Choose Mantra"
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setSelectedMantraClassification2(value);
                                    }}
                                >
                                    <MenuItem value=""><em>Choose Mantra</em></MenuItem>
                                    {Array.from({ length: selectedMantraClassification2Count }, (_, i) => (
                                        <MenuItem key={i} value={i + 1}>Mantra {i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    {/* Navigation Link */}
                    <Grid item xs={12}>
                        <Link
                            href="/rig-veda"
                            style={{ color: '#1976d2', textDecoration: 'none' }}
                        >
                            Go to Rig Veda Main Page
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

export default RigVedaSingleMantra
