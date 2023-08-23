import { deflate } from 'pako';

const checkoutEndpoint = 'https://checkout.candypay.fun';

const returnPaymentURL = (sessionId: string, publicApiKey: string): string => {
  const compressedData = deflate(JSON.stringify({ sessionId, publicApiKey }));
  const encodedData = Buffer.from(compressedData).toString('base64');
  const urlEncodedData = encodeURIComponent(encodedData);
  return `${checkoutEndpoint}/pay?data=${urlEncodedData}`;
};

export { returnPaymentURL };
