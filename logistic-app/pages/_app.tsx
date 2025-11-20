import * as React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFC107',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1A1A1A',
    },
    error: {
      main: '#D32F2F',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>CargoXpress</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}