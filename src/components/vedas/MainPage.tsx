"use client"
import {
  Box,
  Typography,
  TextField,
  Link,
  Button,
  Container,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Snackbar,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useCallback, useState } from "react"

const theme = createTheme({
  palette: {
    primary: {
      main: "#4a148c",
    },
    secondary: {
      main: "#ff6e40",
    },
  },
})

export default function MainPage() {
  const [mantras, setMantras] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const handleSnackbarOpen = useCallback((message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }, [])

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  const searchAllVedas = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/vedas/all?${searchTerm}`)
      const data: { data: any[] } = await response.json()
      setMantras(data.data)
    } catch (error) {
      console.error("Error fetching mantras:", error)
      handleSnackbarOpen("Error fetching data")
    } finally {
      setLoading(false)
    }
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" component="h1" sx={{ mt: 10 }} gutterBottom>
        Veda Kosh
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Divine Vedas - Free portal to read Vedas
      </Typography>

      <Box sx={{ width: "100%", mt: 4, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Vedas"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={searchAllVedas}>
                Search
              </Button>
            ),
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Link href="#" color="secondary">
            Advanced Search
          </Link>
        </Box>
      </Box>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        {["Rig Veda", "Yajur Veda", "Sama Veda", "Atharva Veda"].map((veda) => (
          <Grid item key={veda}>
            <Button variant="outlined" color="primary">
              {veda}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography variant="body1" paragraph align="justify">
        The word 'Veda' is derived from the root word विद् (Vid), which means Knowledge and the suffix word घञ्
        (Ghanc) which relates to Action. There are four Vedas [viz., 'RigVeda', 'YajurVeda', 'SaamaVeda', and
        'AtharvaVeda'], which were enlightened to the four meditative seers [viz., Agni, Vaayu, Aaditya and Angiraa]
        in the beginning of human civilization. [1]
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        Veda Mantras can have three types of meanings [viz., Yagyika / AdhiBhautika (Science or Action based),
        AdhiDaivika (Praise of Greatness), and Adhyatmika (Spiritual)]. Vedas do not contain history of any given
        community or geography of any given location. Many names in history and geography are derived from the words
        in Vedas and not vice versa. Mantra YV.36.1[2] gives a poetic hint at the key subject matter of each of the
        four Vedas, viz., RigVeda propounds knowledge and speech. YajurVeda develops the mind which is the source of
        all actions. SaamaVeda develops life energies and focus. [AtharvaVeda] perfects me, body and senses like
        eyes and ears.
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        Vedas are in 'Vedic Sanskrit' language. In Vedic Sanskrit, each word can have many meanings and each thing
        can have many words for it. Moreover, unlike Sanskrit but similar to Mandarin, words in Vedic Sanskrit carry
        tonal / accent marks ('Swar Chinh'), which influences their meaning. To understand Vedas, one needs to know
        the Six Vedangas [viz., [i] Siksha (~Alphabets, pronunciation and their significance), [ii] Kalpa (~Rites,
        conduct, etc), [iii] Vyakarana (~Grammar), [iv] Nirukta (~Etymology), [v] Chhanda (~Meters), and [vi]
        Jyotisha (~Mathematics & Astronomy)].
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        The compilation of vedic verses (Veda Mantras) alongwith its classification in chapters, subchapters and
        tags such as Rishi, Devata, Chhanda, etc are called 'Veda Samhitas'.
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        Through ages, many who got enlightened with the true meaning of one or many Veda Mantras were called
        'Rishi'. Names of some Rishis are still available as tags to each Veda Mantra.
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        Each Veda Mantra praises one or more qualities of the One Supreme God. Each such godly quality in a more
        personified way is called 'Devata' (Divinity). Each Veda Mantra has one or more such Devatas.
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        Each Veda Mantra is laid in a particular poetic meter called 'Chhanda'.
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        Similarly, each Veda Mantra is sung in one of the seven musical notes called 'Swara'.
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        Many such compilations were done in the ancient past. Some even had additional / explanatory notes. Each
        such compilation was called a "XYZ Shakha Samhita" carrying the name of, perhaps, the compiling Rishi, such
        as Shaunaka Shakha Samhita, Madhyandina Shakha Samhita, etc.
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        "The Vedas are the Scriptures of all true knowledge. It is the paramount duty of all righteous persons to
        read, teach, hear and to recite them". (2nd Principle of the Arya Samaj).
      </Typography>

      <Typography variant="body1" paragraph align="justify">
        Recommended Reading: Introduction to Vedas by Swami Dayanand Saraswati [Translated from Sanskrit to English
        by Parmanand].
      </Typography>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

