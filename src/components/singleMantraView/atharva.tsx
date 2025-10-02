import type React from "react"
import { useEffect, useState } from "react"
import {
    getMantraCountInAtharvavedaBySukta,
    getSuktaCountInAtharvavedaByKand,
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
    IconButton
} from '@mui/material';
import { InfoOutlined, InfoRounded, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { AtharvaVeda } from "@/types/vedas";
import { findNextAtharvavedaMantraByAdhyaya,  findPrevAtharvavedaMantraByAdhyaya } from "@/analytics/CorrespondencesUtils";
import Link from "next/link";
import { tokenizeAsLinks } from "./Utils";
import AcknowledgementDialog from "./AcknowledgementDialog";
import { ATHARVA_SERIAL_NO } from "@/analytics/constants";

const AtharvaVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    const [mantra, setMantra] = useState<AtharvaVeda | null>(null)

    const TOTAL_KAND_IN_ATHARVVED = 20
    const [selectedKand, setSelectedKand] = useState(1);
    const [selectedSukta, setSelectedSukta] = useState(1);
    const [selectedMantra, setSelectedMantra] = useState(1);
    const [acknowledgmentOpen, setAcknowledgmentOpen] = useState(false);
    const [suktaCountForSelectedKand, setSuktaCountForSelectedKand] = useState(0);
    const [mantraCountForSelectedSukta, setMantraCountForSelectedSukta] = useState(0);
    const createValuesForMantra = async (_mantraRefId: string) => {
        const _refId = _mantraRefId.split("/");
        const currentKand = parseInt(_refId[1]);
        const currentSukta = parseInt(_refId[2]);
        const currentMantra = parseInt(_refId[3]);

        setSelectedKand(currentKand);
        setSelectedSukta(currentSukta);
        setSelectedMantra(currentMantra);

        const suktaCount = getSuktaCountInAtharvavedaByKand(currentKand) ?? 0;
        setSuktaCountForSelectedKand(suktaCount);

        const mantraCount = getMantraCountInAtharvavedaBySukta(currentKand, currentSukta) ?? 0;
        setMantraCountForSelectedSukta(mantraCount);

        const _mantra = await fetch(`/api/vedas/atharvaveda?mantra_ref_id=${_mantraRefId}`)
        const { data } = await _mantra.json()
        if (data && data.length > 0) {
            const _mantra: AtharvaVeda = data[0]
            setMantra(_mantra)
            console.log(`_mantra: ${JSON.stringify(_mantra)}`)
        }
    }

    const createValuesForKand = async (kandNo: number) => {
        const _suktaCount = getSuktaCountInAtharvavedaByKand(kandNo) ?? 0;
        const _mantraCount = getMantraCountInAtharvavedaBySukta(kandNo, 1) ?? 0;
        setSelectedKand(kandNo);
        setSelectedSukta(1);
        setSelectedMantra(1);
        setSuktaCountForSelectedKand(_suktaCount);
        setMantraCountForSelectedSukta(_mantraCount);
        createValuesForMantra(`${ATHARVA_SERIAL_NO}/${kandNo}/1/1`);
    }

    const handleNavigation = (direction: 'prev' | 'next') => {
        if (direction === 'next') {
            const corrMantraRefId = findNextAtharvavedaMantraByAdhyaya(selectedKand, selectedSukta, selectedMantra);
            console.log("corrMantraRefId", corrMantraRefId)
            if (corrMantraRefId) {
                createValuesForMantra(corrMantraRefId);
            }
        }
        else {
            const corrMantraRefId = findPrevAtharvavedaMantraByAdhyaya(selectedKand, selectedSukta, selectedMantra);
            if (corrMantraRefId) {
                createValuesForMantra(corrMantraRefId);
            }
        }
    };

    useEffect(() => {
        createValuesForMantra(mantraRefId)
    }, [mantraRefId])


    const generateMantraBoxes = (count: number) => {
        return Array.from({ length: count }, (_, i) => (
            <Button
                key={i}
                variant={selectedMantra === i + 1 ? "contained" : "outlined"}
                sx={{
                    m: 0.3,
                    p: 0.3,
                    aspectRatio: '1',
                    minWidth: 'unset',
                    backgroundColor: undefined, 
                    '&:hover': {
                        backgroundColor: '#283593'
                    }
                }}
                onClick={() => createValuesForMantra(`${ATHARVA_SERIAL_NO}/${selectedKand}/${selectedSukta}/${i + 1}`)}
            >
                {i + 1}
            </Button>
        ))
    }

    return (
        <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
            <Paper elevation={3} sx={{ p: 3, width: '30%' }}>
                <Typography variant="h6" gutterBottom>
                    अथर्ववेद काण्ड
                </Typography>
                <Grid container spacing={1}>
                    {Array.from({ length: TOTAL_KAND_IN_ATHARVVED }, (_, i) => (
                        <Grid item xs={3} key={i}>
                            <Button
                                variant={selectedKand === i + 1 ? "contained" : "outlined"}
                                fullWidth
                                onClick={() => createValuesForKand(i + 1)}
                                sx={{
                                    aspectRatio: '1',
                                    minWidth: 'unset',
                                    backgroundColor: undefined, 
                                    '&:hover': {
                                        backgroundColor: '#283593'
                                    }
                                }}
                            >
                                {i + 1}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{my: 2}}>
                        Choose Based on Kand
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Choose Kand</InputLabel>
                            <Select
                                value={selectedKand || ''}
                                label="Choose Kand"
                                onChange={(e: SelectChangeEvent<number>) => {
                                    const value = e.target.value as number;
                                    setSelectedKand(value)   ;
                                    const _mantraCount = getSuktaCountInAtharvavedaByKand(value) ?? 0;
                                    setSuktaCountForSelectedKand(_mantraCount);
                                }}
                            >
                                <MenuItem value=""><em>Choose Kand</em></MenuItem>
                                {Array.from({ length: TOTAL_KAND_IN_ATHARVVED }, (_, i) => (
                                    <MenuItem key={i} value={i + 1}>Kand {i + 1}</MenuItem>
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
                                    setSelectedSukta(value)   ;
                                    const _mantraCount = getMantraCountInAtharvavedaBySukta(selectedKand, value) ?? 0;
                                    setMantraCountForSelectedSukta(_mantraCount);
                                }}
                            >
                                <MenuItem value=""><em>Choose Sukta</em></MenuItem>
                                {Array.from({ length: suktaCountForSelectedKand }, (_, i) => (
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
                                    createValuesForMantra(`${ATHARVA_SERIAL_NO}/${selectedKand}/${selectedSukta}/${value}`)
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

            </Paper>

            <Box sx={{ width: '70%' }}>
                {/* Sukta and Mantras Section */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => handleNavigation('prev')}
                            disabled={selectedKand === 1 && selectedMantra === 1}
                        >
                            <NavigateBefore />
                        </IconButton>
                        <IconButton
                            onClick={() => handleNavigation('next')}
                            disabled={
                                selectedKand === TOTAL_KAND_IN_ATHARVVED &&
                                selectedMantra === mantraCountForSelectedSukta
                            }
                        >
                            <NavigateNext />
                        </IconButton>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            <Link href={`/vedas/atharvaveda?kand_no=${selectedKand}`} key="kand-link">{selectedKand}</Link>/
                            <Link href={`/vedas/atharvaveda?sukta_no=${selectedSukta}`} key="sukta-link">{selectedSukta}</Link>/
                            <Link href={`/vedas/atharvaveda?mantra_no=${selectedMantra}`} key="mantra-link">{selectedMantra}</Link>
                        </Typography>
                        <Typography variant="h6">
                            Atharva Ved Kand {selectedKand} Sukta {selectedSukta} Mantras:
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {generateMantraBoxes(mantraCountForSelectedSukta || 0)}
                    </Box>
                    <Box>
                        {mantra && (
                            <>
                                <Grid container spacing={2} className="mb-4">
                                    <Grid item xs={3}>
                                        <Typography className="text-lg text-blue-600">Rishi: <Link href={`/vedas/atharvaveda?rishi=${mantra.rishi}`}>{mantra.rishi}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Devata: <Link href={`/vedas/atharvaveda?devata=${mantra.devata}`}>{mantra.devata}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Chhanda: <Link href={`/vedas/atharvaveda?chhanda=${mantra.chhanda}`}>{mantra.chhanda}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Swara: <Link href={`/vedas/atharvaveda?swara=${mantra.suktam}`}>{mantra.suktam}</Link></Typography>
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
                                        <Breadcrumbs aria-label="adhyaya-sukta-mantra" className="text-sm">
                                            <Typography color="text.secondary"><Link href={`/vedas/atharvaveda?kand_no=${mantra.kand_no}`} key="kand-breadcrumb">यजुर्वेद - काण्ड » {mantra.kand_no}</Link></Typography>
                                            <Typography color="text.secondary"><Link href={`/vedas/atharvaveda?mantra_no=${mantra.sukta_no}`} key="sukta-breadcrumb">सुक्त » {mantra.sukta_no}</Link></Typography>
                                            <Typography color="text.secondary"><Link href={`/vedas/atharvaveda?mantra_no=${mantra.mantra_no}`} key="mantra-breadcrumb">मन्त्र » {mantra.mantra_no}</Link></Typography>
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
                                    <AcknowledgementDialog open={acknowledgmentOpen} onClose={() => setAcknowledgmentOpen(false)} />
                                </Box>
                            </>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default AtharvaVedaSingleMantra
