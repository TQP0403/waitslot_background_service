export enum LeaderboardType {
  REFERRAL,
  BALANCE,
}

export enum LeaderboardRanking {
  NO_LEADER,
  ENTRY_LEADER,
  POTENTAIL_LEADER,
  FUTURE_LEADER,
  POWER_LEADER,
  ALPHA_LEADER,
}

export interface IDayData {
  totalHolder: number;
  totalBalance: number;
}
