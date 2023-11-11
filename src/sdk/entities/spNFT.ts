import { Amount } from "./amount";
import { Coin } from "./coin";

export class SpNFT {
  public readonly packageObject: string;
  public readonly module: string;
  public readonly name: string;
  public readonly stakingCoin: Coin;
  public readonly objectId: string;
  public readonly boostBalance: Amount;
  public readonly boostMultiplier: number;
  public readonly stakingBalance: Amount;
  public readonly rewardDebt: bigint;
  public readonly stakePoint: bigint;
  public readonly stakePoolId: string;
  public readonly unlockTime: Date | null;
  public readonly lockPeriod: number;

  constructor({
    packageObject,
    module,
    name,
    stakingCoin,
    objectId,
    boostBalance,
    boostMultiplier,
    stakingBalance,
    rewardDebt,
    stakePoint,
    stakePoolId,
    unlockTime,
    lockPeriod,
  }: {
    packageObject: string;
    module: string;
    name: string;
    stakingCoin: Coin;
    objectId: string;
    boostBalance: Amount;
    boostMultiplier: number;
    stakingBalance: Amount;
    rewardDebt: bigint;
    stakePoint: bigint;
    stakePoolId: string;
    unlockTime: Date | null;
    lockPeriod: number;
  }) {
    this.packageObject = packageObject;
    this.module = module;
    this.name = name;
    this.stakingCoin = stakingCoin;
    this.objectId = objectId;
    this.boostBalance = boostBalance;
    this.boostMultiplier = boostMultiplier;
    this.stakingBalance = stakingBalance;
    this.rewardDebt = rewardDebt;
    this.stakePoint = stakePoint;
    this.stakePoolId = stakePoolId;
    this.unlockTime = unlockTime;
    this.lockPeriod = lockPeriod;
  }
}
