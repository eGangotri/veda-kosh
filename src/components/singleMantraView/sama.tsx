import type React from "react"
import { useEffect, useState } from "react"
import {
    getMantraCountInYajurvedaByAdhyaya,
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
import { YajurVeda } from "@/types/vedas";
import { findNextYajurvedaMantraByAdhyaya,  findPrevYajurvedaMantraByAdhyaya } from "@/analytics/CorrespondencesUtils";
import Link from "next/link";
import { tokenizeAsLinks } from "./Utils";
import AcknowledgementDialog from "./AcknowledgementDialog";

const SamaVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    const [mantra, setMantra] = useState<YajurVeda | null>(null)

    const TOTAL_ADHYAYAS_IN_YAJURVED = 40
    const [selectedAdhyaya, setSelectedAdhyaya] = useState(1);
    const [mantraCountForSelectedAdhyaya, setMantraCountForSelectedAdhyaya] = useState(0)
    const [selectedMantra, setSelectedMantra] = useState(1);
    const [acknowledgmentOpen, setAcknowledgmentOpen] = useState(false);

    const createValuesForMantra = async (_mantraRefId: string) => {
        const _refId = _mantraRefId.split("/");
        const currentAdhyaya = parseInt(_refId[1]);
        const currentMantra = parseInt(_refId[2]);

        setSelectedAdhyaya(currentAdhyaya);
        setSelectedMantra(currentMantra);

        const mantraCount = getMantraCountInYajurvedaByAdhyaya(currentAdhyaya) ?? 0;

        setMantraCountForSelectedAdhyaya(mantraCount);
        const _mantra = await fetch(`/api/vedas/yajurveda?mantra_ref_id=${_mantraRefId}`)
        const { data } = await _mantra.json()
        if (data && data.length > 0) {
            const _mantra: YajurVeda = data[0]
            setMantra(_mantra)
            console.log(`_mantra: ${JSON.stringify(_mantra)}`)
        }
    }

    const createValuesForAdhyaya = async (adhyayaNo: number, mantraNo: number) => {
        createValuesForMantra(`2/${adhyayaNo}/${mantraNo}`)
    }

    const handleNavigation = (direction: 'prev' | 'next') => {
        if (direction === 'next') {
            const corrMantraRefId = findNextYajurvedaMantraByAdhyaya(selectedAdhyaya, selectedMantra);
            console.log("corrMantraRefId", corrMantraRefId)
            if (corrMantraRefId) {
                createValuesForMantra(corrMantraRefId);
            }
        }
        else {
            const corrMantraRefId = findPrevYajurvedaMantraByAdhyaya(selectedAdhyaya, selectedMantra);
            if (corrMantraRefId) {
                createValuesForMantra(corrMantraRefId);
            }
        }
    };

    useEffect(() => {
        createValuesForMantra(mantraRefId)
    }, [])

    const mantraCount = getMantraCountInYajurvedaByAdhyaya(selectedAdhyaya) || 0;

    const generateNumberBoxes = (count: number) => {
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
                onClick={(e) => createValuesForAdhyaya(selectedAdhyaya, parseInt(e.currentTarget.textContent || "1"))}
            >
                {i + 1}
            </Button>
        ))
    }

    return (
        <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
            <Paper elevation={3} sx={{ p: 3, width: '30%' }}>
                <Typography variant="h6" gutterBottom>
                    समावेद अध्याय
                </Typography>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{my: 2}}>
                        Choose Mantra
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Choose Mantra</InputLabel>
                            <Select
                                value={selectedMantra}
                                label="Choose Mantra"
                                onChange={(e: SelectChangeEvent<number>) => {
                                    const value = e.target.value as number;
                                    setSelectedMantra(value || 1);
                                    createValuesForAdhyaya(selectedAdhyaya, value)
                                }}
                            >
                                <MenuItem value=""><em>Choose Mantra</em></MenuItem>
                                {Array.from({ length: mantraCountForSelectedAdhyaya }, (_, i) => (
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
                            disabled={selectedAdhyaya === 1 && selectedMantra === 1}
                        >
                            <NavigateBefore />
                        </IconButton>
                        <IconButton
                            onClick={() => handleNavigation('next')}
                            disabled={
                                selectedAdhyaya === TOTAL_ADHYAYAS_IN_YAJURVED &&
                                selectedMantra === mantraCountForSelectedAdhyaya
                            }
                        >
                            <NavigateNext />
                        </IconButton>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            <Link href={`/vedas/yajurveda?adhyaya_no=${selectedAdhyaya}`} key="adhyaya-link">{selectedAdhyaya}</Link>/
                            <Link href={`/vedas/yajurveda?mantra_no=${selectedMantra}`} key="mantra-link">{selectedMantra}</Link>
                        </Typography>
                        <Typography variant="h6">
                            Sama Veda  Mantras:
                        </Typography>
                    </Box>
              
                    <Box>
                        {mantra && (
                            <>
                                <Grid container spacing={2} className="mb-4">
                                    <Grid item xs={3}>
                                        <Typography className="text-lg text-blue-600">Rishi: <Link href={`/vedas/yajurveda?rishi=${mantra.rishi}`}>{mantra.rishi}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Devata: <Link href={`/vedas/yajurveda?devata=${mantra.devata}`}>{mantra.devata}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Chhanda: <Link href={`/vedas/yajurveda?chhanda=${mantra.chhanda}`}>{mantra.chhanda}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Swara: <Link href={`/vedas/yajurveda?swara=${mantra.swara}`}>{mantra.swara}</Link></Typography>
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
                                            <Typography color="text.secondary"><Link href={`/vedas/yajurveda?adhyaya_no=${mantra.adhyay_no}`} key="adhyaya-breadcrumb">यजुर्वेद - अध्याय » {mantra.adhyay_no}</Link>
                                            </Typography>
                                            <Typography color="text.secondary"><Link href={`/vedas/yajurveda?mantra_no=${mantra.mantra_no}`} key="mantra-breadcrumb">मन्त्र » {mantra.mantra_no}</Link></Typography>
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

export default SamaVedaSingleMantra
