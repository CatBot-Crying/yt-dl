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

// ... (Theme code remains the same)
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

// FIX: Define a type that can represent both a success and an error response from our API
type ApiResponse = {
  link: string;
  error?: never; // 'never' ensures that if 'link' exists, 'error' cannot.
} | {
  link?: never; // Ensures that if 'error' exists, 'link' cannot.
  error: string;
};


const App: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const youtube_parser = (url: string): string | false => {
    url = url.replace(/\?si=.*/, '');
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
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
      // FIX: Use the new ApiResponse type for the axios call
      const response = await axios.get<ApiResponse>(
        `/api/convert.php?id=${youtubeID}`
      );

      // FIX: Use a type guard ('link' in response.data) to safely access properties
      if ('link' in response.data && response.data.link) {
        setDownloadLink(response.data.link);
        setIsSearching(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your MP3 is ready for download.',
        });
      } else {
         // If there's no 'link', TypeScript knows it must be the error object.
         throw new Error(response.data.error || 'Invalid response from our server');
      }
    } catch (error: any) {
      console.error('Error:', error);
      // This logic now correctly handles errors thrown from the 'try' block
      // as well as network errors from axios.
      const errorMessage = error?.response?.data?.error || error.message || 'Something went wrong. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
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
