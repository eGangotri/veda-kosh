import type React from "react"
import { useEffect, useState } from "react"

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
import { SamaVeda } from "@/types/vedas";
import { findNextSamaVedaMantra, findPrevSamaVedaMantra, TOTAL_MANTRAS_IN_SAMAVED } from "@/analytics/CorrespondencesUtils";
import Link from "next/link";
import { tokenizeAsLinks } from "./Utils";
import AcknowledgementDialog from "./AcknowledgementDialog";
import { SAMAVEDA_SERIAL_NO } from "@/analytics/constants";

const SamaVedaSingleMantra: React.FC<{ mantraRefId: string }> = ({ mantraRefId }) => {
    const [mantra, setMantra] = useState<SamaVeda | null>(null)
    const [selectedMantra, setSelectedMantra] = useState(1);
    const [acknowledgmentOpen, setAcknowledgmentOpen] = useState(false);

    const createValuesForMantra = async (_mantraRefId: string) => {
        const _refId = _mantraRefId.split("/");
        const currentMantra =  parseInt(_refId[_refId.length > 2 ?2:1]);
        console.log(`current Mantra ${_refId}`)
        setSelectedMantra(currentMantra);

        const _mantra = await fetch(`/api/vedas/samaveda?mantra_ref_id=${_mantraRefId}`)
        const { data } = await _mantra.json()
        if (data && data.length > 0) {
            const _mantra: SamaVeda = data[0]
            setMantra(_mantra)
            console.log(`_mantra: ${JSON.stringify(_mantra)}`)
        }
    }

    const handleNavigation = (direction: 'prev' | 'next') => {
        if (direction === 'next') {
            const corrMantraRefId = findNextSamaVedaMantra(selectedMantra);
            console.log("corrMantraRefId", corrMantraRefId)
            if (corrMantraRefId) {
                createValuesForMantra(corrMantraRefId);
            }
        }
        else {
            const corrMantraRefId = findPrevSamaVedaMantra(selectedMantra);
            if (corrMantraRefId) {
                createValuesForMantra(corrMantraRefId);
            }
        }
    };

    useEffect(() => {
        createValuesForMantra(mantraRefId)
    }, [])

    return (
        <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
            <Paper elevation={3} sx={{ p: 3, width: '30%' }}>
                <Typography variant="h6" gutterBottom>
                    समावेद अध्याय
                </Typography>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ my: 2 }}>
                        Choose Mantra
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Choose Mantra</InputLabel>
                            <Select
                                value={selectedMantra}
                                label="Choose Mantra"
                                onChange={(e: SelectChangeEvent<number>) => {
                                    console.log(`choose mantra ${e.target.value}`)
                                    const value = e.target.value as number;
                                    setSelectedMantra(value || 1);
                                    createValuesForMantra(`${SAMAVEDA_SERIAL_NO}${value || 1}`);
                                }}
                            >
                                <MenuItem value=""><em>Choose Mantra</em></MenuItem>
                                {Array.from({ length: TOTAL_MANTRAS_IN_SAMAVED }, (_, i) => (
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
                            disabled={selectedMantra === 1}
                        >
                            <NavigateBefore />
                        </IconButton>
                        <IconButton
                            onClick={() => handleNavigation('next')}
                            disabled={
                                selectedMantra === TOTAL_MANTRAS_IN_SAMAVED
                            }
                        >
                            <NavigateNext />
                        </IconButton>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            <Link href={`/vedas/samaveda?mantra_no=${selectedMantra}`} key="mantra-link">{selectedMantra}</Link>
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
                                        <Typography className="text-lg text-blue-600">Rishi: <Link href={`/vedas/samaveda?rishi=${mantra.rishi}`}>{mantra.rishi}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Devata: <Link href={`/vedas/samaveda?devata=${mantra.devata}`}>{mantra.devata}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Chhanda: <Link href={`/vedas/samaveda?chhanda=${mantra.chhanda}`}>{mantra.chhanda}</Link></Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ color: '#2563eb' }} className="text-lg">Swara: <Link href={`/vedas/samaveda?swara=${mantra.swara}`}>{mantra.swara}</Link></Typography>
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
                                        <Breadcrumbs aria-label="samaveda-mantra" className="text-sm">
                                            <Typography color="text.secondary"><Link href={`/vedas/samaveda?mantra_no=${selectedMantra}`} key="adhyaya-breadcrumb">सामवेद - मन्त्र संख्या: {selectedMantra}</Link>
                                            </Typography>
                                        </Breadcrumbs>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                        <InfoOutlined className="text-gray-600" fontSize="small" />
                                        <Breadcrumbs aria-label="shakha-mantra" className="text-sm">
                                            <Typography color="text.secondary">
                                                (कौथुम) उत्तरार्चिकः » प्रपाठक » {mantra.prapathak}; अर्ध-प्रपाठक » {mantra.ardh_prapathak}; दशतिः » {mantra.dashti_no}; सूक्त » {mantra.sukta_no}; मन्त्र » {mantra.mantra_no}
                                            </Typography>
                                        </Breadcrumbs>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                                        <InfoOutlined className="text-gray-600" fontSize="small" />
                                        <Breadcrumbs aria-label="shakha-mantra" className="text-sm">
                                            <Typography color="text.secondary">
                                                (राणानीय) उत्तरार्चिकः » अध्याय » {mantra.adhyay_no}; खण्ड » {mantra.khand_no}; सूक्त » {mantra.sukta2_no}; मन्त्र » {mantra.mantra_no}
                                            </Typography>
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
