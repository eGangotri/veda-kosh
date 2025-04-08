import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';

interface AcknowledgementDialogProps {
    open: boolean;
    onClose: () => void;
}

const AcknowledgementDialog: React.FC<AcknowledgementDialogProps> = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AcknowledgementDialog;