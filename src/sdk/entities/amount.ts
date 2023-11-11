import _Big from "big.js";
import invariant from "tiny-invariant";
import toFormat, { FormatOptions } from "toformat";

import { BigintIsh, Rounding } from "../constants";
import { toFixedDecimalPlaces } from "../utils/formatNumber";
import { Coin } from "./coin";
import { Fraction } from "./fraction";

const Big = toFormat(_Big);

export class Amount extends Fraction {
  public readonly coin: Coin;
  public readonly decimalScale: bigint;

  protected constructor(coin: Coin, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator);
    this.coin = coin;
    this.decimalScale = 10n ** BigInt(coin.decimals);
  }

  public static fromRawAmount(coin: Coin, rawAmount: BigintIsh): Amount {
    return new Amount(coin, rawAmount);
  }

  public static fromFractionalAmount(coin: Coin, numerator: BigintIsh, denominator: BigintIsh): Amount {
    return new Amount(coin, numerator, denominator);
  }

  public static min(amount1: Amount, amount2: Amount): Amount {
    invariant(amount1.coin.equals(amount2.coin), "Diff Coin");
    if (amount1.lessThan(amount2)) {
      return amount1;
    }
    return amount2;
  }

  public add(other: Amount): Amount {
    invariant(this.coin.equals(other.coin), "Diff Coin");
    const added = super.add(other);
    return Amount.fromFractionalAmount(this.coin, added.numerator, added.denominator);
  }

  public subtract(other: Amount): Amount {
    invariant(this.coin.equals(other.coin), "Diff Coin");
    const subtracted = super.subtract(other);
    return Amount.fromFractionalAmount(this.coin, subtracted.numerator, subtracted.denominator);
  }

  public multiply(other: Fraction | BigintIsh): Amount {
    const multiplied = super.multiply(other);
    return Amount.fromFractionalAmount(this.coin, multiplied.numerator, multiplied.denominator);
  }

  public divide(other: Fraction | BigintIsh): Amount {
    const divided = super.divide(other);
    return Amount.fromFractionalAmount(this.coin, divided.numerator, divided.denominator);
  }

  public toSignificant(
    significantDigits = 6,
    format?: FormatOptions,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return super.divide(this.decimalScale).toSignificant(significantDigits, format, rounding);
  }

  public toFixed(
    decimalPlaces: number = this.coin.decimals,
    format?: FormatOptions,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    invariant(decimalPlaces <= this.coin.decimals, "DECIMALS");
    return super.divide(this.decimalScale).toFixed(decimalPlaces, format, rounding);
  }

  public toExact(format: FormatOptions = { groupSeparator: "," }, decimal: number | null = null): string {
    Big.DP = this.coin.decimals;
    const big = new Big(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format);
    if (typeof decimal !== "number") {
      return big;
    }
    return toFixedDecimalPlaces(big, decimal);
  }

  public toExactNumber(): number {
    const exactStr = this.toExact({ groupSeparator: "" });
    return Number(exactStr);
  }

  public toExactBigint(): bigint {
    return super.divide(this.decimalScale).quotient;
  }
}
