import { trimZeroes } from "./trimZeros";

export const formatNumber = (
  value: number | bigint | undefined,
  options?: Intl.NumberFormatOptions,
): string | undefined => {
  if (value === undefined) return value;
  return Intl.NumberFormat("en-us", {
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
};

export const toFixedDecimalPlaces = (number: string, decimalPlaces = 2): string => {
  const [natural, decimal] = number.split(".");
  if (!decimal || decimal.length <= decimalPlaces) {
    return number;
  }
  const fixedDecimal = decimal.substring(0, decimalPlaces);
  const trimmed = trimZeroes(`${natural}.${fixedDecimal}`);
  if (trimmed === "0") {
    if (decimalPlaces === 0) {
      return "<1";
    }
    return `<0.${new Array(decimalPlaces).join("0")}1`;
  }
  return trimmed;
};

export const toCommaSeparated = (number: string | undefined): string | undefined => {
  if (!number) return number;
  const negative = number.startsWith("-");
  let output = negative ? number.substring(1) : number;
  const dotIndex = output.indexOf(".");
  let commaIndex = dotIndex === -1 ? output.length - 3 : dotIndex - 3;
  while (commaIndex > 0) {
    output = output.substring(0, commaIndex) + "," + output.substring(commaIndex);
    commaIndex -= 3;
  }
  return `${negative ? "-" : ""}${output}`;
};
