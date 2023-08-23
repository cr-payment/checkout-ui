import { Box, Typography } from '@mui/material';
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useEnsName,
  usePrepareContractWrite,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import contractABI from './contractABI.json';
import { useBillSlice } from 'app/billSlice';
import { useSelector } from 'react-redux';
import { selectBillData } from 'app/billSlice/selectors';

function Profile() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  if (isConnected) return <div>Connected to {ensName ?? address}</div>;
  return <button onClick={() => connect()}>Connect Wallet</button>;
}

const ConnectWallet = () => {
  const { actions } = useBillSlice();
  const billInfo = useSelector(selectBillData);
  //   const abi = contractABI as const // <--- const assertion
  // const { data } = useContractRead({ abi })

  const sessionId = billInfo!.sessionId;
  const merchantAddress = billInfo!.merchantAddress;
  const token = `0x${process.env.REACT_APP_TOKEN!}`;
  const total = billInfo!.total;
  const totalRounded = Math.round(total);

  const { config } = usePrepareContractWrite({
    address: `0x${process.env.REACT_APP_CONTRACT_ADDRESS}`,
    abi: contractABI as any[],
    functionName: 'pay',
    args: [
      sessionId,
      merchantAddress,
      `0x${process.env.REACT_APP_TOKEN}`,
      totalRounded,
    ],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <Typography variant="h4">Connect your wallet</Typography>
      <Profile />
      <div>
        <button onClick={() => write?.()}>Feed</button>
        {isLoading && <div>Check Wallet</div>}
        {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </div>
    </Box>
  );
};
export default ConnectWallet;
