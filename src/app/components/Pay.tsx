import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { InfoLine } from './Bill';
import { useState } from 'react';
import ConnectWallet from './ConnectWallet';
import { chainData as chains } from '../data';
import { useWallet } from "@suiet/wallet-kit";
import { useWalletHelper } from "contexts/WalletHelperContext";
import { ButtonSui } from './ButtonSui';
const ChooseToken = ({ chain, handleClick }) => (
  <>
    <Box flexGrow={15} borderBottom="1px solid #ccc" my={4}></Box>

    <Typography variant="h5">Choose token to pay</Typography>
    <Box flexGrow={15} mx={2} my={2}></Box>

    <Grid container spacing={20}>
      {chain.tokens.map((token, index) => (
        <Item
          key={index}
          imgPath={`image/tokens/${token.name}.jpg`}
          handleClick={handleClick}
          clicked="false"
        />
      ))}
    </Grid>
  </>
);
export const Item = ({ imgPath, handleClick, clicked }) => {
  const [isClicked, setIsClicked] = useState(false);

  const clickItem = () => {
    setIsClicked(!isClicked);
    handleClick();
  };
  return (
    <Grid item xs={12} sm={4} md={2}>
      <Button
        variant="outlined"
        onClick={clickItem}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isClicked ? '#f7d7ba' : '#ffffff',
          borderRadius: '30px',
          width: '100px',
          '&:hover': {
            backgroundColor: '#f7d7ba', // Change to your desired hover color
            cursor: 'pointer',
          },
        }}
      >
        <img src={imgPath} width="50px" height="50px" />
      </Button>
    </Grid>
  );
};

const Chains = ({ chains, handleClick }) => {
  return (
    <Grid container spacing={20}>
      {chains.map((chain, index) => (
        <Item
          key={index}
          imgPath={`image/chains/${chain.name}.png`}
          handleClick={() => handleClick(index)}
          clicked="false"
        />
      ))}
    </Grid>
  );
};

const Pay = ({ billInfo, onBoostClick }) => {
  const [openChooseToken, setOpenChooseToken] = useState(false);
  const [openConnectWallet, setOpenConnectWallet] = useState(false);
  const [atChain, setAtChain] = useState<number>(1);
  const [token, setToken] = useState<string>('');
  const { adapter } = useWallet();
  const { lpBalances, fungibleBalances, setOpenSelectWallet } = useWalletHelper();
  const handleStakeClick = (): void => {
    // if (!farm || !amount || !amount.greaterThan(0)) {
    //   return;
    // }
    const amount = 0;
    const farm = 0;
    const isLock = 0;
    const lockPeriod = 1;
    onBoostClick(amount, farm, isLock ? lockPeriod : 0);
  };
  const handleOpenChooseToken = index => {
    setAtChain(index);
    // console.log(atChain);
    setOpenChooseToken(true); // Toggle visibility
  };
  const handleOpenConnectWallet = tokenName => {
    setToken(tokenName);
    setOpenConnectWallet(true); // Toggle visibility
  };
  return (
    <div>
      <Typography variant="h5">Supported chains</Typography>
      <div>
        {!adapter ? (
          <ButtonSui
            className="px-6 py-3 w-full text-xl font-Poppins whitespace-pre-wrap"
            onClick={(): void => setOpenSelectWallet(true)}
          >
            Connect Wallet
          </ButtonSui>
        )
          :
          (
            <ButtonSui
              className="px-6 py-3 w-full text-xl font-Poppins whitespace-pre-wrap"
              // disabled={Boolean(errorMsg)}
              // isLoading={isLoading}
              onClick={handleStakeClick}
            >
            </ButtonSui>
        )}
      </div>
      <Box flexGrow={15} mx={2} my={2}></Box>

      <Chains chains={chains} handleClick={handleOpenChooseToken} />

      {openChooseToken && (
        <ChooseToken
          chain={chains[atChain]}
          handleClick={handleOpenConnectWallet}
        />
      )}
      {openChooseToken && <>{openConnectWallet && <ConnectWallet />}</>}
    </div>
  );
};

export default Pay;
