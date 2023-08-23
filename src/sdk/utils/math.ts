const preciseRound = (value: number, precision: number = 0): number => {
  const factor = precision ? Math.pow(10, precision) : 1;
  return Math.ceil(value * factor) / factor;
};

export { preciseRound };
