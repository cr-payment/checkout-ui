import { Box, Button, Grid, Typography } from '@mui/material';
import {
  useAccount,
  useConnect,
  useContractWrite,
  useEnsName,
  usePrepareContractWrite,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import contractABI from './contractABI.json';
import { useBillSlice } from 'app/billSlice';
import { useSelector } from 'react-redux';
import { selectBillData } from 'app/billSlice/selectors';
import { Item } from './Pay';
import AlertDialog from './AlertDialog';

function Profile() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <>
      <Wallets handleClick={connect} />
      {/* {isConnected && (
        <Typography variant="body1">
          Connected to {ensName ?? address}
        </Typography>
      )} */}
    </>
  );
}

const wallets = ['Metamask', 'WalletConnect', 'Coinbase', 'TrustWallet'];

const Wallets = ({ handleClick }) => {
  return (
    <Grid container spacing={20}>
      {wallets.map((wallet, index) => (
        <Item
          key={index}
          imgPath={`image/wallets/${wallet}.png`}
          handleClick={handleClick}
          clicked="false"
        />
      ))}
    </Grid>
  );
};

const ConnectWallet = () => {
  const { actions } = useBillSlice();
  const billInfo = useSelector(selectBillData);

  const sessionId = billInfo!.sessionId;
  const merchantAddress = billInfo!.merchantAddress;
  const token = `0x${process.env.REACT_APP_TOKEN!}`;
  const total = billInfo!.total;
  const totalRounded = Math.round(total);

  const { config } = usePrepareContractWrite({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS!}`,
    abi: contractABI as any[],
    functionName: 'pay',
    args: [sessionId, merchantAddress, token, totalRounded],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <>
      <Box flexGrow={15} borderBottom="1px solid #ccc" my={4}></Box>
      <Typography variant="h5">Connect your wallet</Typography>
      <Box flexGrow={15} mx={2} my={2}></Box>
      <Wallets handleClick={connect} />
      <Box flexGrow={15} mx={2} my={2}></Box>
      <Grid container spacing={40}>
        <Grid item md={1}>
          <Button
            sx={{
              height: 60,
              width: 250,
              backgroundColor: '#FAC898',
              color: '#000000',
              borderRadius: '30px',
            }}
            onClick={() => write?.()}
            disabled={isSuccess}
          >
            <Typography variant="h6">
              {isConnected ? (isSuccess ? 'Paid' : `Pay with ${Math.floor(totalRounded)} USDT`) : 'Choose wallet'}
            </Typography>
          </Button>
        </Grid>
        <Grid item md={8}>
          {/* {isConnected && (
            <Typography variant="body1">
              Connected to {ensName ?? address}
            </Typography>
          )} */}
        </Grid>
      </Grid>
      {isSuccess && (
        <AlertDialog
          text={`Transaction successful ${JSON.stringify(
            data,
          )}\nCheck your order status at merchant site`}
          title="Payment successful notification"
          handleRedirect={() => {
            window.location.href = process.env.REACT_APP_MERCHANT_ENDPOINT!;
          }}
        />
      )}
      <Box flexGrow={15} mx={2} my={2}></Box>

      <div style={{ textAlign: 'center' }}>
        <Typography variant="h5">Or pay with QR</Typography>
        <Box flexGrow={15} mx={2} my={2}></Box>
        <img src="/image/qr.png" alt="" width="250px" height="250px" />
      </div>
      <Box flexGrow={15} mx={2} my={2}></Box>
    </>
  );
};
export default ConnectWallet;
