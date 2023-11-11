import invariant from "tiny-invariant";

import { Coin } from "./coin";
import { Pool } from "./pool";
import { Price } from "./price";

export class Route {
  public readonly pools: Pool[];
  public readonly path: Coin[];
  public readonly input: Coin;
  public readonly output: Coin;

  public constructor(pools: Pool[], input: Coin, output: Coin) {
    invariant(pools.length > 0, "PAIRS");
    invariant(pools[0]?.involvesCoin(input), "INPUT");
    invariant(pools[pools.length - 1]?.involvesCoin(output), "OUTPUT");

    const path: Coin[] = [input];
    for (const [i, pool] of pools.entries()) {
      const currentInput = path[i];
      invariant(currentInput && pool.involvesCoin(currentInput), "PATH");
      const output = currentInput.equals(pool.coin0) ? pool.coin1 : pool.coin0;
      path.push(output);
    }

    this.pools = pools;
    this.path = path;
    this.input = input;
    this.output = output;
  }

  private _midPrice: Price | null = null;

  public get midPrice(): Price {
    if (this._midPrice !== null) {
      return this._midPrice;
    }
    const prices: Price[] = [];
    for (const [i, pool] of this.pools.entries()) {
      prices.push(
        this.path[i]?.equals(pool.coin0)
          ? new Price(pool.reserve0.coin, pool.reserve1.coin, pool.reserve0.quotient, pool.reserve1.quotient)
          : new Price(pool.reserve1.coin, pool.reserve0.coin, pool.reserve1.quotient, pool.reserve0.quotient),
      );
    }

    invariant(prices[0] !== undefined, "PRICE");
    const reduced = prices
      .slice(1)
      .reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0]);
    return (this._midPrice = new Price(this.input, this.output, reduced.denominator, reduced.numerator));
  }
}
