import { CrPayment } from '../sdk';

// Step 1: create CrPayment object
const crPayment = new CrPayment({
  api_keys: {
    public_api_key: 'string',
    private_api_key: 'string',
  },
  network: 'testnet',
});

const createSession = async () => {
  // Step 2: create session payment by calling this function
  const session = await crPayment.session.create({
    itemId: '1',
    amount: '1',
  });

  console.log('session', session);
  return session;
};

const getSession = async (sessionId: string) => {
  console.log('sessionId', sessionId);
  // Step 3: get session payment by calling this function
  const session = await crPayment.session.getPaymentState({
    session_id: sessionId,
  });

  console.log('session', session);
  return session;
};

// test create session
// createSession()
// .catch(error => {
//     console.log("error", error);
// })

// test get session
getSession('331692469592739300').catch(error => {
  console.log('error', error);
});
