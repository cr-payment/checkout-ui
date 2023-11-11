import { normalizeZrx } from "sdk/utils/normalizeZrx";
import invariant from "tiny-invariant";

type Metadata = {
  imageUrl?: string;
  ticker?: string;
  projectName?: string;
  description?: string;
};

export class Coin {
  public readonly packageObject: string;
  public readonly module: string;
  public readonly _name: string;
  public decimals: number;
  public readonly treasury?: string;
  public metadata?: Metadata;

  /**
   *  FOR LPS TOKENS
   */
  public coinA?: Coin;
  public coinB?: Coin;

  public constructor(
    packageObject: string,
    module: string,
    _name: string,
    decimals: number,
    treasury?: string,
    metadata?: Metadata,
  ) {
    invariant(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), "Invalid Decimal");
    this.packageObject = normalizeZrx(packageObject);
    this.module = module;
    this._name = _name;
    this.decimals = decimals;
    this.treasury = treasury ? normalizeZrx(treasury) : treasury;
    this.metadata = metadata;
  }

  public static fromType(type: string, decimals = 0, treasury?: string, metadata?: Metadata): Coin {
    const splitted = type.split("::");
    invariant(splitted.length === 3, `Type Parse Failed: ${type}`);
    return new Coin(splitted[0], splitted[1], splitted[2], decimals, treasury, metadata);
  }

  public static fromExtendedType(extendedType: string, decimals = 0, treasury?: string, metadata?: Metadata): Coin {
    const matches = extendedType.match(/.*<(.*)>/);
    invariant(matches?.[1], "Extended Type Parse Failed: ");
    return this.fromType(matches[1], decimals, treasury, metadata);
  }

  public static createLpCoin(type: string, decimals = 0, treasury?: string, metadata?: Metadata): Coin {
    if (!type.startsWith("0x")) {
      type = `0x${type}`;
    }
    const matches = type.match(/.*<(.*)>/);
    invariant(matches?.[1], "LP Type Parse Failed:" + type);
    let [typeA, typeB] = matches[1].split(", ");
    invariant(!!typeA || !!typeB, "LP Coin Type Parse Failed");
    const pkgId = type.substring(0, 66);
    if (!typeA.startsWith("0x")) {
      typeA = `0x${typeA}`;
    }
    if (!typeB.startsWith("0x")) {
      typeB = `0x${typeB}`;
    }
    const coinA = this.fromType(typeA); // TODO: Support decimal here
    const coinB = this.fromType(typeB); // TODO: Support decimal here
    const coin = this.fromType(`${pkgId}::pool::WISPLP`, decimals, treasury, metadata);
    coin.coinA = coinA;
    coin.coinB = coinB;
    return coin;
  }

  public get type(): string {
    if (this.coinA && this.coinB) {
      // LP case
      return `${this.packageObject}::pool::WISPLP<${this.coinA.type}, ${this.coinB.type}>`;
    }
    return this.packageObject + "::" + this.module + "::" + this._name;
  }

  public get name(): string {
    return this.metadata?.ticker || this._name;
  }

  public setDecimal(decimal: number): void {
    this.decimals = decimal;
  }

  public setMetadata(metadata: Metadata): void {
    this.metadata = metadata;
  }

  public clone(): Coin {
    const newCoin = new Coin(this.packageObject, this.module, this._name, this.decimals, this.treasury, this.metadata);
    newCoin.coinA = this.coinA;
    newCoin.coinB = this.coinB;
    return newCoin;
  }

  public sortsBefore(other: Coin): boolean {
    if (this.packageObject === this.packageObject) {
      if (this.module === other.module) {
        return this._name < other._name;
      }
      return this.module < other.module;
    }
    return this.packageObject < other.packageObject;
  }

  public equals(other?: Coin): boolean {
    if (other === undefined) {
      return false;
    }
    if (this.coinA && this.coinB) {
      return (
        (this.coinA.equals(other.coinA) && this.coinB.equals(other.coinB)) ||
        (this.coinA.equals(other.coinB) && this.coinB.equals(other.coinA))
      );
    }
    return this.packageObject === other.packageObject && this.module === other.module && this._name === other._name;
  }
}
