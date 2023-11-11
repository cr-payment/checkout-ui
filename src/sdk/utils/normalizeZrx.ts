export function normalizeZrx(zrx: string): string {
  const [, val] = zrx.split("x");
  if (val.length >= 64) {
    return zrx;
  }
  return `0x${new Array(64 - val.length + 1).join("0")}${val}`;
}
