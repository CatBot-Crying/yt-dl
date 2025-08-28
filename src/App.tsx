import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  createTheme, 
  ThemeProvider, 
  CssBaseline, 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button,
  CircularProgress,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import './App.css';

// Create a dark theme that matches the aesthetic
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: 'rgba(0, 0, 0, 0.5)',
    },
  },
});

const App: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const apiKeys: string[] = [
    'db751b0a05msh95365b14dcde368p12dbd9jsn440b1b8ae7cb',
    '0649dc83c2msh88ac949854b30c2p1f2fe8jsn871589450eb3',
    '0e88d5d689msh145371e9bc7d2d8p17eebejsn8ff825d6291f',
    'ea7a66dfaemshecacaabadeedebbp17b247jsn7966d78a3945',
  ];

  let currentKeyIndex = 0;

  const getNextApiKey = (): string => {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    return apiKeys[currentKeyIndex];
  };

  const youtube_parser = (url: string): string | false => {
    url = url.replace(/\?si=.*/, '');
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7]?.length === 11) ? match[7] : false;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const youtubeID = youtube_parser(inputUrl);

    if (!youtubeID) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid URL',
        text: 'Please enter a valid YouTube or YouTube Music URL.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = getNextApiKey();
      const response = await axios.get<{ link: string }>(
        `https://youtube-mp36.p.rapidapi.com/dl?id=${youtubeID}`,
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
          },
        }
      );

      if (response.data && response.data.link) {
        setDownloadLink(response.data.link);
        setIsSearching(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your MP3 is ready for download.',
        });
      } else {
         throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setInputUrl(''); // Clear the input field
    }
  };

  const handleDownload = () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');
      setDownloadLink(null);
      setIsSearching(true); // Show the search form again after download
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'background.paper',
            backdropFilter: 'blur(10px)',
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h3" component="h1" fontWeight={700} sx={{ opacity: 0.6, mb: 1 }}>
            YouTube to MP3 Converter
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, mb: 3 }}>
            Transform YouTube videos into MP3s in just a few clicks!
          </Typography>

          {isSearching ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500 }}>
              <Stack spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Paste a Youtube video URL link..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#000'
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading || !inputUrl}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  sx={{ minWidth: 140, mb: 4 }}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </Stack>
            </Box>
          ) : (
            downloadLink && (
              <Button
                variant="contained"
                size="large"
                color="success"
                onClick={handleDownload}
                startIcon={<DownloadIcon />}
                sx={{ minWidth: 200, mb: 4 }}
              >
                Download MP3
              </Button>
            )
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
