import { Coin } from "sdk/entities/coin";

export function getKey(coin: Coin): string {
  return coin.type;
}

export class CoinMap<TValue> {
  private map: Record<string, TValue> = {};

  public get size(): number {
    return Object.keys(this.map).length;
  }

  public set(key: Coin, val: TValue): this {
    this.map[getKey(key)] = val;
    return this;
  }

  public get(key: Coin): TValue | undefined {
    return this.map[getKey(key)];
  }

  public has(key: Coin): boolean {
    return this.map[getKey(key)] !== undefined;
  }

  public delete(key: Coin): this {
    delete this.map[getKey(key)];
    return this;
  }
}

export class CoinSet {
  private map: Record<string, Coin> = {};

  public static fromList(coins: Coin[]): CoinSet {
    return coins.reduce((set, coin) => set.add(coin), new CoinSet());
  }

  public toList(): Coin[] {
    return Object.values(this.map);
  }

  public get size(): number {
    return Object.keys(this.map).length;
  }

  public add(key: Coin): this {
    this.map[getKey(key)] = key;
    return this;
  }

  public has(key: Coin): boolean {
    return this.map[getKey(key)] !== undefined;
  }

  public delete(key: Coin): this {
    delete this.map[getKey(key)];
    return this;
  }

  public get(key: string): Coin | undefined {
    return this.map[key];
  }

  public get2(key: Coin): Coin | undefined {
    return this.map[getKey(key)];
  }

  public newReference(): CoinSet {
    const ref = new CoinSet();
    Object.assign(ref.map, this.map);
    return ref;
  }
}
