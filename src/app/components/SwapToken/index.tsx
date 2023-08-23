import {
  Button,
  DialogActions,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Box, Dialog, DialogContent, InputLabel, Select } from '@mui/material';
import { DialogContentText, DialogTitle, FormControl } from '@mui/material';
import { useState } from 'react';

export interface ISwapTokenProps {
  open: boolean;
  onClose: () => void;
}

export default function SwapToken({ open, onClose }: ISwapTokenProps) {
  const [tokenBefore, setTokenBefore] = useState<string>('');
  const [tokenAfter, setTokenAfter] = useState<string>('');

  const handleChangeTokenBefore = (event: SelectChangeEvent<string>) => {
    setTokenBefore(event.target.value);
  };

  const handleChangeTokenAfter = (event: SelectChangeEvent<string>) => {
    setTokenAfter(event.target.value);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <DialogTitle>Choose your token to pay</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We will perform action to swap from your token into payment token,
            then pay with payment token. These action costs higher fee than pay
            directly with supported tokens.
          </DialogContentText>

          <Box sx={{ textAlign: 'center', my: 3 }}>
            <FormControl fullWidth sx={{ maxWidth: '200px' }}>
              <InputLabel>Your Token</InputLabel>
              <Select
                value={tokenBefore}
                label="Your Token"
                onChange={handleChangeTokenBefore}
              >
                <MenuItem value="aave">Aave</MenuItem>
                <MenuItem value="usdc">USDC</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h5" sx={{ my: 2 }}>
              To
            </Typography>

            <FormControl fullWidth sx={{ maxWidth: '200px' }}>
              <InputLabel>Token Swap</InputLabel>
              <Select
                value={tokenAfter}
                label="Token Swap"
                onChange={handleChangeTokenAfter}
              >
                <MenuItem value="usdt">USDT</MenuItem>
                <MenuItem value="weth">WETH</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={onClose}>
            Swap
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
