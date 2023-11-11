import { sqrt } from "../utils/sqrt";
import invariant from "tiny-invariant";

import { Amount } from "./amount";
import { Coin } from "./coin";
import { InsufficientInputAmountError, InsufficientReservesError } from "./error";
import { Price } from "./price";

export class Pool {
  public readonly packageObject: string;
  public readonly module: string;
  public readonly name: string;
  private readonly coinReserves: [Amount, Amount];
  public readonly liquidity: Amount; // for LP tokens
  public readonly volume24h: Amount | undefined;
  public readonly settingObject?: string;

  public constructor(
    packageObject: string,
    module: string,
    name: string,
    reserveA: Amount,
    reserveB: Amount,
    liquidity: Amount,
    volume24h?: Amount,
    settingObject?: string,
  ) {
    this.packageObject = packageObject;
    this.module = module;
    this.name = name;
    const coinReserves: [Amount, Amount] = reserveA.coin.sortsBefore(reserveB.coin)
      ? [reserveA, reserveB]
      : [reserveB, reserveA];
    this.coinReserves = coinReserves;
    this.liquidity = liquidity;
    this.volume24h = volume24h;
    this.settingObject = settingObject;
  }

  public get type(): string {
    return `${this.coin0.type}-${this.coin1.type}`;
  }

  public toString(): string {
    return `${this.coin0.name} - ${this.coin1.name}`;
  }

  public involvesCoin(coin: Coin): boolean {
    return coin.equals(this.coin0) || coin.equals(this.coin1);
  }

  public get coin0Price(): Price {
    const result = this.coinReserves[1].divide(this.coinReserves[0]);
    return new Price(this.coin0, this.coin1, result.denominator, result.numerator);
  }

  public get coin1Price(): Price {
    const result = this.coinReserves[0].divide(this.coinReserves[1]);
    return new Price(this.coin1, this.coin0, result.denominator, result.numerator);
  }

  public priceOf(coin: Coin): Price {
    invariant(this.involvesCoin(coin), "TOKEN");
    return coin.equals(this.coin0) ? this.coin0Price : this.coin1Price;
  }

  public get coin0(): Coin {
    return this.coinReserves[0].coin;
  }

  public get coin1(): Coin {
    return this.coinReserves[1].coin;
  }

  public get reserve0(): Amount {
    return this.coinReserves[0];
  }

  public get reserve1(): Amount {
    return this.coinReserves[1];
  }

  public equals(other?: Pool): boolean {
    if (other === undefined) {
      return false;
    }
    return (
      (this.coin0.equals(other.coin0) && this.coin1.equals(other.coin1)) ||
      (this.coin0.equals(other.coin1) && this.coin1.equals(other.coin0))
    );
  }

  public reserveOf(coin: Coin): Amount {
    invariant(this.involvesCoin(coin), "TOKEN");
    return coin.equals(this.coin0) ? this.reserve0 : this.reserve1;
  }

  public otherOf(coin: Coin): Coin {
    invariant(coin, "UNDEFINED");
    return this.coin0.equals(coin) ? this.coin1 : this.coin0;
  }

  public getOutputAmount(inputAmount: Amount): [Amount, Pool] {
    invariant(this.involvesCoin(inputAmount.coin), "TOKEN");
    if (this.reserve0.quotient === 0n || this.reserve1.quotient === 0n) {
      throw new InsufficientReservesError();
    }
    const inputReserve = this.reserveOf(inputAmount.coin);
    const outputReserve = this.reserveOf(inputAmount.coin.equals(this.coin0) ? this.coin1 : this.coin0);
    const inputAmountWithFee = inputAmount.quotient * 997n;
    const numerator = inputAmountWithFee * outputReserve.quotient;
    const denominator = inputReserve.quotient * 1000n + inputAmountWithFee;
    const outputAmount = Amount.fromRawAmount(
      inputAmount.coin.equals(this.coin0) ? this.coin1 : this.coin0,
      numerator / denominator,
    );
    if (outputAmount.quotient === 0n) {
      throw new InsufficientInputAmountError();
    }
    return [
      outputAmount,
      new Pool(
        this.packageObject,
        this.module,
        this.name,
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
        this.liquidity,
        this.volume24h,
        this.settingObject,
      ),
    ];
  }

  public safetyGetOutputAmount(inputAmount: Amount): [Amount, Pool] {
    try {
      return this.getOutputAmount(inputAmount);
    } catch (error) {
      if ((error as InsufficientInputAmountError).isInsufficientInputAmountError) {
        return [Amount.fromRawAmount(inputAmount.coin.equals(this.coin0) ? this.coin1 : this.coin0, 0n), this];
      } else {
        throw error;
      }
    }
  }

  public getInputAmount(outputAmount: Amount): [Amount, Pool] {
    invariant(this.involvesCoin(outputAmount.coin), "TOKEN");
    if (
      this.reserve0.quotient === 0n ||
      this.reserve1.quotient === 0n ||
      outputAmount.quotient >= this.reserveOf(outputAmount.coin).quotient
    ) {
      throw new InsufficientReservesError();
    }

    const outputReserve = this.reserveOf(outputAmount.coin);
    const inputReserve = this.reserveOf(outputAmount.coin.equals(this.coin0) ? this.coin1 : this.coin0);
    const numerator = inputReserve.quotient * outputAmount.quotient * 1000n;
    const denominator = (outputReserve.quotient - outputAmount.quotient) * 997n;
    const inputAmount = Amount.fromRawAmount(
      outputAmount.coin.equals(this.coin0) ? this.coin1 : this.coin0,
      numerator / denominator + 1n,
    );
    return [
      inputAmount,
      new Pool(
        this.packageObject,
        this.module,
        this.name,
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
        this.liquidity,
        this.volume24h,
        this.settingObject,
      ),
    ];
  }

  public getLiquidityMinted(coinAmountA: Amount, coinAmountB: Amount): Amount {
    const coinAmounts: [Amount, Amount] = coinAmountA.coin.sortsBefore(coinAmountB.coin)
      ? [coinAmountA, coinAmountB]
      : [coinAmountB, coinAmountA];
    invariant(coinAmounts[0].coin.equals(this.coin0) && coinAmounts[1].coin.equals(this.coin1), "TOKEN");

    let newLiquidity: bigint;
    if (this.liquidity.quotient === 0n) {
      newLiquidity = sqrt(coinAmounts[0].quotient * coinAmounts[1].quotient) - 10n;
    } else {
      const amount0 = (coinAmounts[0].quotient * this.liquidity.quotient) / this.reserve0.quotient;
      const amount1 = (coinAmounts[1].quotient * this.liquidity.quotient) / this.reserve1.quotient;
      newLiquidity = amount0 <= amount1 ? amount0 : amount1;
    }
    if (newLiquidity <= 0n) {
      throw new InsufficientInputAmountError();
    }
    return Amount.fromRawAmount(this.liquidity.coin, newLiquidity);
  }

  public getLiquidityValue(coin: Coin, userLiquidity: Amount): Amount {
    invariant(this.involvesCoin(coin), "TOKEN");
    invariant(
      userLiquidity.coin.equals(this.liquidity.coin),
      `LIQUIDITY: ${userLiquidity.coin.type} - ${this.liquidity.coin.type}`,
    );
    invariant(userLiquidity.quotient <= this.liquidity.quotient, "LIQUIDITY");

    return Amount.fromRawAmount(
      coin,
      (userLiquidity.quotient * this.reserveOf(coin).quotient) / this.liquidity.quotient,
    );
  }

  public getZapInSwapAmount(coinIn: Coin, amtIn: bigint): Amount {
    const resIn = this.reserveOf(coinIn).quotient;
    const swapAmtIn =
      (sqrt(1997n ** 2n * resIn ** 2n + 4n * 997n * 1000n * amtIn * resIn) - 1997n * resIn) / (2n * 997n);
    return Amount.fromRawAmount(coinIn, swapAmtIn);
  }

  // given an amount of a single-side coin, return the LP tokens minted
  // https://blog.alphafinance.io/onesideduniswap/
  public getZapInLiquidityMinted(coinIn: Coin, amtIn: bigint): Amount {
    const amountSwapIn = this.getZapInSwapAmount(coinIn, amtIn);
    const [amountDepositOut] = this.getOutputAmount(amountSwapIn);
    const resOut = this.reserveOf(amountDepositOut.coin);
    const amountLP =
      (amountDepositOut.quotient * this.liquidity.quotient) / (resOut.quotient - amountDepositOut.quotient);
    return Amount.fromRawAmount(this.liquidity.coin, amountLP);
  }
}
