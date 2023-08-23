import { Webhook } from 'svix';

const verifyWebhookSignature = async (options: {
  webhook_secret: string;
  payload: any;
  headers: any;
}): Promise<void> => {
  const webhook = new Webhook(options.webhook_secret);

  try {
    await webhook.verify(options.payload, options.headers);
  } catch (error) {
    throw new Error('Invalid webhook signature');
  }
};

export { verifyWebhookSignature };
