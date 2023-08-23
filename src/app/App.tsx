/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';

import Bill from './components/Bill';
import {
  Box,
  Button,
  CssBaseline,
  Grid,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { GlobalStyle } from 'styles/global-styles';
import { polygonMumbai } from 'wagmi/chains';
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { CrPayment } from '../sdk';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBillSlice } from './billSlice';
import { selectBillData } from './billSlice/selectors';

const apiKey = process.env.REACT_APP_ALCHEMY_APIKEY!;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: apiKey })],
);
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const theme = createTheme({
  palette: { mode: 'light' },
  typography: {
    fontFamily: [
      'Roboto',
      'Segoe UI',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export function App() {
  const dispatch = useDispatch();
  const { actions } = useBillSlice();
  const billInfo = useSelector(selectBillData);

  useEffect(() => {
    // Function to get the value of a query parameter from the URL
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    // Read the 'param' query parameter from the URL
    const sessId = getQueryParam('session_id');
    const jsonDataURI = getQueryParam('json_data');
    console.log(jsonDataURI);
    const jsonData = JSON.parse(decodeURIComponent(jsonDataURI!));
    console.log(jsonData);
    const shipping = getQueryParam('shipping')!;
    const total = getQueryParam('total')!;
    const merchantAddress = getQueryParam('merchant_address')!;
    console.log(merchantAddress);

    if (sessId) {
      dispatch(
        actions.billRequestSuccess({
          ...billInfo,
          cart: jsonData,
          shipping: parseFloat(shipping),
          total: parseFloat(total),
          sessionId: parseInt(sessId),
          merchantAddress: merchantAddress,
        }),
      );

      localStorage.setItem('session_id ', sessId);
      console.log(jsonData);

      console.log(`Stored value '${sessId}' in localStorage.`);
    } else {
      console.log("No 'session_id' query parameter found in the URL.");
    }
  }, []);

  const [showComponent, setShowComponent] = useState(false);

  const handleButtonClick = () => {
    setShowComponent(true);
  };

  return (
    <WagmiConfig config={config}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <CssBaseline />
        <Box
          sx={{
            height: 100,
          }}
        />

        {!showComponent && (
          <>
            <Box
              sx={{
                height: 100,
              }}
            />
            <Grid container spacing={8}>
              <Grid item xs={5}></Grid>
              <Grid item xs={7}>
                <Button
                  onClick={handleButtonClick}
                  sx={{
                    height: 100,
                    width: 300,
                    backgroundColor: '#FAC898',
                    color: '#000000',
                  }}
                >
                  Continue to CrPayment
                </Button>
              </Grid>
            </Grid>
          </>
        )}

        {showComponent && (
          <Grid container spacing={8}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Bill />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        )}
      </ThemeProvider>
    </WagmiConfig>
  );
}
