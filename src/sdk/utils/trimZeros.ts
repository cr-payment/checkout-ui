export function trimZeroes(value: string, options?: { decimalPlaces?: number; decimalSeparator?: string }): string {
  const decimalSeparator = options?.decimalSeparator ?? ".";
  const decimalPlaces = options?.decimalPlaces ?? undefined;
  let _val = value;
  if (typeof decimalPlaces === "number") {
    const dotIdx = _val.indexOf(decimalSeparator);
    if (dotIdx !== -1) {
      _val = _val.substring(0, dotIdx + decimalPlaces + 1);
    }
  }
  const reDS = !decimalSeparator || decimalSeparator === "." ? "\\." : decimalSeparator;
  const replacer = `(${reDS}[0-9]*[1-9])0+$|${reDS}0*$`;
  const re = new RegExp(replacer);
  return _val.replace(re, "$1");
}
