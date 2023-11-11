import _Big from "big.js";
import _Decimal from "decimal.js-light";
import invariant from "tiny-invariant";
import toFormat, { FormatOptions } from "toformat";

import { BigintIsh, Rounding } from "../constants";
import { trimZeroes } from "../utils/trimZeros";

const Decimal = toFormat(_Decimal);
const Big = toFormat(_Big);

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: _Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: _Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: _Decimal.ROUND_UP,
};

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: 0, // Big.roundDown not work
  [Rounding.ROUND_HALF_UP]: 1,
  [Rounding.ROUND_UP]: 2,
};

export class Fraction {
  public readonly numerator: bigint;
  public readonly denominator: bigint;

  public constructor(numerator: BigintIsh, denominator: BigintIsh = 1n) {
    this.numerator = BigInt(numerator as bigint);
    this.denominator = BigInt(denominator as bigint);
  }

  private static tryParseFraction(fractionish: BigintIsh | Fraction): Fraction {
    if (typeof fractionish === "bigint" || typeof fractionish === "number" || typeof fractionish === "string")
      return new Fraction(fractionish);

    if ("numerator" in fractionish && "denominator" in fractionish) return fractionish;
    throw new Error("Could not parse fraction");
  }

  public static fromDecimal(decimal: string): Fraction {
    const dotIdx = decimal.indexOf(".");
    if (dotIdx === -1) {
      return this.tryParseFraction(decimal);
    }
    const numerator = BigInt(decimal.replace(".", ""));
    const denominator = 10n ** BigInt(decimal.length - dotIdx - 1);
    return new Fraction(numerator, denominator);
  }

  // performs floor division
  public get quotient(): bigint {
    return this.numerator / this.denominator;
  }

  // remainder after floor division
  public get remainder(): Fraction {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator);
  }

  public add(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    if (this.denominator === otherParsed.denominator) {
      return new Fraction(this.numerator + otherParsed.numerator, this.denominator);
    }
    return new Fraction(
      this.numerator * otherParsed.denominator + otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator,
    );
  }

  public subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    if (this.denominator === otherParsed.denominator) {
      return new Fraction(this.numerator - otherParsed.numerator, this.denominator);
    }
    return new Fraction(
      this.numerator * otherParsed.denominator - otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator,
    );
  }

  public lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator < otherParsed.numerator * this.denominator;
  }

  public equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator === otherParsed.numerator * this.denominator;
  }

  public greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator > otherParsed.numerator * this.denominator;
  }

  public multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(this.numerator * otherParsed.numerator, this.denominator * otherParsed.denominator);
  }

  public divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(this.numerator * otherParsed.denominator, this.denominator * otherParsed.numerator);
  }

  public toSignificant(
    significantDigits: number,
    format: FormatOptions = { groupSeparator: "" },
    rounding: Rounding = Rounding.ROUND_HALF_UP,
  ): string {
    invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
    invariant(significantDigits > 0, `${significantDigits} is not positive.`);

    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding],
    });
    const quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits);
    return trimZeroes(quotient.toFormat(quotient.decimalPlaces(), format), {
      decimalSeparator: format.decimalSeparator,
    });
  }

  public toFixed(
    decimalPlaces: number,
    format: FormatOptions = { groupSeparator: "" },
    rounding: Rounding = Rounding.ROUND_HALF_UP,
  ): string {
    invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  }

  /**
   * Helper method for converting any super class back to a fraction
   */
  public get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }
}
