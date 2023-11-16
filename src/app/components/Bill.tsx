import * as React from 'react';
import Button from '@mui/material/Button';
import { useBillSlice } from '../billSlice';
import { selectBill, selectBillData } from '../billSlice/selectors';
import { useSelector } from 'react-redux';

import { Typography, Box, Grid } from '@mui/material';
import Pay from './Pay';

// TODO: thêm font cho Typography (theo theme?)
export const InfoLine = ({ label, value }) => {
  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body1">{label}</Typography>
      <Box flexGrow={1} mx={2}></Box>
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Box>
  );
};

export const ImageAndText = ({quantity, imgPath, label, value }) => {
  return (
    <Box display="flex" alignItems="center">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>{quantity} x </p>
        <img src={imgPath} width="50px" height="50px" style={{ marginRight: '50px' }} />
        <Typography variant="body1">{label}</Typography>
      </div>
      <Box flexGrow={1} mx={2}></Box>
      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
        {`$ ${value}`}
      </Typography>
    </Box>
  );
};
const Cart = ({ billInfo }) => {
  console.log(123, billInfo)
  return (
    <div>
      {billInfo?.cart.map((bill: { name: string; price: number, img: string, quantity: number }, index) => (
        <>
          <Box flexGrow={15} mx={2} my={2}></Box>

          <ImageAndText key={index} imgPath={bill.img} label={bill.name} value={bill.price} quantity={bill.quantity} />

        </>
      ))}
      <Box flexGrow={15} borderBottom="1px solid #ccc" my={4}></Box>

      <InfoLine label="Shipping" value={`$ ${billInfo?.shipping}`} />
      <InfoLine label="Total" value={`$ ${billInfo?.total}`} />
      {/* TODO paid in ... tokens */}
    </div>
  );
};

export default function Bill() {
  const [open, setOpen] = React.useState(false);

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  //   load billInfo? from state
  const { actions } = useBillSlice();
  const billInfo = useSelector(selectBillData);
  console.log(111, billInfo)
  const fullPhoneNumber = (billInfo?.countryCode ? billInfo?.countryCode : "") + " " + billInfo?.phoneNumber
  // if(bill)
  return (
    <div>
      <Grid container spacing={10}>
        <Grid item xs={6}>
          <Typography variant="h5">Pay to {billInfo?.shopName}</Typography>

          <Box display="flex" alignItems="center">
            <Typography variant="h3">$ {billInfo?.total}</Typography>
            <Box flexGrow={1} mx={2}></Box>
            <img
              src="logo.jpg"
              width="150"
              className="me-2"
              style={{ border: '2px solid #000' }}
            />
          </Box>
          <Typography variant="h5">Cart</Typography>
          <Cart billInfo={billInfo} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Billing Information</Typography>
          <InfoLine label="Name" value={billInfo?.name} />
          <InfoLine label="Email" value={billInfo?.email} />
          <InfoLine label="Number" value={fullPhoneNumber} />
          <Pay billInfo={billInfo} />
        </Grid>
      </Grid>
    </div>
  );
}
