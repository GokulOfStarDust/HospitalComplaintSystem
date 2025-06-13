import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';



const theme = createTheme({
  palette: {
    primary: {
      main: '#04B7B1',
    },
    secondary: {
      main: '#616161',
    },
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
});


createRoot(document.getElementById('root')).render(

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
)
