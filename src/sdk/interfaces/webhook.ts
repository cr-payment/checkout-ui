interface WebhookVerifyOptions {
  headers: Record<string, string>;
  payload: string;
  webhook_secret: string;
}

export { WebhookVerifyOptions };
