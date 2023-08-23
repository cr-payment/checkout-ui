import { Box, Button, Container, Typography } from '@mui/material';
import { InfoLine } from './Bill';
import { useState } from 'react';
import ConnectWallet from './ConnectWallet';

const ChooseToken = () => (
  <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
    <Typography variant="h4">Choose token to pay</Typography>
  </Box>
);

const Pay = ({ billInfo }) => {
  const [openChooseToken, setOpenChooseToken] = useState(false);
  const [openConnectWallet, setOpenConnectWallet] = useState(false);

  const handleOpenChooseToken = () => {
    setOpenChooseToken(!openChooseToken); // Toggle visibility
  };
  const handleOpenConnectWallet = () => {
    setOpenConnectWallet(!openConnectWallet); // Toggle visibility
  };
  return (
    <div>
      <Typography variant="h5">Supported chains</Typography>
      {/* TODO merchant list wallet api here  */}
      <Button onClick={handleOpenChooseToken}>Choose token to pay</Button>
      {openChooseToken && <ChooseToken />}
      {openChooseToken && (
        <>
          <Button onClick={handleOpenConnectWallet}>Connect your wallet</Button>

          {openConnectWallet && <ConnectWallet />}
        </>
      )}
    </div>
  );
};

export default Pay;
