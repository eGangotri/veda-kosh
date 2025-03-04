import type React from "react"
import { useEffect, useState } from "react"
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
    SelectChangeEvent,
    Breadcrumbs,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import { InfoOutlined, InfoRounded, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { RigVeda } from "@/types/vedas";
import { findMantraRefIdByAshtakCorrespondences, findNextMantraByMandala, findPrevMantraByMandala } from "@/analytics/CorrespondencesUtils";
import Link from "next/link";
import { tokenizeAsLinks } from "./Utils";

const RigVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    const [mantra, setMantra] = useState<RigVeda | null>(null)

    const [mandalaNo, setMandalaNo] = useState(0)
    const [suktaNo, setSuktaNo] = useState(0)
    const [mantraNo, setMantraNo] = useState(0)

    const mandalaCount = 10

    const [selectedMandala, setSelectedMandala] = useState(1);
    const [suktaCountForSelectedMandala, setSuktaCountForSelectedMandala] = useState(0)

    const [selectedSukta, setSelectedSukta] = useState(1);
    const [mantraCountForSelectedSukta, setMantraCountForSelectedSukta] = useState(0)

    const [selectedMantra, setSelectedMantra] = useState(1);
    const [ashtakaCount] = useState(8)

    const [selectedAshtak, setSelectedAshtak] = useState(1);
    const [selectedAdhyaya, setSelectedAdhyaya] = useState(1);
    const [selectedVarga, setSelectedVarga] = useState(1);
    const [selectedMantraClassification2, setSelectedMantraClassification2] = useState(1);

    const [selectedAdhyayaCount, setSelectedAdhyayaCount] = useState(0);
    const [selectedVargaCount, setSelectedVargaCount] = useState(0);
    const [selectedMantraClassification2Count, setSelectedMantraClassification2Count] = useState(0);
    const [acknowledgmentOpen, setAcknowledgmentOpen] = useState(false);

    const onAshtakaSystemChanges = (_selectedAshtak: number, _selectedAdhyaya: number, _selectedVarga: number, _selectedMantraClassification2: number) => {
        const _mantraRefId = findMantraRefIdByAshtakCorrespondences(_selectedAshtak, _selectedAdhyaya, _selectedVarga, _selectedMantraClassification2);
        if (_mantraRefId) {
            createValues(_mantraRefId)
        }
    }

    const createValues = async (_mantraRefId: string) => {
        const mantra = _mantraRefId.split("/");
        const veda = mantra[0];
        const currentMandala = parseInt(mantra[1]);
        const currentSukta = parseInt(mantra[2]);
        const currentMantra = parseInt(mantra[3]);

        setMandalaNo(currentMandala);
        setSuktaNo(currentSukta);
        setMantraNo(currentMantra);

        setSelectedMandala(currentMandala);
        setSelectedSukta(currentSukta);
        setSelectedMantra(currentMantra);

        const _suktaCount = getSuktaCountInMandalaForRigVeda(currentMandala) ?? 0;
        const _mantraCount = getMantraCountInSuktaForRigVeda(currentMandala, currentSukta) ?? 0;

        setSuktaCountForSelectedMandala(_suktaCount);
        setMantraCountForSelectedSukta(_mantraCount);
        const _mantra = await fetch(`/api/vedas/rigveda?mantra_ref_id=${_mantraRefId}`)
        const { data } = await _mantra.json()
        if (data && data.length > 0) {
            const _mantra: RigVeda = data[0]
            setMantra(_mantra)
            console.log(`_mantra: ${JSON.stringify(_mantra)}`)
            setSelectedAshtak(_mantra.ashtak_no)

            const adhyayaCount = getAdhyayaCountInAshtakaForRigVeda(_mantra.ashtak_no) || 1
            setSelectedAdhyayaCount(adhyayaCount);

            const vargaCount = getVargaCountInAshtakaForRigVeda(_mantra.ashtak_no, _mantra.adhyay_no) || 1;
            setSelectedVargaCount(vargaCount);

            const mantraCount2 = getMantraCountInVargaForRigVeda(_mantra.ashtak_no, _mantra.adhyay_no, _mantra.mantra2_no) || 1;
            setSelectedMantraClassification2Count(mantraCount2);

            setSelectedAdhyaya(_mantra.adhyay_no)
            setSelectedVarga(_mantra.varga_no)
            setSelectedMantraClassification2(_mantra.mantra2_no)

            console.log(`adhyayaCount: ${adhyayaCount}, vargaCount: ${vargaCount}, mantraCount2: ${mantraCount2}
                _mantra.adhyay_no: ${_mantra.adhyay_no},
                _mantra.varga_no: ${_mantra.varga_no},
                _mantra.mantra2_no: ${_mantra.mantra2_no}`)

        }
    }

    const createValuesForMandala = async (mandalaNo: number, suktaNo: number, mantraNo: number) => {
        createValues(`1/${mandalaNo}/${suktaNo}/${mantraNo}`)
    }

    const handleNavigation = (direction: 'prev' | 'next') => {
        if (direction === 'next') {
            const corrMantraRefId = findNextMantraByMandala(selectedMandala, selectedSukta, selectedMantra);
            console.log("corrMantraRefId", corrMantraRefId)
            if (corrMantraRefId) {
                createValues(corrMantraRefId);
            }
        }
        else {
            const corrMantraRefId = findPrevMantraByMandala(selectedMandala, selectedSukta, selectedMantra);
            if (corrMantraRefId) {
                createValues(corrMantraRefId);
            }
        }
    };

    useEffect(() => {
        createValues(mantraRefId)
    }, [])

    const generateNumberBoxes = (count: number) => {
        return Array.from({ length: count }, (_, i) => (
            <Button
                key={i}
                variant="outlined"
                sx={{ m: 0.5 }}
                onClick={(e) => createValuesForMandala(selectedMandala, selectedSukta, parseInt(e.currentTarget.textContent || "1"))}
            >
                {i + 1}
            </Button>
        ))
    }

    return (
        <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
            <Paper elevation={3} sx={{ p: 3, width: '30%' }}>
                <Grid container spacing={3}>
                    {/* Mandala Based Selection */}
                    <Grid item xs={12}>
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
                                        setMantraCountForSelectedSukta(_mantraCount);
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
                                    value={selectedMantra}
                                    label="Choose Mantra"
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setSelectedMantra(value || 1);
                                        createValuesForMandala(selectedMandala, selectedSukta, value)
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
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Choose Based on Ashtaka
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Choose Ashtaka</InputLabel>
                                <Select
                                    value={selectedAshtak || ''}
                                    label={"Choose Ashtaka." + selectedAshtak}
                                    onChange={(e: SelectChangeEvent<number>) => {
                                        const value = e.target.value as number;
                                        setSelectedAshtak(value);
                                        const adhyayaCount = getAdhyayaCountInAshtakaForRigVeda(value) ?? 0;
                                        setSelectedAdhyayaCount(adhyayaCount);
                                        onAshtakaSystemChanges(value, selectedAdhyaya, selectedVarga, selectedMantraClassification2)
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
                                        onAshtakaSystemChanges(selectedAshtak, value, selectedVarga, selectedMantraClassification2)

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
                                        onAshtakaSystemChanges(selectedAshtak, selectedAdhyaya, value, selectedMantraClassification2)
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
                                        onAshtakaSystemChanges(selectedAshtak, selectedAdhyaya, selectedVarga, value)
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
                </Grid>
            </Paper>

            <Box sx={{ width: '70%' }}>
                {/* Sukta and Mantras Section */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => handleNavigation('prev')}
                            disabled={selectedMandala === 1 && selectedSukta === 1 && selectedMantra === 1}
                        >
                            <NavigateBefore />
                        </IconButton>
                        <IconButton
                            onClick={() => handleNavigation('next')}
                            disabled={
                                selectedMandala === mandalaCount &&
                                selectedSukta === suktaCountForSelectedMandala &&
                                selectedMantra === mantraCountForSelectedSukta
                            }
                        >
                            <NavigateNext />
                        </IconButton>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                        <Link href={`/vedas/rigveda?mandal_no=${selectedMandala}`}>{selectedMandala}</Link>/
                        <Link href={`/vedas/rigveda?sukta_no=${selectedSukta}`}>{selectedSukta}</Link>/
                        <Link href={`/vedas/rigveda?mantra_no=${selectedMantra}`}>{selectedMantra}</Link>
                        </Typography>
                        <Typography variant="h6">
                            Rig Ved Mandala {mandalaNo} Sukta {suktaNo} Mantras:
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {generateNumberBoxes(mantraCountForSelectedSukta || 0)}
                    </Box>
                    <Box>
                        {mantra && (
                            <>
                                <Grid container spacing={2} className="mb-4">
                                    <Grid item xs={3}>
                                        <Typography className="text-lg text-blue-600">Rishi: <Link href={`/vedas/rigveda?rishi=${mantra.rishi}`}>{mantra.rishi}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Devata: <Link href={`/vedas/rigveda?devata=${mantra.devata}`}>{mantra.devata}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Chhanda: <Link href={`/vedas/rigveda?chhanda=${mantra.chhanda}`}>{mantra.chhanda}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Swara: <Link href={`/vedas/rigveda?swara=${mantra.swara}`}>{mantra.swara}</Link></Typography>
                                    </Grid>
                                </Grid>
                                <Box>
                                    <Typography variant="body1" gutterBottom sx={{ color: '#2563eb' }} className="text-lg">
                                        {mantra.mantra_swara}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Svara Sahit Pada Path
                                    </Typography>

                                    <Typography variant="body1" gutterBottom>
                                        {mantra.mantra_pad_swara}
                                    </Typography>

                                    <Typography variant="body1" gutterBottom>
                                        Svara Rahit Mantra
                                    </Typography>

                                    <Typography variant="body1" gutterBottom>
                                        {tokenizeAsLinks(mantra.mantra)}
                                    </Typography>

                                    <Typography variant="body1" gutterBottom>
                                        Svara Rahit Pada Path
                                    </Typography>

                                    <Typography variant="body1" gutterBottom>
                                        {mantra.mantra_pad}
                                    </Typography>
                                </Box>

                                <Box className="space-y-4">
                                    {/* First Breadcrumb */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1 }}>
                                        <InfoOutlined className="text-gray-600" fontSize="small" />
                                        <Breadcrumbs aria-label="mandala-sukta-mantra" className="text-sm">
                                            <Typography color="text.secondary">ऋग्वेद - मण्डल » {mantra.mandal_no}</Typography>
                                            <Typography color="text.secondary">सूक्त » {mantra.sukta_no}</Typography>
                                            <Typography color="text.secondary">मन्त्र » {mantra.mantra_no}</Typography>
                                        </Breadcrumbs>
                                    </Box>

                                    {/* Second Breadcrumb */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1 }}>
                                        <InfoOutlined sx={{ marginRight: 1 }} fontSize="small" />
                                        <Breadcrumbs aria-label="ashtak-adhyay-varga-mantra" className="text-sm">
                                            <Typography color="text.secondary">अष्टक » {mantra.ashtak_no}</Typography>
                                            <Typography color="text.secondary">अध्याय » {mantra.adhyay_no}</Typography>
                                            <Typography color="text.secondary">वर्ग » {mantra.varga_no}</Typography>
                                            <Typography color="text.secondary">मन्त्र » {mantra.mantra2_no}</Typography>
                                        </Breadcrumbs>
                                    </Box>

                                    {/* Acknowledgment Button */}
                                    <Box className="flex items-center space-x-2">
                                        <InfoRounded className="text-blue-500" fontSize="small" />
                                        <Button
                                            size="small"
                                            onClick={() => setAcknowledgmentOpen(true)}
                                            className="text-sm text-blue-500"
                                        >
                                            Acknowledgement
                                        </Button>
                                    </Box>

                                    {/* Acknowledgment Dialog */}
                                    <Dialog
                                        open={acknowledgmentOpen}
                                        onClose={() => setAcknowledgmentOpen(false)}
                                        maxWidth="sm"
                                        fullWidth
                                    >
                                        <DialogTitle>Acknowledgment</DialogTitle>
                                        <DialogContent>
                                            <Box className="space-y-2">
                                                <Typography><strong>Book Scanning By:</strong> Sri Durga Prasad Agarwal</Typography>
                                                <Typography><strong>Typing By:</strong> N/A</Typography>
                                                <Typography><strong>Conversion to Unicode/OCR By:</strong> Dr. Naresh Kumar Dhiman (Chair Professor, MDS University, Ajmer)</Typography>
                                                <Typography><strong>Donation for Typing/OCR By:</strong> N/A</Typography>
                                                <Typography><strong>First Proofing By:</strong> Acharya Chandra Dutta Sharma</Typography>
                                                <Typography><strong>Second Proofing By:</strong> Pending</Typography>
                                                <Typography><strong>Third Proofing By:</strong> Pending</Typography>
                                                <Typography><strong>Donation for Proofing By:</strong> N/A</Typography>
                                                <Typography><strong>Databasing By:</strong> Sri Jitendra Bansal</Typography>
                                                <Typography><strong>Websiting By:</strong> Sri Raj Kumar Arya</Typography>
                                                <Typography><strong>Donation For Websiting By:</strong> Manuj Sangwan</Typography>
                                                <Typography><strong>Co-ordination By:</strong> Sri Virendra Agarwal</Typography>
                                            </Box>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setAcknowledgmentOpen(false)}>Close</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default RigVedaSingleMantra
