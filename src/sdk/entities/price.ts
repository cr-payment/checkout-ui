import invariant from "tiny-invariant";
import { FormatOptions } from "toformat";

import { BigintIsh, Rounding } from "c:/Users/quang/Downloads/interface/interface/src/sdk/constants";
import { Amount } from "./amount";
import { Coin } from "./coin";
import { Fraction } from "./fraction";

export class Price extends Fraction {
  public readonly baseCoin: Coin;
  public readonly quoteCoin: Coin;
  public readonly scalar: Fraction;

  public constructor(baseCoin: Coin, quoteCoin: Coin, denominator: BigintIsh, numerator: BigintIsh) {
    super(numerator, denominator);

    this.baseCoin = baseCoin;
    this.quoteCoin = quoteCoin;
    this.scalar = new Fraction(10n ** BigInt(baseCoin.decimals), 10n ** BigInt(quoteCoin.decimals));
  }

  public invert(): Price {
    return new Price(this.quoteCoin, this.baseCoin, this.numerator, this.denominator);
  }

  public multiply(other: Price): Price {
    invariant(this.quoteCoin.equals(other.baseCoin), "TOKEN");
    const fraction = super.multiply(other);
    return new Price(this.baseCoin, other.quoteCoin, fraction.denominator, fraction.numerator);
  }

  public quote(amount: Amount): Amount {
    invariant(amount.coin.equals(this.baseCoin), "TOKEN");
    const result = super.multiply(amount);
    return Amount.fromFractionalAmount(this.quoteCoin, result.numerator, result.denominator);
  }

  private get adjustedForDecimals(): Fraction {
    return super.multiply(this.scalar);
  }

  public toSignificant(significantDigits = 6, format?: FormatOptions, rounding?: Rounding): string {
    return this.adjustedForDecimals.toSignificant(significantDigits, format, rounding);
  }

  public toFixed(decimalPlaces = 4, format?: FormatOptions, rounding?: Rounding): string {
    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding);
  }
}
